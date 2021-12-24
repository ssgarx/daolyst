import React, { useContext } from "react";
import style from "./profileDropDown.module.scss";
import { AuthContext } from "../context/auth";

function ProfileDropdown({ handleDashboardOpen }) {
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };
  return (
    <>
      <div className={style.box1}>
        <p onClick={handleDashboardOpen}>dashboard</p>
        <p onClick={handleLogout}>logout</p>
      </div>
    </>
  );
}

export default ProfileDropdown;
