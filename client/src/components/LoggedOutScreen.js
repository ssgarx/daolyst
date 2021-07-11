import React from "react";
import { Link } from "react-router-dom";

function LoggedOutScreen() {
  return (
    <div>
      <h1>You're logged out </h1>
      <Link
        to={{
          pathname: "/register",
        }}
      >
        Register
      </Link>
      <br />
      <Link
        to={{
          pathname: "/login",
        }}
      >
        Login
      </Link>
    </div>
  );
}

export default LoggedOutScreen;
