import React from "react";

// THIS WILL NOT BE USED FOR NOW AS NEFSIF DOES NOT ALLOW SHORT SELLING

export default function BuySellToggle({ value, onChange, disabled }) {
  return (
    <div className="flex overflow-hidden input input-bordered w-full px-0 gap-0">
      <button
        type="button"
        className={`flex-1 py-2 font-semibold transition-colors ${
          value === "buy"
            ? "bg-success text-base-content"
            : "bg-base-100 text-base-content hover:bg-success/30 focus:bg-success/30"
        }`}
        onClick={() => onChange("buy")}
        disabled={disabled}
      >
        Buy
      </button>
      <button
        type="button"
        className={`flex-1 py-2 font-semibold transition-colors ${
          value === "sell"
            ? "bg-error text-base-content"
            : "bg-base-100 text-base-content hover:bg-error/30 focus:bg-error/30 "
        }`}
        onClick={() => onChange("sell")}
        disabled={disabled}
      >
        Sell
      </button>
    </div>
  );
}