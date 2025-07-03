import { useState, useEffect } from "react";
import { CustomCollapseArrow } from "../baseui/CustomCard";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";
import { selectAllUsers } from "../../services/AdminServices";

export function UserShowAllCard() {
    const [allUserData, setAllUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [filter, setFilter] = useState("");

    // Fetch all users on mount
    useEffect(() => {
        setLoading(true);
        selectAllUsers()
            .then((data) => {
                setAllUserData(Array.isArray(data) ? data : []);
                setLoaded(true);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleFilterChange = (e) => {
        setInputValue(e.target.value);
        setFilter(e.target.value);
    };

    const filteredUsers =
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
                      user.team.toLowerCase().includes(filter.toLowerCase())
              );

    const shouldShowTable = filter.trim().length > 0;

    return (
        <>
            <CustomCollapseArrow
                id={"userShowAllCard"}
                title={"Show all users"}
                defaultOpen={false}
            >
                <input
                    type="text"
                    placeholder='Filter by name, username, or team (type "all" to show all)'
                    className="input input-bordered mb-2 w-full"
                    value={inputValue}
                    onChange={handleFilterChange}
                />
                {!loaded && loading && <LoadingSpinner />}
                {shouldShowTable && loaded && (
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
                                        <td>
                                            {user.role.charAt(0).toUpperCase() +
                                                user.role.slice(1)}
                                        </td>
                                        <td>
                                            {user.team.charAt(0).toUpperCase() +
                                                user.team.slice(1)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CustomCollapseArrow>
        </>
    );
}
