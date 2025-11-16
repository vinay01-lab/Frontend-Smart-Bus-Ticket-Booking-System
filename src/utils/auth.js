// src/utils/auth.js

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}

export function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function logoutUser() {
  localStorage.removeItem("user");
  window.location.href = "/login"; // redirect after logout
}

export function isLoggedIn() {
  return !!getUser();
}
