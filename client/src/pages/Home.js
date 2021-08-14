/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import LoggedInScreen from "../components/LoggedInScreen";
import LoggedOutScreen from "../components/LoggedOutScreen";

function Home() {
  const { user } = useContext(AuthContext);
  return <>{user ? <LoggedInScreen user={user} /> : <LoggedOutScreen />}</>;
}

export default Home;
