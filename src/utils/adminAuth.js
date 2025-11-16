export function getAdminToken() {
  return localStorage.getItem("adminToken");
}

export function getAdminHeaders() {
  const token = getAdminToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export function clearAdminAuth() {
  localStorage.removeItem("adminToken");
}
