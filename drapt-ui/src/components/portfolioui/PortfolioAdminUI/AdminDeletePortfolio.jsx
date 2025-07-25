import { CustomCollapseArrow } from "../../baseui/CustomCard";
import { useState } from "react";
import toast from "react-hot-toast";
import { deletePortfolio } from "../../../lib/PortfolioServices";
import { useParams, useNavigate } from "react-router-dom";
import { useHookSearchPortfolioOverview } from "../../../reactqueryhooks/usePortfolioHook";
import { useQueryClient } from "@tanstack/react-query";
import CustomButton from "../../baseui/CustomButton";

export default function AdminDeletePortfolio() {
    const { portfolioID } = useParams();
    const { data: portfolioData } = useHookSearchPortfolioOverview(portfolioID);

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const [portfolioDeleteConfirmed, setPortfolioDeleteConfirmed] =
        useState(false);
    const [isPortfolioBeingDeleted, setIsPortfolioBeingDeleted] =
        useState(false);

    const guardedPortfolioDeleteHandler = async (portfoliodata) => {
        try {
            setIsPortfolioBeingDeleted(true);
            await deletePortfolio(portfoliodata.id);
            await new Promise((resolve) => setTimeout(resolve, 500));
            setIsPortfolioBeingDeleted(false);
            toast.success(`Deleted ${portfoliodata.name} Portfolio`);
            setPortfolioDeleteConfirmed(false);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast("Redirecting to Fund Scope...");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.dismiss();
            queryClient.invalidateQueries([
                "portfolio",
                portfoliodata.portfolio_string_id,
            ]);
            navigate("/portfolio");
        } catch {
            toast.error(`Failed to delete ${portfoliodata.name} Portfolio`);
        }
    };

    return (
        <CustomCollapseArrow
            id={"deletePortfolio"}
            title={
                portfolioData
                    ? `Delete ${portfolioData.name} Portfolio`
                    : "Delete undefined portfolio"
            }
        >
            <p className="text-error font-semibold text-lg">Warning!</p>
            <p>
                This action is irreversible. Deleting this portfolio will result
                in historical trades tied to this portfolio being deleted. Only
                do this if you accept the consequences.
            </p>
            <div className="mt-3 flex flex-row justify-between gap-3">
                {!portfolioDeleteConfirmed ? (
                    <CustomButton
                        colour="error"
                        onClick={() => setPortfolioDeleteConfirmed(true)}
                    >
                        Delete Portfolio
                    </CustomButton>
                ) : (
                    <>
                        <CustomButton
                            colour="success"
                            onClick={() =>
                                guardedPortfolioDeleteHandler(portfolioData)
                            }
                        >
                            {isPortfolioBeingDeleted
                                ? "Deleting Portfolio...."
                                : "Confirm Deletion"}
                        </CustomButton>
                        <CustomButton
                            colour="neutral"
                            onClick={() => setPortfolioDeleteConfirmed(false)}
                        >
                            Cancel
                        </CustomButton>
                    </>
                )}
            </div>
        </CustomCollapseArrow>
    );
}
