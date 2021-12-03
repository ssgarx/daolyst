import React, { useState } from "react";
import style from "./login.module.scss";
import Icon from "../assets/mainLogo.svg";
import crossIcon from "../assets/crossIcon.svg";
import { useForm } from "../util/hooks";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

function Login({ setOpen }) {
  const [errors, setErrors] = useState({});

  let history = useHistory();
  const { onChange, onSubmit, values } = useForm(registerUser, {
    email: "",
  });
  const [addUser, { loading }] = useMutation(REGISTER2_USER, {
    onCompleted() {
      // history.push("/otpverification");

      console.log("COMPLETED");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });
  function registerUser() {
    !loading && addUser();
  }
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
            <input
              placeholder="Your Email"
              name="email"
              type="email"
              value={values.email}
              onChange={onChange}
            />
          </div>
        </div>
        {Object.keys(errors).length > 0 && (
          <div className={style.errors}>
            {Object.values(errors).map((value) => (
              <div key={value}>{value}</div>
            ))}
          </div>
        )}

        <div className={style.box1A4}>
          <button
            style={
              values.email.length > 0
                ? {}
                : {
                    opacity: 0.5,
                    cursor: "not-allowed",
                  }
            }
            onClick={(e) => {
              values.email.length > 0 && onSubmit(e);
            }}
          >
            {!loading ? (
              "Send OTP"
            ) : (
              <span>
                Sending <i className="fas fa-circle-notch"></i>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
const REGISTER2_USER = gql`
  mutation register($email: String!) {
    register(email: $email) {
      id
      email
    }
  }
`;
export default Login;
