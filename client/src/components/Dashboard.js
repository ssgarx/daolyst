import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import style from "./dashboard.module.scss";
import DefaultDp from "../assets/defaultDp.svg";
import gql from "graphql-tag";
import { useLazyQuery } from "@apollo/client";
import { CircularProgress } from "@material-ui/core";
import DashboardProjs from "./DashboardProjs";
function Dashboard({ setOpenDashboard, setOpenLyst }) {
  const { user } = useContext(AuthContext);
  const [sideOptions, setSideOptions] = useState("LYSTED_DAOS");
  const [fetchedProjects, setFetchedProjects] = useState([]);

  useEffect(() => {
    getAllProjects();
  }, []);

  useEffect(() => {
    console.log("fetchedProjects", fetchedProjects);
  }, [fetchedProjects]);

  const [getAllProjects, { loading, data }] = useLazyQuery(GET_ALL_PROJECTS, {
    onCompleted: () => {
      setFetchedProjects(data?.getAllProjects?.listedProjects);
    },
    variables: {
      email: user.email,
    },
    fetchPolicy: "no-cache",
  });

  return (
    <div className={style.box1}>
      <div className={style.box1A}>
        <div className={style.box1A1}>
          {/* PROFILE DATA */}
          <div className={style.profileBox}>
            <div className={style.imgBox}>
              <img src={user?.userProfileImg ?? DefaultDp} alt="default" />
            </div>
            <div className={style.usernameBox}>
              <p>{user?.username}</p>
            </div>
            <div className={style.useremailBox}>
              <p>{user?.email}</p>
            </div>
          </div>
          {/* options */}
          <div className={style.optionsBox}>
            <div
              onClick={() => {
                setSideOptions("LYSTED_DAOS");
              }}
            >
              <p
                style={{
                  color: sideOptions === "LYSTED_DAOS" ? "#21293c" : "",
                }}
              >
                Lysted DAOs
              </p>{" "}
            </div>
            <div
              onClick={() => {
                setSideOptions("PROFILE");
              }}
            >
              <p
                style={{
                  color: sideOptions === "PROFILE" ? "#21293c" : "",
                }}
              >
                Profile
              </p>
            </div>
          </div>
        </div>
        <div className={style.box1A2}>
          {sideOptions === "LYSTED_DAOS" ? (
            <>
              <div className={style.box1A2A}>
                <div className={style.overview}>your lystings</div>
              </div>
              <div
                className={style.box1A2B}
                style={
                  loading
                    ? {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }
                    : {}
                }
              >
                {loading ? (
                  <CircularProgress style={{ color: "gray" }} />
                ) : fetchedProjects.length > 0 ? (
                  fetchedProjects?.map((item, index) => (
                    <div key={index}>
                      <DashboardProjs
                        mainItem={data?.getAllProjects}
                        fetchedProjects={fetchedProjects}
                        setFetchedProjects={setFetchedProjects}
                        item={item}
                      />
                    </div>
                  ))
                ) : (
                  <div className={style.noProjects}>
                    <p>you have no lysted projects</p>
                    <button
                      onClick={() => {
                        setOpenDashboard(false);
                        setOpenLyst(true);
                      }}
                      className={style.lystBtn}
                    >
                      lyst my DAO⚡
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className={style.box1A2A}>
                <div className={style.overview}>your profile</div>
              </div>
              <div className={style.box1A2B}>
                <h1>random</h1>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const GET_ALL_PROJECTS = gql`
  query getAllProjects($email: String!) {
    getAllProjects(email: $email) {
      email
      username
      userProfileImg
      createdAt
      listedProjects {
        _id
        projectName
        projectTag
        projectDescription
        projectIcon
        projectImages
        projectVideoLink
        createdAt
        uplysts {
          email
          username
          userProfileImg
        }
      }
    }
  }
`;

export default Dashboard;
