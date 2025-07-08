import { useQuery } from "@tanstack/react-query";
import { selectAllUsers, searchUserByRole, searchUserByUsername } from "../lib/AdminServices";

export function hookSelectAllUsers(){
    return useQuery({
        queryKey: ["allusers"],
        queryFn: selectAllUsers,
        staleTime: 1000 * 60 * 1
    })
}

export function hookSearchUserByRole(role){
    return useQuery({
        queryKey: ["user",role],
        queryFn: () => searchUserByRole(role),
        staleTime: 1000 * 60 * 1
    })
}