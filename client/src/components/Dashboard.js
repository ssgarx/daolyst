import React, { useContext } from "react";
import { AuthContext } from "../context/auth";
import style from "./dashboard.module.scss";
import DefaultDp from "../assets/defaultDp.svg";
function Dashboard() {
  const { user } = useContext(AuthContext);
  console.log("user", user);
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
            <div>
              <p>Lysted DAOs</p>{" "}
            </div>
            <div>
              <p>Profile</p>
            </div>
          </div>
        </div>
        <div className={style.box1A2}>
          <div className={style.box1A2A}>
            <div className={style.overview}>Overview</div>
          </div>
          <div className={style.box1A2B}>
            <p>lysts here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
