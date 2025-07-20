import { currencyMapperDict } from "./CurrencyMapper";

export const numberFormatter = new Intl.NumberFormat("en-GB" , {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

export const currencyPriceFormatter = (currency, price) => {
    return (
        currencyMapperDict[currency] + numberFormatter.format(parseFloat(price))
    );
};

export const timeAndDateFormatter = (datetime) => {
        if (!datetime) return "N/A";
        const dateObj =
            datetime instanceof Date
                ? datetime
                : new Date(
                      String(datetime)
                          .trim()
                          .replace(/^"+|"+$/g, "")
                  );
        if (isNaN(dateObj.getTime())) return "Invalid Date";
        return (
            dateObj.toLocaleDateString("en-GB", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }) +
            " " +
            dateObj.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            })
        );
    };