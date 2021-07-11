/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import FirstSetUp from "./FirstSetUp";

function LoggedInScreen({ user }, args = {}) {
  const { logout } = useContext(AuthContext);

  return (
    <>
      {user ? (
        <>
          <h1>You're logged in as {user.email} </h1>
          <a href="#" onClick={logout}>
            Logout
          </a>
        </>
      ) : (
        <>
          <FirstSetUp />
          <a href="#" onClick={logout}>
            Logout
          </a>
        </>
      )}
    </>
  );
}

export default LoggedInScreen;
