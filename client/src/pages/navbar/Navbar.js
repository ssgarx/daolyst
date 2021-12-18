import React, { useEffect, useState } from "react";
import style from "./navbar.module.scss";
import logo from "../../assets/mainLogo.svg";
import searchIcon from "../../assets/searchIcon.svg";
import crossIcon from "../../assets/crossIcon.svg";

function Navbar({ setOpen, user, setOpenLyst }) {
  const [localUser, setLocalUser] = useState({});
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.userProfileImg && userData?.username) {
      setLocalUser(userData);
    }
  }, []);
  return (
    <div className={style.box}>
      <div className={style.box1}>
        <div className={style.box1A}>
          <img src={logo} alt="logo" />
        </div>
        <div className={style.box1B}>
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
          <div
            style={
              window.location.pathname === "/"
                ? { fontWeight: "bold" }
                : { fontWeight: "normal" }
            }
          >
            DAO's
          </div>
          <div>community</div>
          <div>about</div>
          <div
            onClick={() => {
              user ? setOpenLyst(true) : setOpen(true);
            }}
          >
            lyst my DAO⚡
          </div>
          {!user ? (
            <div
              onClick={() => {
                setOpen(true);
              }}
            >
              log in
            </div>
          ) : (
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
              <div className={style.signedInB}>
                {user?.username?.length > 0
                  ? user.username
                  : localUser.username}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
