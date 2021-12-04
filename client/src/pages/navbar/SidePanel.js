import React from "react";
import style from "./sidePanel.module.scss";
import searchIcon from "../../assets/searchIcon.svg";
import crossIcon from "../../assets/crossIcon.svg";

function SidePanel({ setOpen, user, setOpenLyst }) {
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
            <p
              onClick={() => {
                setOpen(true);
              }}
            >
              log in
            </p>
          ) : (
            <p
              onClick={() => {
                setOpen(true);
              }}
            >
              logged in
            </p>
          )}
        </>
      </div>
    </div>
  );
}

export default SidePanel;
