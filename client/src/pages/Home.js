/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { gql, useQuery } from "@apollo/react-hooks";
import { AuthContext } from "../context/auth";
import LoggedInScreen from "../components/LoggedInScreen";
import LoggedOutScreen from "../components/LoggedOutScreen";

function Home() {
  const { user } = useContext(AuthContext);
  //GET ALL USER DATA BASED ON USER EMAIL (WHICH IS UNIQUE)
  //CHECK IF USER HAS USERNAME
  //IF NO > MEANS USER IS LOGGING IN FOR THE FIRST TIME (FTLI)
  // FTLI  = TAKE USER TO (FILL THE BASIC INFO BEFORE CONTINUING SCREEN)
  return <>{user ? <LoggedInScreen user={user} /> : <LoggedOutScreen />}</>;
}

export default Home;
