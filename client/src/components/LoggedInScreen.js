/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

function LoggedInScreen({ user }, args = {}) {
  console.log("user", user);
  const { logout } = useContext(AuthContext);

  return (
    <>
      <h1>
        You're logged in as <br /> {user.email}{" "}
      </h1>
      <a href="#" onClick={logout}>
        Logout
      </a>
      <br />
      <Link to="/groups">
        <p>Groups</p>
      </Link>
      <br />
      <Link to="/explore">
        <p>Explore</p>
      </Link>
    </>
  );
}

export default LoggedInScreen;
