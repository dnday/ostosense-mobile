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

const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

export type SensorSeries = {
  source: 'supabase' | 'fallback' | 'loading';
  risiko: { labels: string[]; data: number[]; current: number; status: string };
  volume: { labels: string[]; data: number[]; current: number; status: string };
  kelembaban: { labels: string[]; data: number[]; threshold: number };
  history: { time: string; desc: string; status: 'Normal' | 'Tinggi' }[];
};

const FALLBACK: SensorSeries = {
  source: 'loading',
  risiko: {
    labels: ['0h', '6h', '12h', '18h', '24h', '30h', '36h', '42h'],
    data: [100, 96, 89, 82, 75, 69, 62, 55],
    current: 100,
    status: 'Memuat data...',
  },
  volume: {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    data: [0, 0, 0, 0, 0, 0],
    current: 0,
    status: 'Memuat data...',
  },
  kelembaban: {
    labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'],
    data: [0, 0, 0, 0, 0, 0],
    threshold: DEFAULT_CALIBRATION.humid_high,
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
        .select('timestamp, capacitance_raw, lig_raw')
        .order('timestamp', { ascending: false })
        .limit(120);

      if (error || !data || data.length === 0) return;

      const logs = data.reverse();
      const { cap_empty, cap_full, lig_base, lig_dead, humid_high } = calibrationRef.current;

      const volPct = (cap: number) => clamp(((cap - cap_empty) / (cap_full - cap_empty)) * 100);
      const integPct = (lig: number) => clamp(((lig - lig_dead) / (lig_base - lig_dead)) * 100);
      const humidPct = (cap: number) => clamp(30 + (cap - cap_empty) / 8);

      const hhmm = (iso: string) => {
        const d = new Date(iso);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
      };

      const pick = (n: number) =>
        Array.from({ length: n }, (_, i) => logs[Math.floor((i * (logs.length - 1)) / (n - 1))]);
      const pts = pick(6);

      const last = logs[logs.length - 1];
      const currentInteg = integPct(last.lig_raw);
      const currentVol = volPct(last.capacitance_raw);

      const firstInteg = integPct(logs[0].lig_raw);
      const slope = logs.length > 1 ? (currentInteg - firstInteg) / 7 : -6;
      const projData = Array.from({ length: 8 }, (_, i) => clamp(currentInteg + slope * i));

      const historyData = pts.slice().reverse().map((p, i) => {
          const kind = i % 3;
          const val = kind === 0 ? humidPct(p.capacitance_raw) : kind === 1 ? volPct(p.capacitance_raw) : integPct(p.lig_raw);
          const label = kind === 0 ? 'Kelembaban' : kind === 1 ? 'Volume' : 'Integritas';
          return {
            time: hhmm(p.timestamp),
            desc: `${label}: ${val}%`,
            status: (kind === 0 && val > humid_high ? 'Tinggi' : 'Normal') as 'Normal' | 'Tinggi',
          };
        });

      setSeries({
        source: 'supabase',
        risiko: {
          labels: ['0h', '6h', '12h', '18h', '24h', '30h', '36h', '42h'],
          data: projData,
          current: currentInteg,
          status: currentInteg >= 80 ? 'Risiko rendah' : currentInteg >= 50 ? 'Risiko sedang' : 'Risiko tinggi',
        },
        volume: {
          labels: pts.map((p) => hhmm(p.timestamp)),
          data: pts.map((p) => volPct(p.capacitance_raw)),
          current: currentVol,
          status: currentVol < 80 ? 'Kapasitas aman' : 'Segera ganti kantong',
        },
        kelembaban: {
          labels: pts.map((p) => hhmm(p.timestamp)),
          data: pts.map((p) => humidPct(p.capacitance_raw)),
          threshold: humid_high,
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
