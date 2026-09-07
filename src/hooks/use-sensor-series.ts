import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { supabase } from '../lib/supabase';

type Calibration = {
  cap_empty: number;
  cap_full: number;
  lig_base: number;
  lig_dead: number;
  humid_high: number;
};

// ponytail: fallback kalau tabel sensor_calibration kosong/gak keload — sama dengan
// default lama sebelum kalibrasi dipindah ke Settings web (tabel `sensor_calibration`).
// Diturunkan dari data kalibrasi asli (P001-P007 + sesi OSTOSENSE_*). cap_empty/
// cap_full dari median Kap_7 kondisi kering (P001) vs kantong penuh (P007,
// dipangkas dari noise). lig_base/lig_dead dari rata-rata Res_15+Res_16: kontak
// cairan bikin nilai NAIK (kebalik dari asumsi simulator lama), jadi lig_base
// < lig_dead di sini.
const DEFAULT_CALIBRATION: Calibration = {
  cap_empty: 30000,
  cap_full: 250000,
  lig_base: 10,
  lig_dead: 1470,
  humid_high: 60,
};

// ponytail: belum ada kolom kalibrasi khusus buat ambang integritas kulit di
// sensor_calibration — hardcode di sini sampai ada kebutuhan diedit dari Settings.
const SKIN_INTEGRITY_WARNING_BELOW = 50;

const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

export type SensorQuality = { cap: string | null; lig: string | null; system: string | null };

// Kap_4/Kap_5/Res_16 — channel yang direkam hardware tapi belum ada makna/kalibrasi
// produk sendiri (Kap_7 dikunci sebagai kanal kapasitif utama, Res_15+Res_16
// dirata-rata jadi satu "kulit"). Ditampilkan mentah sebagai diagnostik, bukan
// metrik dengan threshold seperti volume/kulit.
export type SensorDiagnostics = { res16: number | null; kap4: number | null; kap5: number | null };

export type SensorSeries = {
  source: 'supabase' | 'fallback' | 'loading';
  // Kapan fetch sensor_logs terakhir SUKSES — dipakai buat deteksi device offline/data usang
  // (lihat AiStatusCard). null berarti belum pernah berhasil sejak app dibuka.
  lastUpdatedAt: number | null;
  quality: SensorQuality;
  diagnostics: SensorDiagnostics;
  volume: { labels: string[]; data: number[]; current: number; status: string };
  // Integritas hidrokoloid/baseplate dari sensor LIG (resistif) — BUKAN dari sensor
  // kapasitif kantong. Tidak ada sensor kelembaban kulit terpisah di hardware ini,
  // jadi field "kelembaban" lama (yang sebenarnya dihitung dari kapasitansi kantong)
  // dihapus daripada dipalsukan seolah data kulit.
  kulit: { labels: string[]; data: number[]; current: number; status: string };
  history: { time: string; desc: string; status: 'Normal' | 'Tinggi' }[];
};

const FALLBACK: SensorSeries = {
  source: 'loading',
  lastUpdatedAt: null,
  quality: { cap: null, lig: null, system: null },
  diagnostics: { res16: null, kap4: null, kap5: null },
  volume: {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    data: [0, 0, 0, 0, 0, 0],
    current: 0,
    status: 'Memuat data...',
  },
  kulit: {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    data: [0, 0, 0, 0, 0, 0],
    current: 0,
    status: 'Memuat data...',
  },
  history: [],
};

export function useSensorSeries() {
  const [series, setSeries] = useState<SensorSeries>(FALLBACK);
  const calibrationRef = useRef<Calibration>(DEFAULT_CALIBRATION);

  const fetchSensorData = async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_logs')
        .select('timestamp, capacitance_raw, lig_raw, cap_quality, lig_quality, system_quality, res_16_raw, kap_4_raw, kap_5_raw')
        .order('timestamp', { ascending: false })
        .limit(120);

      if (error || !data || data.length === 0) return;

      const logs = data.reverse();
      const { cap_empty, cap_full, lig_base, lig_dead } = calibrationRef.current;

      const volPct = (cap: number) => clamp(((cap - cap_empty) / (cap_full - cap_empty)) * 100);
      const integPct = (lig: number) => clamp(((lig - lig_dead) / (lig_base - lig_dead)) * 100);

      const hhmm = (iso: string) => {
        const d = new Date(iso);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      };

      const pick = (n: number) =>
        Array.from({ length: n }, (_, i) => logs[Math.floor((i * (logs.length - 1)) / (n - 1))]);
      const pts = pick(6);

      const last = logs[logs.length - 1];
      const currentVol = volPct(last.capacitance_raw);
      const currentInteg = integPct(last.lig_raw);

      const historyData = pts.slice().reverse().map((p, i) => {
          const kind = i % 2;
          const val = kind === 0 ? volPct(p.capacitance_raw) : integPct(p.lig_raw);
          const label = kind === 0 ? 'Volume' : 'Integritas Kulit';
          const flagged = kind === 0 ? val > 80 : val < SKIN_INTEGRITY_WARNING_BELOW;
          return {
            time: hhmm(p.timestamp),
            desc: `${label}: ${val}%`,
            status: (flagged ? 'Tinggi' : 'Normal') as 'Normal' | 'Tinggi',
          };
        });

      setSeries({
        source: 'supabase',
        lastUpdatedAt: Date.now(),
        quality: { cap: last.cap_quality ?? null, lig: last.lig_quality ?? null, system: last.system_quality ?? null },
        diagnostics: {
          res16: last.res_16_raw ?? null,
          kap4: last.kap_4_raw ?? null,
          kap5: last.kap_5_raw ?? null,
        },
        volume: {
          labels: pts.map((p) => hhmm(p.timestamp)),
          data: pts.map((p) => volPct(p.capacitance_raw)),
          current: currentVol,
          status: currentVol < 80 ? 'Kapasitas aman' : 'Segera ganti kantong',
        },
        kulit: {
          labels: pts.map((p) => hhmm(p.timestamp)),
          data: pts.map((p) => integPct(p.lig_raw)),
          current: currentInteg,
          status: currentInteg >= SKIN_INTEGRITY_WARNING_BELOW ? 'Integritas baik' : 'Perlu diperiksa',
        },
        history: historyData,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    // Kalibrasi jarang berubah, cukup diambil sekali per sesi (bukan tiap 5 detik).
    // Buka lagi app-nya buat pakai nilai kalibrasi terbaru dari Settings web.
    supabase
      .from('sensor_calibration')
      .select('*')
      .eq('id', 'default')
      .maybeSingle()
      .then(({ data }) => {
        if (data) calibrationRef.current = { ...DEFAULT_CALIBRATION, ...data };
        fetchSensorData();
        interval = setInterval(fetchSensorData, 5000);
      });

    return () => clearInterval(interval);
  }, []);

  // Tab bar (Beranda/Monitor) tetap mounted saat pindah tab — polling 5 detik di
  // atas terus jalan di background, tapi kalau baru balik ke tab ini bisa kelihatan
  // "diam" sampai 5 detik. Tarik data terbaru langsung begitu tab difokus lagi.
  useFocusEffect(
    useCallback(() => {
      fetchSensorData();
    }, []),
  );

  return { series, refetch: fetchSensorData };
}
