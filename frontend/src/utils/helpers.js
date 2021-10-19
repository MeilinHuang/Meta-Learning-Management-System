import React from "react";
import { backend_url } from "../Constants.js";

export function isLoggedIn() {
  return localStorage.getItem("token") !== null;
}

// Checks if logged in user is staff
export function isStaff() {
  return !!Number(localStorage.getItem("staff"))
}

// Checks if logged in user matches the given userId
export function isLoggedInUser(userId) {
  return Number(localStorage.getItem("id")) === userId

}

export function logOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("staff");
  localStorage.removeItem("id");
}

export async function getUser(id) {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/JSON",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return await fetch(backend_url + `user/${id}`, options)
    .then((r) => r.json())
    .then((r) => {
      return r;
    });
}
