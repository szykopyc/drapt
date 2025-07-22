import { useState, useMemo } from "react";
import { CustomCollapseArrow } from "../baseui/CustomCard";
import { useForm } from "react-hook-form";
import { FormField } from "../helperui/FormFieldHelper";
import CustomButton from "../baseui/CustomButton";
import { teamMapperDict } from "../../helperfunctions/TeamMapper";
import { roleMapperDict } from "../../helperfunctions/RoleMapper";
import { FaHdd, FaServer } from "react-icons/fa";
import InnerEmptyState from "../errorui/InnerEmptyState";

import { AgGridReact } from "ag-grid-react";

import { useHookSelectAllUsers } from "../../reactqueryhooks/useAdminHook";

export function UserShowAllCard() {
    // initialising user data which will be loaded, the loading state
    const [filter, setFilter] = useState("");

    // initialising form
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({ mode: "onSubmit" });

    // loads on mount
    const { data: allUserData = [] } = useHookSelectAllUsers();

    const handleSearch = (formdata) => {
        setFilter(formdata.searchCriteria.trim());
    };

    const clearFilter = () => {
        setFilter("");
    };

    // filters users by fullname, username, team and role
    let filteredUsers =
        filter.trim().toLowerCase() === "all"
            ? allUserData
            : allUserData.filter(
                  (user) =>
                      user.fullname
                          .toLowerCase()
                          .includes(filter.toLowerCase()) ||
                      user.username
                          .toLowerCase()
                          .includes(filter.toLowerCase()) ||
                      teamMapperDict[user.team]
                          .toLowerCase()
                          .includes(filter.toLowerCase()) ||
                      roleMapperDict[user.role]
                          .toLowerCase()
                          .includes(filter.toLowerCase())
              );

    // Sort users by role hierarchy
    const sortedFilteredUsers = useMemo(() => {
        const roleOrder = {
            developer: 0,
            director: 1,
            vd: 2,
            pm: 3,
            senioranalyst: 4,
            analyst: 5,
        };

        return filteredUsers.slice().sort((a, b) => {
            return (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99);
        });
    }, [filteredUsers]);

    // AG Grid column definitions
    const columnDefs = useMemo(
        () => [
            {
                headerName: "Full Name",
                field: "fullname",
                sortable: true,
                filter: true,
                minWidth: 150,
            },
            {
                headerName: "Username",
                field: "username",
                sortable: true,
                filter: true,
                minWidth: 120,
            },
            {
                headerName: "Email",
                field: "email",
                sortable: true,
                filter: true,
                minWidth: 200,
            },
            {
                headerName: "Role",
                field: "role",
                valueGetter: ({ data }) => roleMapperDict[data.role],
                sortable: true,
                filter: true,
                minWidth: 130,
            },
            {
                headerName: "Team",
                field: "team",
                valueGetter: ({ data }) => teamMapperDict[data.team],
                sortable: true,
                filter: true,
                minWidth: 140,
            },
            {
                headerName: "Assigned",
                field: "portfolio_id",
                cellRenderer: ({ data }) => {
                    return data.portfolio_id ? (
                        <span className="badge font-semibold h-full w-full badge-success rounded-none">
                            TRUE
                        </span>
                    ) : (
                        <span className="badge font-semibold h-full w-full badge-error rounded-none">
                            FALSE
                        </span>
                    );
                },
                sortable: true,
                filter: true,
                minWidth: 100,
                maxWidth: 120,
            },
        ],
        []
    );

    const defaultColDef = useMemo(
        () => ({
            flex: 1,
            filter: true,
            resizable: true,
            minWidth: 100,
            sortable: true,
            sortingOrder: ["asc", "desc", null],
        }),
        []
    );

    // in case there are no users
    let emptyUserDataError = false;

    // in case of server error not passing in any users
    let dataStreamError = false;

    let shouldShowTable = filter.trim().length > 0;

    if (filteredUsers.length === 0) {
        emptyUserDataError = true;
        shouldShowTable = false;
    }

    if (allUserData.length === 0) {
        emptyUserDataError = false;
        shouldShowTable = false;
        dataStreamError = true;
    }

    // watch field to only enable input on entry
    const searchField = watch("searchCriteria");

    return (
        <>
            <CustomCollapseArrow
                id={"userShowAllCard"}
                title={"Show all users"}
                defaultOpen={false}
                onClose={() => {
                    reset();
                    clearFilter();
                }}
            >
                <form
                    className="flex flex-col md:flex-row gap-3 w-full"
                    onSubmit={handleSubmit(handleSearch)}
                    onChange={() => clearFilter()}
                    autoComplete="off"
                    id="searchForm"
                >
                    <div className="w-full md:w-4/5">
                        <FormField label={"Search"}>
                            <input
                                type="text"
                                placeholder='Filter by name, username, team, role or (type "all" to show all)'
                                className="input input-bordered w-full"
                                {...register("searchCriteria", {
                                    required: "Search criteria is required",
                                })}
                                autoComplete="off"
                                autoCapitalize="false"
                                disabled={dataStreamError}
                            />
                        </FormField>
                    </div>
                    <div className="flex mt-auto w-full md:w-1/5">
                        <CustomButton disabled={!searchField} form="searchForm">
                            Search
                        </CustomButton>
                    </div>
                </form>

                {shouldShowTable && (
                    <div
                        className="ag-theme-quartz mt-4"
                        style={{
                            width: "100%",
                            maxHeight: "500px",
                            minHeight: "auto",
                            height: "auto",
                            overflow: "auto",
                        }}
                    >
                        <AgGridReact
                            rowData={sortedFilteredUsers}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            domLayout="autoHeight"
                            getRowHeight={() => 32}
                            headerHeight={32}
                            animateRows={true}
                            suppressCellFocus={true}
                            pagination={false}
                            suppressHorizontalScroll={false}
                        />
                    </div>
                )}

                {emptyUserDataError && (
                    <div className="mt-[24px]">
                        <InnerEmptyState
                            title="We couldn't find users who matched your description"
                            message="Try a different search filter"
                            icon={
                                <FaHdd className="text-4xl text-base-content/40" />
                            }
                            enablePadding={false}
                        ></InnerEmptyState>
                    </div>
                )}
                {dataStreamError && (
                    <div className="mt-[24px]">
                        <InnerEmptyState
                            title="Data stream error"
                            message="It looks like we have an issue on the backend, please contact the developer"
                            icon={
                                <FaServer className="text-4xl text-base-content/40" />
                            }
                            enablePadding={false}
                        ></InnerEmptyState>
                    </div>
                )}
            </CustomCollapseArrow>
        </>
    );
}
