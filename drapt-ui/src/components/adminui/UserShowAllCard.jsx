import { useState, useEffect } from "react";
import { CustomCollapseArrow } from "../baseui/CustomCard";
import { useForm } from "react-hook-form";
import { FormField } from "../helperui/FormFieldHelper";
import LargeSubmit from "../baseui/LargeSubmitHelper";
import { teamMapperDict } from "../../helperfunctions/TeamMapper";
import { roleMapperDict } from "../../helperfunctions/RoleMapper";
import { FaHdd, FaServer } from "react-icons/fa";
import InnerEmptyState from "../errorui/InnerEmptyState";

import { hookSelectAllUsers } from "../../reactqueryhooks/useAdminHook";

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

    const { data: allUserData = [] } = hookSelectAllUsers();

    const handleSearch = (formdata) => {
        setFilter(formdata.searchCriteria.trim());
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
                }}
            >
                <form
                    className="flex flex-col md:flex-row gap-3 w-full"
                    onSubmit={handleSubmit(handleSearch)}
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
                    <div className="mt-auto w-full md:w-1/5" form="searchForm">
                        <LargeSubmit disabled={!searchField}>
                            Search
                        </LargeSubmit>
                    </div>
                </form>
                {shouldShowTable && (
                    <div className="overflow-x-auto">
                        <table className="table-sm md:table table-zebra">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Full Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Team</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <th>{user.id}</th>
                                        <td>{user.fullname}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{roleMapperDict[user.role]}</td>
                                        <td>{teamMapperDict[user.team]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
