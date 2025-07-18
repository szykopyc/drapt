import React from "react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
// THIS WILL NOT BE USED FOR NOW AS NEFSIF DOES NOT ALLOW SHORT SELLING

export default function BuySellToggle({ value, onChange, disabled }) {
  return (
    <div className="flex overflow-hidden border border-1 border-base-300 w-full px-0 gap-0">
      <button
        type="button"
        className={`flex-1 py-2 font-semibold border-r-1 border-base-300 transition-colors ${value === "BUY"
          ? "bg-success buy_sell_toggle_text"
          : "bg-base-100 text-base-content hover:bg-success/30 focus:bg-success/30"
          }`}
        onClick={() => onChange("BUY")}
        disabled={disabled}
      >
        <div className="flex flex-row justify-center items-center">
          <span>BUY</span>
          <FaCaretUp className="text-2xl" />

        </div>

      </button>
      <button
        type="button"
        className={`flex-1 py-2 font-semibold transition-colors ${value === "SELL"
          ? "bg-error buy_sell_toggle_text"
          : "bg-base-100 text-base-content hover:bg-error/30 focus:bg-error/30 "
          }`}
        onClick={() => onChange("SELL")}
        disabled={disabled}
      >

        <div className="flex flex-row justify-center items-center">
          <span>SELL</span>
          <FaCaretDown className="text-2xl" />

        </div>
      </button>
    </div>
  );
}
