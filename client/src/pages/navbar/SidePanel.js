import React, { useContext, useEffect, useState } from "react";
import style from "./sidePanel.module.scss";
import searchIcon from "../../assets/searchIcon.svg";
import crossIcon from "../../assets/crossIcon.svg";
import { AuthContext } from "../../context/auth";

function SidePanel({ setOpen, user, setOpenLyst, handleDashboardOpen }) {
  const { logout } = useContext(AuthContext);
  const [localUser, setLocalUser] = useState({});
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.userProfileImg && userData?.username) {
      setLocalUser(userData);
    }
  }, []);
  const handleLogout = () => {
    logout();
    window.location.reload();
  };
  return (
    <div className={style.box}>
      <div className={style.box1}>
        <div>
          <div>
            <img src={searchIcon} alt="search" />
          </div>
          <div>
            <input type="text" placeholder="Search" />
          </div>
          <div>
            <img src={crossIcon} alt="search" />
          </div>
        </div>
      </div>
      <div className={style.box2}>
        <p
          style={
            window.location.pathname === "/"
              ? { fontWeight: "bold" }
              : { fontWeight: "normal" }
          }
        >
          DAO's
        </p>
        <p>community</p>
        <p>about</p>
        <p
          onClick={() => {
            setOpenLyst(true);
          }}
        >
          lyst my DAO⚡
        </p>
        <>
          {!user ? (
            <div
              onClick={() => {
                setOpen(true);
              }}
            >
              log in
            </div>
          ) : (
            <>
              <p onClick={handleDashboardOpen}>dashboard</p>
              <div className={style.signedIn}>
                <div className={style.signedInA}>
                  <img
                    style={
                      (user?.userProfileImg?.length ||
                        localUser?.userProfileImg?.length) > 0
                        ? {
                            borderRadius: "50%",
                            width: "25px",
                          }
                        : {
                            borderRadius: "none",
                            width: "20px",
                          }
                    }
                    src={
                      user?.userProfileImg?.length > 0
                        ? user?.userProfileImg
                        : localUser?.userProfileImg
                    }
                    alt="dp"
                  />
                </div>
                <div className={style.signedInB} onClick={handleLogout}>
                  {user?.username?.length > 0
                    ? user.username
                    : localUser.username}{" "}
                  &gt; logout
                </div>
              </div>
            </>
          )}
        </>
      </div>
    </div>
  );
}

export default SidePanel;
