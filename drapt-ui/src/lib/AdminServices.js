import ApiClient from "../../api/ApiClient";

// this has a RQ hook
export async function selectAllUsers() {
  try {
    const response = await ApiClient.get(
      "/user/all",
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return response.data;
  }
  catch {
    return null;
  }
}

// this doesn't need a RQ Hook
export async function updateUser(user_id, fieldsToPatch) {
  try {
    const response = await ApiClient.patch(
      `/user/${user_id}/update`, fieldsToPatch, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// this doesn't need a RQ hook
export async function searchUserByUsername(username) {
  try {
    const response = await ApiClient.get(
      `/user/${username}/search`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

// this has a RQ hook
export async function searchUserByRole(role) {
  const response = await ApiClient.get(
    `/user/${role}/searchbyrole`, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  }
  )
  return response.data;
}

// PM (authorised by PID) and exec only service
export async function unassignUserFromAnyPortfolio(user_id) {
  try {
    const response = await ApiClient.patch(
      `/user/${user_id}/unassign-user-from-portfolio`, {}, {
      withCredentials: true,
    }
    );
    return response.data;
  }
  catch (error) {
    throw error;
  }
}

// exec only service
// this doesn't need a RQ hook
export async function deleteUserByID(user_id) {
  try {
    const response = await ApiClient.delete(
      `/user/${user_id}/delete`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
