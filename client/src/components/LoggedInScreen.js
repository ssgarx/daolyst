/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import CentralPollingUnit from "./CentralPollingUnit";
import Groups from "../pages/Groups";
import Group from "../pages/Group";
import Explore from "../pages/Explore";

function LoggedInScreen({ user }, args = {}) {
  const { logout } = useContext(AuthContext);
  return (
    <>
      <div style={{ border: "1px solid red" }}>
        <h1>
          You're logged in as <br /> {user.email}{" "}
        </h1>
        <button onClick={logout}>Logout</button>
      </div>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <div style={{ border: "1px solid red" }}>
          <Groups />
        </div>
        <div
          style={{ border: "1px solid red", height: 500, overflow: "scroll" }}
        >
          <Group />
        </div>
        <div
          style={{ border: "1px solid red", height: 500, overflow: "scroll" }}
        >
          <Explore />
        </div>
      </div>
      <CentralPollingUnit />
    </>
  );
}

export default LoggedInScreen;
