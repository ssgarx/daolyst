import React from "react";
import style from "./login.module.scss";
import Icon from "../assets/mainLogo.svg";
import crossIcon from "../assets/crossIcon.svg";

function Login({ setOpen }) {
  return (
    <div className={style.box1}>
      <div className={style.box1A}>
        <div
          onClick={() => {
            setOpen(false);
          }}
          className={style.closeBtn}
        >
          <img src={crossIcon} alt="close_icon" />
        </div>
        <div className={style.box1A1}>
          <img src={Icon} alt="daolyst_icon" />
        </div>
        <div className={style.box1A2}>
          <p>
            Discover, Learn, Explore. <br />
            All about DAOs and much more.
          </p>
          <p>Welcome back! Signin or Login with one simple OTP!</p>
        </div>
        <div className={style.box1A3}>
          <div>
            <input type="text" placeholder="Email Adress" />
          </div>
        </div>

        <div className={style.box1A4}>
          <button>Send OTP</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
