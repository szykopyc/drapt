import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

// Custom tooltips
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

export default function ChartCard({ title, content = null, data, size = 'medium' }) {
  const sizeClasses = {
    small: 'w-full md:w-1/3 h-96',
    medium: 'w-full md:w-1/2 h-96',
    large: 'w-full h-96',
  };

  // Get currency from localStorage (as used in CurrencySwitcher/Profile)
  const [currency, setCurrency] = useState("USD");
  useEffect(() => {
    const saved = localStorage.getItem("currency") || "USD";
    setCurrency(saved);
  }, []);

  // Detect theme
  const theme = typeof window !== "undefined"
    ? document.documentElement.getAttribute("data-theme")
    : "light";
  const CustomTooltip = (props) =>
    theme === "draptdark" || theme === "dark"
      ? <DarkTooltip {...props} currency={getCurrencySymbol(currency)} />
      : <LightTooltip {...props} currency={getCurrencySymbol(currency)} />;

  return (
    <div className={`card card-border border-primary bg-base-100 shadow-md hover:shadow-lg transition-shadow ${sizeClasses[size]}`}>
      <div className='card-body my-1'>
        <h2 className={`card-title text-2xl ${!content ? 'mb-4' : ''}`}>{title}</h2>
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
              stroke="#6366f1"
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