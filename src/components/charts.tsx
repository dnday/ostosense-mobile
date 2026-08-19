import { View } from 'react-native';
import Svg, { Circle, Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';

/* Chart SVG ringan meniru style Recharts di Figma (grid putus-putus, axis abu). */

const W = 369;
const H = 160;
const PAD = { left: 34, right: 8, top: 8, bottom: 30 };
const GRID = '#e5e7eb';
const AXIS_TEXT = '#6b7280';

const plotW = W - PAD.left - PAD.right;
const plotH = H - PAD.top - PAD.bottom;

function Frame({
  labels,
  yTicks,
  yMax,
  slotLabels = false,
  children,
}: {
  labels: string[];
  yTicks: number[];
  yMax: number;
  slotLabels?: boolean; // true = label di tengah slot bar, false = di titik sumbu
  children: React.ReactNode;
}) {
  return (
    <View style={{ width: '100%', aspectRatio: W / H }}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {yTicks.map((t) => {
          const y = PAD.top + plotH - (t / yMax) * plotH;
          return (
            <Line
              key={t}
              x1={PAD.left}
              y1={y}
              x2={W - PAD.right}
              y2={y}
              stroke={GRID}
              strokeDasharray="3 3"
            />
          );
        })}
        {yTicks.map((t) => {
          const y = PAD.top + plotH - (t / yMax) * plotH;
          return (
            <SvgText
              key={t}
              x={PAD.left - 6}
              y={y + 3}
              fontSize={10}
              fill={AXIS_TEXT}
              textAnchor="end">
              {t}
            </SvgText>
          );
        })}
        {labels.map((label, i) => {
          const x = slotLabels
            ? PAD.left + (plotW / labels.length) * (i + 0.5)
            : PAD.left + (labels.length > 1 ? (i / (labels.length - 1)) * plotW : 0);
          return (
            <SvgText
              key={`${label}-${i}`}
              x={x}
              y={H - PAD.bottom + 14}
              fontSize={10}
              fill={AXIS_TEXT}
              textAnchor="middle">
              {label}
            </SvgText>
          );
        })}
        {children}
      </Svg>
    </View>
  );
}

export function LineChart({
  labels,
  data,
  color,
  yMax = 100,
  yTicks = [0, 25, 50, 75, 100],
}: {
  labels: string[];
  data: number[];
  color: string;
  yMax?: number;
  yTicks?: number[];
}) {
  const pt = (v: number, i: number) => ({
    x: PAD.left + (data.length > 1 ? (i / (data.length - 1)) * plotW : 0),
    y: PAD.top + plotH - (Math.min(v, yMax) / yMax) * plotH,
  });
  const points = data.map(pt);
  return (
    <Frame labels={labels} yTicks={yTicks} yMax={yMax}>
      <Polyline
        points={points.map((p) => `${p.x},${p.y}`).join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={2}
      />
      {points.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill={color} />
      ))}
    </Frame>
  );
}

export function BarChart({
  labels,
  data,
  yMax = 80,
  yTicks = [0, 20, 40, 60, 80],
  threshold = 60,
  normalColor = '#1d2f4a',
  highColor = '#ff9141',
}: {
  labels: string[];
  data: number[];
  yMax?: number;
  yTicks?: number[];
  threshold?: number;
  normalColor?: string;
  highColor?: string;
}) {
  const slot = plotW / data.length;
  const barW = Math.min(38, slot * 0.7);
  return (
    <Frame labels={labels} yTicks={yTicks} yMax={yMax} slotLabels>
      {data.map((v, i) => {
        const h = (Math.min(v, yMax) / yMax) * plotH;
        const x = PAD.left + slot * i + (slot - barW) / 2;
        return (
          <Rect
            key={i}
            x={x}
            y={PAD.top + plotH - h}
            width={barW}
            height={h}
            rx={6}
            fill={v > threshold ? highColor : normalColor}
          />
        );
      })}
    </Frame>
  );
}
