import { useParams } from "react-router-dom";
import { CardOne, CustomCollapseArrow } from "../baseui/CustomCard";
import { useForm } from "react-hook-form";
import React, { useState, useRef, useEffect } from "react";
import { ModalHelper } from "../helperui/ModalHelper";
import { FormErrorHelper } from "../helperui/FormErrorHelper";
import { CustomButtonInputStyle } from "../baseui/CustomButton";
import { FormField } from "../helperui/FormFieldHelper";
import InnerEmptyState from "../errorui/InnerEmptyState";
import { MdErrorOutline } from "react-icons/md";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import { useHookSearchPortfolioOverview } from "../../reactqueryhooks/usePortfolioHook";
import { updatePortfolioMetadata } from "../../lib/PortfolioServices";
import { useQueryClient } from "@tanstack/react-query";

//toasts
import toast, { Toaster } from 'react-hot-toast';

import { unassignUserFromAnyPortfolio } from "../../lib/AdminServices";

import { roleMapperDict } from "../../helperfunctions/RoleMapper";

export function PortfolioAdminPanel() {
  const { portfolioID } = useParams();

  const { data: portfolioOverviewData = [], isLoading, isError, error } = useHookSearchPortfolioOverview(portfolioID);

  const portfolioTeamMembers = portfolioOverviewData?.members || [];


  const queryClient = useQueryClient();

  const [isLoadingAfterUpdate, setIsLoadingAfterUpdate] = useState(false);

  const memberManageModalRef = useRef(null);
  const [memberManageModalData, setMemberManageModalData] = useState(null);

  const closeMemberManageModal = () => {
    if (memberManageModalRef.current)
      memberManageModalRef.current.close();
    setMemberManageModalData(null);
    setWasMemberUnassigned(false);
  }

  useEffect(() => {
    if (memberManageModalData && memberManageModalRef.current) {
      memberManageModalRef.current.showModal();
    }
  }, [memberManageModalData])

  // ----------------UPDATE PORTFOLIO METADATA SECTION---------------
  // FORM FOR UPDATING PORTFOLIO METADATA
  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors: errorsOnFormUpdate },
  } = useForm({
    mode: "onSubmit"
  });

  const isAnyUpdateFieldFilled = (watch("name") || watch("description"));

  // PORTFOLIO CLICK TO CONFIRM button
  const [portfolioUpdateConfirmed, setPortfolioUpdateConfirmed] = useState(false);
  const [isPortfolioBeingUpdated, setIsPortfolioBeingUpdated] = useState(false);

  const portfolioUpdateClickHandler = async (e) => {
    e.preventDefault();
    const valid = await trigger();
    if (valid) setPortfolioUpdateConfirmed(true);
  }

  // THIS IS FOR UPDATING PORTFOLIO METADATA
  const guardedUpdateHandler = async (data) => {
    setIsLoadingAfterUpdate(true);
    try {
      const filteredData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== ""))
      setIsPortfolioBeingUpdated(true);
      const updatedPortfolio = await updatePortfolioMetadata(portfolioOverviewData.id, filteredData);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsPortfolioBeingUpdated(false);
      queryClient.invalidateQueries(["portfolio", portfolioOverviewData.portfolio_string_id]);
      reset();
      setPortfolioUpdateConfirmed(false);
      toast.success("Successfuly modified portfolio details");
    }
    catch (error) {
      return error;
    }
    finally {
      setIsLoadingAfterUpdate(false);
    }
  }

  // ------ MANAGE TEAM MEMBERS SECTION ------------
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
    try {
      setIsUnassigning(true);
      await unassignUserFromAnyPortfolio(member.id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setWasMemberUnassigned(true);
      setIsUnassigning(false);
      queryClient.invalidateQueries(["portfolio", portfolioOverviewData.portfolio_string_id]);
      toast.success(`Successfuly unassigned ${member.fullname} from this portfolio`);
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center">
          <InnerEmptyState
            title={"An Error Occurred"}
            message={error?.response?.data?.detail || error?.message || "An unknown error occurred."}
            icon={<MdErrorOutline className="text-4xl text-error" />}
          />
        </div>
      ) : (
        <>
          <CustomCollapseArrow title={"Update Portfolio Details"} defaultOpen={false} onClose={() => reset()}>
            <form
              id={"portfolioToUpdate"}
              className="flex flex-col gap-3 w-full"
              onSubmit={handleSubmit(guardedUpdateHandler)}
              autoComplete="off"
            >
              <FormField label={"Update Portfolio Name"}>
                <input type="text"
                  className="input input-bordered w-full"
                  {...register("name", {
                    validate: (name) => {
                      if (name == null) return true;
                      if (name !== null && name.length > 50)
                        return "The portfolio name cannot be over 50 characters in length."
                    }
                  })}
                  placeholder={portfolioOverviewData?.name}
                />
              </FormField>
              <FormField label="Update Description">
                <textarea
                  className="textarea textarea-bordered w-full"
                  {...register("description", {
                    validate: (description) => {
                      if (description == null) return true;
                      if (description !== null && description.length > 1024)
                        return "The portfolio description cannot be over 1024 characters in length."
                    }
                  })}
                  autoComplete="off"
                  placeholder={portfolioOverviewData?.description ? portfolioOverviewData.description.slice(0, 150) + "..." : "No current description"}
                // add disabled field 
                ></textarea>
              </FormField>
              <div className="h-[40px] flex gap-3 w-full">
                {!portfolioUpdateConfirmed ? (
                  <CustomButtonInputStyle
                    colour="success"
                    type="button"
                    onClick={portfolioUpdateClickHandler}
                    disabled={!isAnyUpdateFieldFilled}
                  >
                    Update Portfolio
                  </CustomButtonInputStyle>
                ) : (
                  <>
                    <CustomButtonInputStyle
                      form="portfolioToUpdate"
                      colour="success"
                      type="submit"
                    >{isPortfolioBeingUpdated ? "Updating portfolio..." : "Confirm"}</CustomButtonInputStyle>
                    <CustomButtonInputStyle
                      colour="error"
                      onClick={() => setPortfolioUpdateConfirmed(false)}
                      disabled={isPortfolioBeingUpdated}
                    >
                      Cancel
                    </CustomButtonInputStyle>
                  </>
                )}
              </div>
            </form>
            {errorsOnFormUpdate && (
              <div className="flex flex-col gap-1 w-full min-h-0">
                {Object.entries(errorsOnFormUpdate).map(([field, errorObj]) =>
                  errorObj?.message ? (
                    <FormErrorHelper key={field} textSize="md">
                      {errorObj.message}
                    </FormErrorHelper>
                  ) : null,
                )}
              </div>
            )}
          </CustomCollapseArrow>
          <CustomCollapseArrow title={"Manage Team Members"}>
            {portfolioTeamMembers.length === 0 ? (
              <InnerEmptyState
                title={"No team members in this portfolio"}
                message="We couldn't find any members assigned to this portfolio."
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
                    {portfolioTeamMembers.map((member) => (
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
      )}
      <Toaster />
    </>
  );
}
