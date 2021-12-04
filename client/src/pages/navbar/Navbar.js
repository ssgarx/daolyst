import React from "react";
import style from "./navbar.module.scss";
import logo from "../../assets/mainLogo.svg";
import hamIcon from "../../assets/hamIcon.svg";
import hamIconRotated from "../../assets/hamIconRotated.svg";
import searchIcon from "../../assets/searchIcon.svg";
import crossIcon from "../../assets/crossIcon.svg";

function Navbar({ setOpen, user, setOpenLyst }) {
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
              setOpenLyst(true);
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
            <div>logged in</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
