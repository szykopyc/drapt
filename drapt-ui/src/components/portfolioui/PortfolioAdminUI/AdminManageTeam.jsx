import { CustomCollapseArrow } from "../../baseui/CustomCard";
import InnerEmptyState from "../../errorui/InnerEmptyState";
import ModalHelper from "../../helperui/ModalHelper";

import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
    assignUserToPortfolio,
    unassignUserFromAnyPortfolio,
} from "../../../lib/AdminServices";

import { useQueryClient } from "@tanstack/react-query";
import { roleMapperDict } from "../../../helperfunctions/RoleMapper";
import { useHookSearchPortfolioOverview } from "../../../reactqueryhooks/usePortfolioHook";
import { useHookSearchUserByTeam } from "../../../reactqueryhooks/useAdminHook";
import { MdErrorOutline, MdInfoOutline } from "react-icons/md";

import RoleRankSorter from "../../../helperfunctions/RoleRankSorter";

export default function AdminManageTeamCard() {
    const { portfolioID } = useParams();

    const { data: portfolioOverviewData = [] } =
        useHookSearchPortfolioOverview(portfolioID);

    const { data: allTeamMembers = [] } = useHookSearchUserByTeam(portfolioID);

    const unassignedTeamMembers =
        allTeamMembers.length > 0
            ? allTeamMembers.filter((member) => member.portfolio_id == null)
            : [];

    const queryClient = useQueryClient();

    // THESE MEMBERS ARE THOSE WITH A VALID PORTFOLIO ID FOR THE PORTFOLIO IN QUESTION
    const assignedPortfolioTeamMembers = portfolioOverviewData?.members || [];

    const memberManageModalRef = useRef(null);
    const [memberManageModalData, setMemberManageModalData] = useState(null);

    // FOR CLOSING THE MODAL USE THIS
    const closeMemberManageModal = () => {
        if (memberManageModalRef.current) memberManageModalRef.current.close();
        setMemberManageModalData(null);
        setWasMemberUnassigned(false);
        setIsUnassigning(false);
    };

    // SHOW MODAL AS SOON AS THERE IS MODAL DATA
    useEffect(() => {
        if (memberManageModalData && memberManageModalRef.current) {
            memberManageModalRef.current.showModal();
        }
    }, [memberManageModalData]);

    // FOR MANAGE TEAM MEMBERS TABLE (COLUMN LABELS)
    const columnsForTeamManagementTable = [
        { key: "fullname", label: "Full Name" },
        { key: "username", label: "Username" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "action", label: "Action" },
    ];

    // FOR UNASSIGNING MEMBERS

    const showMemberManagementModal = (memberID) => {
        const member = assignedPortfolioTeamMembers.find(
            (member) => member.id === memberID
        );
        if (member) setMemberManageModalData(member);
    };

    const [wasMemberUnassigned, setWasMemberUnassigned] = useState(false);
    const [isUnassigning, setIsUnassigning] = useState(false);

    const memberUnassignHandler = async (member) => {
        if (!member) return;
        setIsUnassigning(true);
        try {
            await unassignUserFromAnyPortfolio(member.id);
            await new Promise((resolve) => setTimeout(resolve, 500));
            setWasMemberUnassigned(true);
            toast.success(`Successfully unassigned ${member.fullname}`);
            queryClient.invalidateQueries(["portfolio", portfolioID]);
            setIsUnassigning(false);
        } catch {
            toast.error("Failed to unassign user");
        } finally {
            setIsUnassigning(false);
        }
    };

    // FOR ASSIGNING MEMBERS

    const [assigningMemberId, setAssigningMemberId] = useState(null);

    const memberAssignHandler = async (member) => {
        setAssigningMemberId(member.id);
        try {
            await assignUserToPortfolio(member.id, portfolioOverviewData.id);
            toast.success(`Assigned ${member.fullname} to this portfolio`);
        } catch {
            toast.error("Failed to assign user");
        } finally {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setAssigningMemberId(null);
            queryClient.invalidateQueries(["portfolio", portfolioID]);
        }
    };

    return (
        <>
            <CustomCollapseArrow title={"Manage Portfolio Members"}>
                {unassignedTeamMembers.length === 0 ? null : (
                    <div className="flex flex-row items-center justify-start gap-1 mb-3">
                        <MdInfoOutline className="text-info text-lg" />
                        <span className="text-info">
                            {unassignedTeamMembers.length === 1
                                ? "There is one team member who is unassigned to this portfolio."
                                : `There are ${unassignedTeamMembers.length} members who are unassigned to this portfolio.`}
                        </span>
                    </div>
                )}
                {assignedPortfolioTeamMembers.length === 0 ? (
                    <InnerEmptyState
                        title={"No team members in this portfolio"}
                        message="We couldn't find any members assigned to this portfolio."
                        icon={
                            <MdErrorOutline className="text-4xl text-error" />
                        }
                    />
                ) : (
                    <div className="flex flex-col gap-3 mb-3">
                        <p className="text-lg">Manage portfolio members</p>
                        <div className="overflow-x-auto w-full">
                            <table className="w-full table-sm md:table table-zebra table-auto md:table-fixed">
                                <thead>
                                    <tr>
                                        {columnsForTeamManagementTable.map(
                                            (col) => (
                                                <th key={col.key}>
                                                    {col.label}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {RoleRankSorter(
                                        assignedPortfolioTeamMembers
                                    ).map((member) => (
                                        <tr key={member.id}>
                                            <td>{member.fullname}</td>
                                            <td>{member.username}</td>
                                            <td>{member.email}</td>
                                            <td>
                                                {roleMapperDict[member.role]}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-warning"
                                                    style={{
                                                        borderRadius:
                                                            "var(--border-radius",
                                                    }}
                                                    disabled={
                                                        member.role == "pm"
                                                    }
                                                    title={
                                                        member.role === "pm"
                                                            ? "PMs cannot be unassigned"
                                                            : ""
                                                    }
                                                    onClick={() =>
                                                        showMemberManagementModal(
                                                            member.id
                                                        )
                                                    }
                                                >
                                                    Manage
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {unassignedTeamMembers.length === 0 ? null : (
                    <div className="flex flex-col gap-3">
                        <p className="text-lg">
                            Assign team members to this portfolio
                        </p>
                        <div className="overflow-x-auto w-full">
                            <table className="w-full table-sm md:table table-zebra table-auto md:table-fixed">
                                <thead>
                                    <tr>
                                        {columnsForTeamManagementTable.map(
                                            (col) => (
                                                <th key={col.key}>
                                                    {col.label}
                                                </th>
                                            )
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {RoleRankSorter(unassignedTeamMembers).map(
                                        (member) => (
                                            <tr key={member.id}>
                                                <td>{member.fullname}</td>
                                                <td>{member.username}</td>
                                                <td>{member.email}</td>
                                                <td>
                                                    {
                                                        roleMapperDict[
                                                            member.role
                                                        ]
                                                    }
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        style={{
                                                            borderRadius:
                                                                "var(--border-radius",
                                                        }}
                                                        onClick={() =>
                                                            memberAssignHandler(
                                                                member
                                                            )
                                                        }
                                                        disabled={
                                                            assigningMemberId !==
                                                                null &&
                                                            assigningMemberId !==
                                                                member.id
                                                        }
                                                    >
                                                        {assigningMemberId ===
                                                        member.id
                                                            ? "Assigning..."
                                                            : "Assign"}
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </CustomCollapseArrow>
            {/* THIS IS THE MEMBER MANAGE MODAL SECTION*/}
            {memberManageModalData && (
                <ModalHelper
                    id="memberManageModal"
                    reference={memberManageModalRef}
                    modalTitle={
                        memberManageModalData
                            ? `Manage ${memberManageModalData.fullname}`
                            : "Manager Undefined User"
                    }
                    closeModalActions={closeMemberManageModal}
                >
                    <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:justify-between items-start md:items-center">
                        <p className="text-lg md:text-base">
                            Unassign member from this portfolio
                        </p>
                        <button
                            className="btn btn-lg md:btn-md btn-error text-primary-content"
                            style={{ borderRadius: "var(--border-radius" }}
                            onClick={() =>
                                memberUnassignHandler(memberManageModalData)
                            }
                            disabled={wasMemberUnassigned}
                        >
                            {isUnassigning === true
                                ? "Unassigning..."
                                : "Unassign"}
                        </button>
                    </div>
                    <div className="mb-3"></div>
                </ModalHelper>
            )}
        </>
    );
}
