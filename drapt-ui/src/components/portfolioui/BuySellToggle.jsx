import React from "react";

export default function BuySellToggle({ value, onChange }) {
  return (
    <div className="flex overflow-hidden input input-bordered w-full px-0 gap-0">
      <button
        type="button"
        className={`flex-1 py-2 font-semibold transition-colors ${
          value === "buy"
            ? "bg-success text-base-content"
            : "bg-base-100 text-base-content"
        }`}
        onClick={() => onChange("buy")}
      >
        Buy
      </button>
      <button
        type="button"
        className={`flex-1 py-2 font-semibold transition-colors ${
          value === "sell"
            ? "bg-error text-base-content"
            : "bg-base-100 text-base-content"
        }`}
        onClick={() => onChange("sell")}
      >
        Sell
      </button>
    </div>
  );
}