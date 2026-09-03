import { useEffect, useRef, useState } from 'react';
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
const DEFAULT_CALIBRATION: Calibration = {
  cap_empty: 1000,
  cap_full: 1600,
  lig_base: 1800,
  lig_dead: 1200,
  humid_high: 60,
};

// ponytail: belum ada kolom kalibrasi khusus buat ambang integritas kulit di
// sensor_calibration — hardcode di sini sampai ada kebutuhan diedit dari Settings.
const SKIN_INTEGRITY_WARNING_BELOW = 50;

const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

export type SensorQuality = { cap: string | null; lig: string | null; system: string | null };

export type SensorSeries = {
  source: 'supabase' | 'fallback' | 'loading';
  // Kapan fetch sensor_logs terakhir SUKSES — dipakai buat deteksi device offline/data usang
  // (lihat AiStatusCard). null berarti belum pernah berhasil sejak app dibuka.
  lastUpdatedAt: number | null;
  quality: SensorQuality;
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
        .select('timestamp, capacitance_raw, lig_raw, cap_quality, lig_quality, system_quality')
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

  return { series, refetch: fetchSensorData };
}
