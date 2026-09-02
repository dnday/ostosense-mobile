import { View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';

/* Chart SVG ringan gaya dashboard BI (Power BI/Tableau/Looker): area gradient di
   bawah kurva halus, gridline solid tipis, titik terakhir ditonjolkan + label nilai. */

const W = 369;
const H = 160;
const PAD = { left: 34, right: 8, top: 16, bottom: 30 };
const GRID = '#eef1f5';
const AXIS_TEXT = '#8a94a6';

const plotW = W - PAD.left - PAD.right;
const plotH = H - PAD.top - PAD.bottom;

type Point = { x: number; y: number };

/** Catmull-Rom -> cubic Bezier, buat kurva halus tanpa overshoot tajam. */
function smoothLinePath(points: Point[]) {
  if (points.length < 2) return '';
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

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
          return <Line key={t} x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke={GRID} strokeWidth={1} />;
        })}
        {yTicks.map((t) => {
          const y = PAD.top + plotH - (t / yMax) * plotH;
          return (
            <SvgText key={t} x={PAD.left - 6} y={y + 3} fontSize={10} fill={AXIS_TEXT} textAnchor="end">
              {t}
            </SvgText>
          );
        })}
        {labels.map((label, i) => {
          const x = slotLabels
            ? PAD.left + (plotW / labels.length) * (i + 0.5)
            : PAD.left + (labels.length > 1 ? (i / (labels.length - 1)) * plotW : 0);
          return (
            <SvgText key={`${label}-${i}`} x={x} y={H - PAD.bottom + 14} fontSize={10} fill={AXIS_TEXT} textAnchor="middle">
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
  const gradientId = `chartFill-${color.replace(/[^a-zA-Z0-9]/g, '')}`;
  const pt = (v: number, i: number): Point => ({
    x: PAD.left + (data.length > 1 ? (i / (data.length - 1)) * plotW : 0),
    y: PAD.top + plotH - (Math.min(v, yMax) / yMax) * plotH,
  });
  const points = data.map(pt);
  const linePath = smoothLinePath(points);
  const areaPath = points.length
    ? `${linePath} L${points[points.length - 1].x},${PAD.top + plotH} L${points[0].x},${PAD.top + plotH} Z`
    : '';
  const last = points[points.length - 1];
  const lastValue = data[data.length - 1];

  return (
    <Frame labels={labels} yTicks={yTicks} yMax={yMax}>
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity={0.25} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      <Path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.slice(0, -1).map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={2.5} fill="#fff" stroke={color} strokeWidth={1.5} />
      ))}
      {last && (
        <>
          <Circle cx={last.x} cy={last.y} r={7} fill={color} fillOpacity={0.18} />
          <Circle cx={last.x} cy={last.y} r={4} fill={color} stroke="#fff" strokeWidth={2} />
          <SvgText
            x={Math.min(last.x, W - PAD.right - 4)}
            y={Math.max(last.y - 12, PAD.top + 8)}
            fontSize={11}
            fontWeight="700"
            fill={color}
            textAnchor="end">
            {Math.round(lastValue)}
          </SvgText>
        </>
      )}
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
      <Defs>
        <LinearGradient id="barNormal" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={normalColor} stopOpacity={1} />
          <Stop offset="1" stopColor={normalColor} stopOpacity={0.75} />
        </LinearGradient>
        <LinearGradient id="barHigh" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={highColor} stopOpacity={1} />
          <Stop offset="1" stopColor={highColor} stopOpacity={0.75} />
        </LinearGradient>
      </Defs>
      {data.map((v, i) => {
        const h = (Math.min(v, yMax) / yMax) * plotH;
        const x = PAD.left + slot * i + (slot - barW) / 2;
        const isHigh = v > threshold;
        return (
          <Rect
            key={i}
            x={x}
            y={PAD.top + plotH - h}
            width={barW}
            height={h}
            rx={6}
            fill={isHigh ? 'url(#barHigh)' : 'url(#barNormal)'}
          />
        );
      })}
    </Frame>
  );
}
