/* eslint-disable jsx-a11y/anchor-is-valid */
import { gql, useQuery } from "@apollo/client";
import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import FirstSetUp from "./FirstSetUp";

function LoggedInScreen({ user }, args = {}) {
  const userId = user.id;
  const { logout } = useContext(AuthContext);

  const { data: { userName } = args } = useQuery(FETCH_ALL_USER_DATA, {
    variables: {
      userId,
    },
  });

  console.log("userName", userName);

  return (
    <>
      {userName ? (
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
const FETCH_ALL_USER_DATA = gql`
  query ($userId: ID!) {
    getAllData(userId: $userId) {
      username
    }
  }
`;

export default LoggedInScreen;
