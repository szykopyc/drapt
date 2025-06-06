import { useState, useEffect, useRef } from "react";
import { CustomCollapseArrow } from "../baseui/CustomCard";
import { dummyUserTableData } from "../../assets/dummy-data/tableData";
import { LoadingSpinner } from "../helperui/LoadingSpinnerHelper";

function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function (...args) {
    const context = this;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

export function UserShowAllCard() {
  const [ loading, setLoading ] = useState(false);
  const [ loaded, setLoaded ] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState("");

  const throttledSetFilter = useRef(
    throttle((value) => {
      setFilter(value);
      setLoading(true);
      setLoaded(false);
      setTimeout(() => {
        setLoading(false);
        setLoaded(true);
      }, 1000);
    }, 500)
  ).current;

  const handleFilterChange = (e) => {
    setInputValue(e.target.value);
    throttledSetFilter(e.target.value);
  };

  const filteredUsers =
    filter.trim().toLowerCase() === "all"
      ? dummyUserTableData
      : dummyUserTableData.filter(
          (user) =>
            user.fullName.toLowerCase().includes(filter.toLowerCase()) ||
            user.username.toLowerCase().includes(filter.toLowerCase()) ||
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
        {!loaded && loading && (
          <LoadingSpinner/>
        )}
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
                    <td>{user.fullName}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.team}</td>
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