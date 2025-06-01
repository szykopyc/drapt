/* THIS NEEDS FIXING */

import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Custom tooltip similar style as ChartCard
function HeatmapTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const { x, y, value } = payload[0].payload;
  return (
    <div
      style={{
        background: "#fff",
        color: "#222",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "8px 12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <div className="font-semibold">
        {x} - {y}
      </div>
      <div>Correlation: {value.toFixed(2)}</div>
    </div>
  );
}

// Custom shape renderer for each cell
const CellShape = (props) => {
  const { cx, cy, value } = props;
  const intensity = (value + 1) / 2; // normalize from -1..1 to 0..1
  const red = Math.round(255 * (1 - intensity));
  const green = Math.round(255 * intensity);
  const fillColor = `rgb(${red},${green},50)`;
  const size = 40;

  return (
    <rect
      x={cx - size / 2}
      y={cy - size / 2}
      width={size}
      height={size}
      fill={fillColor}
      stroke="#fff"
      strokeWidth={1}
      rx={4}
      ry={4}
    />
  );
};

export default function HeatmapCard({ title, data, xLabels, yLabels, size = "medium" }) {
  // Prepare flattened data for scatter plot: { x: index or label, y: index or label, value }
  // For ScatterChart, x and y should be numeric, so map labels to indices but keep original labels in payload.
  const xIndexMap = xLabels.reduce((acc, label, i) => {
    acc[label] = i;
    return acc;
  }, {});
  const yIndexMap = yLabels.reduce((acc, label, i) => {
    acc[label] = i;
    return acc;
  }, {});

  const scatterData = [];
  yLabels.forEach((yLabel, i) => {
    xLabels.forEach((xLabel, j) => {
      scatterData.push({
        x: j,
        y: i,
        value: data[i][j],
        xLabel,
        yLabel,
      });
    });
  });

  // Size classes consistent with ChartCard
  const sizeClasses = {
    small: "w-full md:w-1/3 h-96",
    medium: "w-full md:w-1/2 h-96",
    large: "w-full h-96",
  };

  return (
    <div
      className={`card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow ${sizeClasses[size]}`}
      style={{ padding: "1rem" }}
    >
      <h2 className="card-title text-2xl mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height="85%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
          >
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, xLabels.length - 1]}
            tickFormatter={(index) => xLabels[index]}
            interval={0}
            tick={{ fontSize: 12, fontWeight: "bold" }}
            axisLine={false}
            tickLine={false}
            />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, yLabels.length - 1]}
            tickFormatter={(index) => yLabels[index]}
            interval={0}
            reversed
            tick={{ fontSize: 12, fontWeight: "bold" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const { xLabel, yLabel, value } = payload[0].payload;
              return <HeatmapTooltip active={active} payload={payload} labelX={xLabel} labelY={yLabel} />;
            }}
          />
          <Scatter
            data={scatterData}
            shape={(props) => <CellShape {...props} />}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}