import { useQuery } from "@tanstack/react-query";
import { selectAllUsers, searchUserByRole } from "../lib/AdminServices";

export function useHookSelectAllUsers() {
  return useQuery({
    queryKey: ["allusers"],
    queryFn: selectAllUsers,
    staleTime: 1000 * 60 * 1
  })
}

export function useHookSearchUserByRole(role) {
  return useQuery({
    queryKey: ["user", role],
    queryFn: () => searchUserByRole(role),
    staleTime: 1000 * 60 * 1
  })
}
