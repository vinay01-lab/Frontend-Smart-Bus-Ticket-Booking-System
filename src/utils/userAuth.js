export const getUserHeaders = () => {
  const token = localStorage.getItem("user_token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};
