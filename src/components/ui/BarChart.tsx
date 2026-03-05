import { useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import type { ChartDataPoint } from '@/src/utils/chart-data';

interface BarChartProps {
  data: ChartDataPoint[];
  /** Optional horizontal goal reference line value. */
  goalLine?: number;
  /** Bar fill color. */
  barColor?: string;
  /** Goal line color. */
  goalLineColor?: string;
  /** Chart height in pixels. */
  height?: number;
}

const LABEL_HEIGHT = 20;
const TOP_PADDING = 24;
const LEFT_PADDING = 34;
const BAR_RADIUS = 3;
const GRID_FRACTIONS = [0.25, 0.5, 0.75] as const;

/** Format a number compactly: 850, 5.2k, 42k, 1.4M */
function formatCompact(n: number): string {
  if (n < 1000) return String(Math.round(n));
  if (n < 10000) return `${(n / 1000).toFixed(1)}k`;
  if (n < 1000000) return `${Math.round(n / 1000)}k`;
  return `${(n / 1000000).toFixed(1)}M`;
}

export function BarChart({
  data,
  goalLine,
  barColor = '#28EBFF',
  goalLineColor = '#00C853',
  height = 200,
}: BarChartProps) {
  const [svgWidth, setSvgWidth] = useState(0);

  if (data.length === 0) {
    return (
      <View style={{ height, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#71717A', fontSize: 12 }}>No data yet</Text>
      </View>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), goalLine ?? 0, 1);
  const chartHeight = height - LABEL_HEIGHT - TOP_PADDING;
  const chartWidth = Math.max(svgWidth - LEFT_PADDING, 1);

  return (
    <View
      style={{ height }}
      onLayout={(e) => setSvgWidth(e.nativeEvent.layout.width)}
    >
      {svgWidth > 0 && (
        <Svg width={svgWidth} height={height}>
          {/* Y-axis gridlines + scale labels */}
          {GRID_FRACTIONS.map((frac) => {
            const y = TOP_PADDING + chartHeight * (1 - frac);
            const val = maxValue * frac;
            return (
              <Line
                key={`grid-${frac}`}
                x1={LEFT_PADDING}
                y1={y}
                x2={svgWidth}
                y2={y}
                stroke="#2A323C"
                strokeWidth={0.5}
              />
            );
          })}
          {GRID_FRACTIONS.map((frac) => {
            const y = TOP_PADDING + chartHeight * (1 - frac);
            const val = maxValue * frac;
            return (
              <SvgText
                key={`scale-${frac}`}
                x={LEFT_PADDING - 4}
                y={y + 3}
                fontSize={8}
                fill="#71717A"
                textAnchor="end"
              >
                {formatCompact(val)}
              </SvgText>
            );
          })}

          {/* Bars + value labels */}
          {data.map((point, i) => {
            const slotWidth = chartWidth / data.length;
            const barGap = slotWidth * 0.25;
            const effectiveBarWidth = slotWidth - barGap;
            const x = LEFT_PADDING + i * slotWidth + barGap / 2;

            const barHeight = (point.value / maxValue) * chartHeight;
            const y = TOP_PADDING + chartHeight - barHeight;

            return (
              <Rect
                key={i}
                x={x}
                y={y}
                width={effectiveBarWidth}
                height={Math.max(barHeight, 0)}
                rx={BAR_RADIUS}
                ry={BAR_RADIUS}
                fill={point.value > 0 ? barColor : '#2A323C'}
              />
            );
          })}

          {/* Value labels above bars */}
          {data.map((point, i) => {
            if (point.value <= 0) return null;
            const slotWidth = chartWidth / data.length;
            const x = LEFT_PADDING + i * slotWidth + slotWidth / 2;
            const barHeight = (point.value / maxValue) * chartHeight;
            const y = TOP_PADDING + chartHeight - barHeight - 4;

            return (
              <SvgText
                key={`val-${i}`}
                x={x}
                y={y}
                fontSize={8}
                fill="#A1A1AA"
                textAnchor="middle"
              >
                {formatCompact(point.value)}
              </SvgText>
            );
          })}

          {/* Goal line */}
          {goalLine != null && goalLine > 0 && (
            <Line
              x1={LEFT_PADDING}
              y1={TOP_PADDING + chartHeight - (goalLine / maxValue) * chartHeight}
              x2={svgWidth}
              y2={TOP_PADDING + chartHeight - (goalLine / maxValue) * chartHeight}
              stroke={goalLineColor}
              strokeWidth={1.5}
              strokeDasharray="6,4"
              opacity={0.7}
            />
          )}

          {/* X-axis labels */}
          {data.map((point, i) => {
            const slotWidth = chartWidth / data.length;
            const x = LEFT_PADDING + i * slotWidth + slotWidth / 2;
            return (
              <SvgText
                key={`label-${i}`}
                x={x}
                y={height - 2}
                fontSize={9}
                fill="#71717A"
                textAnchor="middle"
              >
                {point.label}
              </SvgText>
            );
          })}
        </Svg>
      )}
    </View>
  );
}
