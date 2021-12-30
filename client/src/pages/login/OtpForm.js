import React, { useContext, useState } from "react";
import style from "./login.module.scss";
import { useForm } from "../../util/hooks";
import { gql, useMutation } from "@apollo/client";
import { AuthContext } from "../../context/auth";
function OtpForm({
  setOpen, //TO OPEN/CLOSE THE MODAL
  setIsOtpSent, //TO TRIGGER BACK ACTION TO
}) {
  const context = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState(null);
  const { onChange, onSubmit, values } = useForm(verifyotp, {
    code: "",
  });

  const [addUser, { loading }] = useMutation(VERIFY_OTP, {
    update(_, { data: { verifyOtp: userData } }) {
      setEmail(userData?.email);

      context.login(userData);
      deleteOtps();
      if (userData?.username) {
        localStorage.removeItem("userData");
        setOpen(false);
      }
      // history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function verifyotp() {
    addUser();
  }
  const [deleteOtps] = useMutation(DELETE_OTP, {
    variables: {
      email,
    },
  });

  return (
    <>
      <div
        style={{
          width: "80%",
        }}
        className={style.box1A3}
      >
        <div>
          <input
            placeholder="6 Digit OTP"
            name="code"
            value={values.code}
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
            values?.code?.length > 0
              ? {
                  opacity: 1,
                  cursor: "pointer",
                }
              : {
                  opacity: 0.5,
                  cursor: "not-allowed",
                }
          }
          onClick={(e) => {
            values?.code?.length > 0 && onSubmit(e);
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
    </>
  );
}

const VERIFY_OTP = gql`
  mutation verifyOtp($code: String!) {
    verifyOtp(code: $code) {
      code
      token
      email
      username
      createdAt
    }
  }
`;

const DELETE_OTP = gql`
  mutation deleteOtp($email: String!) {
    deleteOtps(email: $email)
  }
`;

export default OtpForm;
