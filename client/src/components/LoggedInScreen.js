/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/auth";
import CentralPollingUnit from "./CentralPollingUnit";
function LoggedInScreen({ user }, args = {}) {
  let history = useHistory();
  const { logout } = useContext(AuthContext);
  return (
    <>
      <h1>
        You're logged in as <br /> {user.email}{" "}
      </h1>
      <button onClick={logout}>Logout</button>
      <br />
      <button onClick={() => history.push("/groups")}>Groups</button>
      <br />
      <button onClick={() => history.push("/explore")}>Explore</button>
      <CentralPollingUnit />
    </>
  );
}

export default LoggedInScreen;
