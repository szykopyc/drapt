import { CardOne } from "../baseui/CustomCard";
import CustomTable from "../baseui/CustomTable";
import { dummyRecentOrders } from "../../assets/dummy-data/tableData";

export default function TradeHistoryCard() {
    const columnNames = [
        { key: "ticker", label: "Ticker" },
        { key: "action", label: "Action" },
        { key: "orderStatus", label: "Order Status" },
        { key: "quantity", label: "Quantity" },
        { key: "price", label: "Price" },
        { key: "date", label: "Date" },
    ];

    const pendingOrders = dummyRecentOrders.slice(0, 3);

    return (
        <CardOne title={"Pending Orders"}>
            <CustomTable
                data={pendingOrders}
                maxHeight={"324px"}
                columns={columnNames}
            />
        </CardOne>
    );
}
