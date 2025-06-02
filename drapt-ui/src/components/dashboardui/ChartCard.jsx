import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

function LightTooltip({ active, payload, label, currency }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: "#fff",
      color: "#222",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "8px 12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    }}>
      <div className="font-semibold">{label}</div>
      <div>
        {currency}{payload[0].value}
      </div>
    </div>
  );
}

function DarkTooltip({ active, payload, label, currency }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: "#222",
      color: "#fff",
      border: "1px solid #444",
      borderRadius: "8px",
      padding: "8px 12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.32)"
    }}>
      <div className="font-semibold">{label}</div>
      <div>
        {currency}{payload[0].value}
      </div>
    </div>
  );
}

function DualTooltip({ active, payload, label, currency }) {
  if (!active || !payload || payload.length < 2) return null;
  return (
    <div style={{
      background: "#fff",
      color: "#222",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      padding: "8px 12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
    }}>
      <div className="font-semibold">{label}</div>
      <div>
        <span style={{ color: payload[0].color, fontWeight: 500 }}>{payload[0].name}:</span> {currency}{payload[0].value}
      </div>
      <div>
        <span style={{ color: payload[1].color, fontWeight: 500 }}>{payload[1].name}:</span> {currency}{payload[1].value}
      </div>
    </div>
  );
}

function DualTooltipDark({ active, payload, label, currency }) {
  if (!active || !payload || payload.length < 2) return null;
  return (
    <div style={{
      background: "#222",
      color: "#fff",
      border: "1px solid #444",
      borderRadius: "8px",
      padding: "8px 12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.32)"
    }}>
      <div className="font-semibold">{label}</div>
      <div>
        <span style={{ color: payload[0].color, fontWeight: 500 }}>{payload[0].name}:</span> {currency}{payload[0].value}
      </div>
      <div>
        <span style={{ color: payload[1].color, fontWeight: 500 }}>{payload[1].name}:</span> {currency}{payload[1].value}
      </div>
    </div>
  );
}


// Currency symbol mapping
const currencySymbols = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  JPY: "¥",
  CHF: "₣",
  AUD: "A$",
  CAD: "C$",
  CNY: "¥",
  INR: "₹",
};

function getCurrencySymbol(code) {
  return currencySymbols[code] || code || "$";
}

export default function ChartCard({ title, content = null, data, size = 'medium', tooltip=null }) {
  const sizeClasses = {
    small: 'w-full md:w-1/3 h-96',
    medium: 'w-full md:w-1/2 h-96',
    large: 'w-full h-96',
  };

  const [currency, setCurrency] = useState("USD");
  useEffect(() => {
    const saved = localStorage.getItem("currency") || "USD";
    setCurrency(saved);
  }, []);

  const theme = typeof window !== "undefined"
    ? document.documentElement.getAttribute("data-theme")
    : "light";
  const CustomTooltip = (props) =>
    theme === "draptdark" || theme === "dark"
      ? <DarkTooltip {...props} currency={getCurrencySymbol(currency)} />
      : <LightTooltip {...props} currency={getCurrencySymbol(currency)} />;

  const [lineColor, setLineColor] = useState("#6366f1");

  useEffect(() => {
    const updateThemeColors = () => {
      // Use DaisyUI's --p-info variable for info color
      const info = getComputedStyle(document.documentElement)
        .getPropertyValue('--p-info')
        .trim();
      setLineColor(info || "#6366f1");
    };

    updateThemeColors();

    const observer = new MutationObserver(updateThemeColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow ${sizeClasses[size]}`}>
      <div className='card-body my-1'>
        <div className='flex items-center justify-between'>
          <h2 className={`card-title text-2xl ${!content ? 'mb-4' : ''}`}>{title}</h2>
          {tooltip && (
              <Tippy
                content={tooltip}
                placement="top"
                animation="shift-away"
                arrow={true}
                interactive={false}
                delay={0}
              >
                <button className="w-5 h-5 flex items-center justify-center rounded-full text-info hover:bg-transparent focus:outline-none mb-4">
                  <FaInfoCircle className="w-4 h-4 text-info" />
                </button>
              </Tippy>
            )}
        </div>
        {content && <p className='mb-4'>{content}</p>}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={v => `${getCurrencySymbol(currency)}${v}`}
            />
            <Tooltip content={CustomTooltip} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// DualChartCard component
export function DualChartCard({
  title,
  content = null,
  data,
  size = 'medium',
  dataKey1 = 'value',
  dataKey2 = 'value2',
  label1 = 'Series 1',
  label2 = 'Series 2',
  tooltip = null
}) {
  const sizeClasses = {
    small: 'w-full md:w-1/3 h-96',
    medium: 'w-full md:w-1/2 h-96',
    large: 'w-full h-96',
  };

  const [currency, setCurrency] = useState("USD");
  useEffect(() => {
    const saved = localStorage.getItem("currency") || "USD";
    setCurrency(saved);
  }, []);

  const theme = typeof window !== "undefined"
    ? document.documentElement.getAttribute("data-theme")
    : "light";
  const CustomTooltip = (props) =>
  theme === "draptdark" || theme === "dark"
    ? <DualTooltipDark {...props} currency={getCurrencySymbol(currency)} />
    : <DualTooltip {...props} currency={getCurrencySymbol(currency)} />;

  const [lineColor, setLineColor] = useState("#6366f1");
  const [lineColor2, setLineColor2] = useState("#f59e42"); // accent color for second line

  useEffect(() => {
    const updateThemeColors = () => {
      // Use DaisyUI's --p-info for lineColor and --p-accent for lineColor2
      const info = getComputedStyle(document.documentElement)
        .getPropertyValue('--p-info')
        .trim();
      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue('--p-accent')
        .trim();
      setLineColor(info || "#6366f1");
      setLineColor2(accent || "#f59e42");
    };

    updateThemeColors();

    const observer = new MutationObserver(updateThemeColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow ${sizeClasses[size]}`}>
      <div className='card-body my-1'>
        <div className='flex items-center justify-between'>
          <h2 className={`card-title text-2xl ${!content ? 'mb-4' : ''}`}>{title}</h2>
          {tooltip && (
              <Tippy
                content={tooltip}
                placement="top"
                animation="shift-away"
                arrow={true}
                interactive={false}
                delay={0}
              >
                <button className="w-5 h-5 flex items-center justify-center rounded-full text-info hover:bg-transparent focus:outline-none mb-4">
                  <FaInfoCircle className="w-4 h-4 text-info" />
                </button>
              </Tippy>
            )}
        </div>
        {content && <p className='mb-4'>{content}</p>}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={v => `${getCurrencySymbol(currency)}${v}`}
            />
            <Tooltip content={CustomTooltip} />
            <Line
              type="monotone"
              dataKey={dataKey1}
              name={label1}
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={false}
            />
            <Line
              type="monotone"
              dataKey={dataKey2}
              name={label2}
              stroke={lineColor2}
              strokeWidth={2}
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}