import { useState, useEffect } from "react";

export default function CurrencySwitcher() {
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency") || "GBP";
    setCurrency(savedCurrency);
  }, []);

  const handleChange = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    localStorage.setItem("currency", newCurrency);
  };

  return (
    <select className="select select-bordered" value={currency} onChange={handleChange}>
      <option value="GBP">GBP - British Pound</option>
      <option value="USD">USD - US Dollar</option>
      <option value="EUR">EUR - Euro</option>
      <option value="JPY">JPY - Japanese Yen</option>
    </select>
  );
}