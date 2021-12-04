import React, { useState } from "react";
import style from "./login.module.scss";
import Icon from "../../assets/mainLogo.svg";
import crossIcon from "../../assets/crossIcon.svg";
import { useForm } from "../../util/hooks";
import EmailForm from "./EmailForm";
import OtpForm from "./OtpForm";

function Login({ setOpen }) {
  const [isOtpSent, setIsOtpSent] = useState(false); //FALSE = SHOW EMAIL FORM, TRUE = SHOW OTP FORM

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
          {!isOtpSent ? (
            <p>Welcome back! Signin or Login with one simple OTP!</p>
          ) : (
            <p>OTP sent to your Email.</p>
          )}
        </div>
        {!isOtpSent ? (
          <EmailForm setIsOtpSent={setIsOtpSent} />
        ) : (
          <OtpForm setOpen={setOpen} setIsOtpSent={setIsOtpSent} />
        )}
      </div>
    </div>
  );
}

export default Login;
