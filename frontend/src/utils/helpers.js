import React from "react";
import { backend_url } from "../Constants.js";

export function isLoggedIn() {
  return localStorage.getItem("token") !== null;
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
      Authorisation: `Bearer ${localStorage.getItem("token")}`,
    },
  };
  return await fetch(backend_url + `user/${id}`, options)
    .then((r) => r.json())
    .then((r) => {
      return r;
    });
}
