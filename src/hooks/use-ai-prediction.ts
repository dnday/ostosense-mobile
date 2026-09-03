import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DEVICE_SESSION_ID } from '@/constants/device';

// Kontrak: OSTOSENSE-AI/docs/ai-software-integration-contract-v0.2.md
// Kelas AI (Safe/Monitor/Caution/Urgent) TIDAK BOLEH ditampilkan sebagai persentase,
// countdown, atau memicu notifikasi pasien — lihat dokumen itu sebelum mengubah file ini.

export type RiskClass = 'Safe' | 'Monitor' | 'Caution' | 'Urgent';

type AiPredictionRow = {
  model_status: 'UNAVAILABLE' | 'TEST_ONLY' | 'UNVALIDATED';
  prediction_available: boolean;
  risk_class: RiskClass | null;
  received_at: string;
};

// ponytail: 10 menit — patokan kasar, belum ada spesifikasi resmi soal berapa lama
// sebuah prediksi AI dianggap usang.
const STALE_MS = 10 * 60 * 1000;

export type AiPredictionState =
  | { state: 'unavailable' }
  | { state: 'stale'; riskClass: RiskClass; label: 'Simulasi AI' | 'AI Eksperimental' }
  | { state: 'ready'; riskClass: RiskClass; label: 'Simulasi AI' | 'AI Eksperimental' };

const POLL_MS = 15000;

export function useAiPrediction() {
  const [prediction, setPrediction] = useState<AiPredictionState>({ state: 'unavailable' });

  useEffect(() => {
    let alive = true;

    const fetchLatest = async () => {
      const { data } = await supabase
        .from('ai_predictions')
        .select('model_status, prediction_available, risk_class, received_at')
        .eq('session_id', DEVICE_SESSION_ID)
        .order('received_at', { ascending: false })
        .limit(1)
        .maybeSingle<AiPredictionRow>();

      if (!alive) return;

      if (!data || !data.prediction_available || !data.risk_class) {
        setPrediction({ state: 'unavailable' });
        return;
      }

      const label = data.model_status === 'TEST_ONLY' ? 'Simulasi AI' : 'AI Eksperimental';
      const isStale = Date.now() - new Date(data.received_at).getTime() > STALE_MS;

      setPrediction({
        state: isStale ? 'stale' : 'ready',
        riskClass: data.risk_class,
        label,
      });
    };

    fetchLatest();
    const interval = setInterval(fetchLatest, POLL_MS);
    return () => {
      alive = false;
      clearInterval(interval);
    };
  }, []);

  return prediction;
}
