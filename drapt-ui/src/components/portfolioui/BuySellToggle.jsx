import React from "react";

// THIS WILL NOT BE USED FOR NOW AS NEFSIF DOES NOT ALLOW SHORT SELLING

export default function BuySellToggle({ value, onChange, disabled }) {
  return (
    <div className="flex overflow-hidden border border-1 border-base-content/70 w-full px-0 gap-0">
      <button
        type="button"
        className={`flex-1 py-2 font-semibold border-r-1 transition-colors ${value === "BUY"
          ? "bg-success text-base-content"
          : "bg-base-100 text-base-content hover:bg-success/30 focus:bg-success/30"
          }`}
        onClick={() => onChange("BUY")}
        disabled={disabled}
      >
        BUY
      </button>
      <button
        type="button"
        className={`flex-1 py-2 font-semibold transition-colors ${value === "SELL"
          ? "bg-error text-base-content"
          : "bg-base-100 text-base-content hover:bg-error/30 focus:bg-error/30 "
          }`}
        onClick={() => onChange("SELL")}
        disabled={disabled}
      >
        SELL
      </button>
    </div>
  );
}
