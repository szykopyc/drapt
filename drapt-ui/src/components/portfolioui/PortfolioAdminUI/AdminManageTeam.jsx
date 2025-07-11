import { CustomCollapseArrow } from "../../baseui/CustomCard"
import InnerEmptyState from "../../errorui/InnerEmptyState"
import { ModalHelper } from "../../helperui/ModalHelper"

import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { unassignUserFromAnyPortfolio } from "../../../lib/AdminServices";
import { useQueryClient } from "@tanstack/react-query";
import { roleMapperDict } from "../../../helperfunctions/RoleMapper";
import { useHookSearchPortfolioOverview } from "../../../reactqueryhooks/usePortfolioHook";
import { MdErrorOutline } from "react-icons/md";

export default function AdminManageTeamCard() {

  const { portfolioID } = useParams();

  const { data: portfolioOverviewData = [] } = useHookSearchPortfolioOverview(portfolioID);

  const queryClient = useQueryClient();

  const portfolioTeamMembers = portfolioOverviewData?.members || [];

  // FOR SORTING THE TEAM MEMBERS
  const sortedPortfolioTeamMembers = portfolioTeamMembers.length > 0 ? portfolioTeamMembers.slice().sort((a, b) => {
    const roleOrder = {
      pm: 0,
      senioranalyst: 1,
      analyst: 2,
    };
    return (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99);
  }) : [];

  const memberManageModalRef = useRef(null);
  const [memberManageModalData, setMemberManageModalData] = useState(null);

  // FOR CLOSING THE MODAL USE THIS
  const closeMemberManageModal = () => {
    if (memberManageModalRef.current)
      memberManageModalRef.current.close();
    setMemberManageModalData(null);
    setWasMemberUnassigned(false);
  }

  // SHOW MODAL AS SOON AS THERE IS MODAL DATA
  useEffect(() => {
    if (memberManageModalData && memberManageModalRef.current) {
      memberManageModalRef.current.showModal();
    }
  }, [memberManageModalData])

  // FOR MANAGE TEAM MEMBERS TABLE (COLUMN LABELS)
  const columnsForTeamManagementTable = [
    { key: "fullname", label: "Full Name" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "action", label: "Action" }
  ];

  const showMemberManagementModal = (memberID) => {
    const member = portfolioTeamMembers.find((member) => member.id === memberID);
    if (member) setMemberManageModalData(member);
  };

  const [wasMemberUnassigned, setWasMemberUnassigned] = useState(false);
  const [isUnassigning, setIsUnassigning] = useState(false);

  const memberUnassignHandler = async (member) => {
    setIsUnassigning(true);
    try {
      await unassignUserFromAnyPortfolio(member.id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setWasMemberUnassigned(true);
      toast.success(`Successfully unassigned ${member.fullname}`);
      queryClient.invalidateQueries(["portfolio", portfolioID]);
    } catch {
      toast.error("Failed to unassign user");
    } finally {
      setIsUnassigning(false);
    }
  };
  return (
    <>
      <CustomCollapseArrow title={"Manage Team Members"}>
        {portfolioTeamMembers.length === 0 ? (
          <InnerEmptyState
            title={"No team members in this portfolio"}
            message="We couldn't find any members assigned to this portfolio."
            icon={<MdErrorOutline className="text-4xl text-error" />}
          />
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full table-sm md:table table-zebra table-auto md:table-fixed">
              <thead>
                <tr>
                  {columnsForTeamManagementTable.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedPortfolioTeamMembers?.map((member) => (
                  <tr key={member.id}>
                    <td>{member.fullname}</td>
                    <td>{member.username}</td>
                    <td>{member.email}</td>
                    <td>{roleMapperDict[member.role]}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-success"
                        style={{ borderRadius: "var(--border-radius" }}
                        disabled={member.role == "pm"}
                        title={member.role === "pm" ? "PMs cannot be unassigned" : ""}
                        onClick={() => showMemberManagementModal(member.id)}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CustomCollapseArrow>
      {/* THIS IS THE MEMBER MANAGE MODAL SECTION*/}
      {memberManageModalData && (
        <ModalHelper
          id="memberManageModal" reference={memberManageModalRef}
          modalTitle={memberManageModalData ? `Manage ${memberManageModalData.fullname}` : "Manager Undefined User"}
          closeModalActions={closeMemberManageModal}
        >
          <div className="flex flex-col gap-3 md:gap-0 md:flex-row md:justify-between items-start md:items-center">
            <p className="text-lg md:text-base">Unassign member from this portfolio</p>
            <button
              className="btn btn-lg md:btn-md btn-error text-primary-content"
              style={{ borderRadius: "var(--border-radius" }}
              onClick={() => memberUnassignHandler(memberManageModalData)}
              disabled={wasMemberUnassigned}
            >
              {isUnassigning ? "Unassigning..." : "Unassign"}
            </button>
          </div>
          <div className="mb-3">
          </div>
        </ModalHelper>
      )}
    </>
  );
}
