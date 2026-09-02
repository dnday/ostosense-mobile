import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const CAP_EMPTY = 1000;
const CAP_FULL = 1600;
const LIG_BASE = 1800;
const LIG_DEAD = 1200;
const HUMID_HIGH = 60;

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
    threshold: HUMID_HIGH,
  },
  history: [],
};

export function useSensorSeries() {
  const [series, setSeries] = useState<SensorSeries>(FALLBACK);

  const fetchSensorData = async () => {
    try {
      const { data, error } = await supabase
        .from('sensor_logs')
        .select('timestamp, capacitance_raw, lig_raw')
        .order('timestamp', { ascending: false })
        .limit(120);

      if (error || !data || data.length === 0) return;

      const logs = data.reverse();
      
      const volPct = (cap: number) => clamp(((cap - CAP_EMPTY) / (CAP_FULL - CAP_EMPTY)) * 100);
      const integPct = (lig: number) => clamp(((lig - LIG_DEAD) / (LIG_BASE - LIG_DEAD)) * 100);
      const humidPct = (cap: number) => clamp(30 + (cap - CAP_EMPTY) / 8);

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
            status: (kind === 0 && val > HUMID_HIGH ? 'Tinggi' : 'Normal') as 'Normal' | 'Tinggi',
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
          threshold: HUMID_HIGH,
        },
        history: historyData,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSensorData();
    // Auto refresh setiap 5 detik
    const interval = setInterval(fetchSensorData, 5000);
    return () => clearInterval(interval);
  }, []);

  return { series, refetch: fetchSensorData };
}
