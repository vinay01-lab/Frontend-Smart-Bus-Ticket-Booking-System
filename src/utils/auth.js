// Save logged-in user
export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Get logged-in user
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("user");
  window.location.href = "/login";
};
