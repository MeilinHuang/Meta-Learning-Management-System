import React from "react";

export function isLoggedIn() {
  return sessionStorage.getItem("token") === null;
}
