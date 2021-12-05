import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import style from "./identificationForm1.module.scss";
import UploadDpIcon from "../../assets/uploadIcon.svg";
import crossIcon from "../../assets/crossIcon.svg";
import { useHistory } from "react-router-dom";
import { useForm } from "../../util/hooks";
function IdentificationForm1({ setOpen }) {
  let history = useHistory();
  const [errors, setErrors] = useState({});
  const { onChange, onSubmit, values } = useForm(completeOtf, {
    username: "",
  });
  const [submitOtf] = useMutation(SUBMIT_OTF, {
    update(_, { data: { oneTimeForm: userData } }) {
      console.log("userDatax", userData);
      setOpen(false);
      history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });
  function completeOtf() {
    submitOtf();
  }
  return (
    <div className={style.box1}>
      <img className={style.crossIcon} src={crossIcon} alt="close_icon" />
      <div className={style.boxA}>
        <p>Select Avatar</p>
        <img src={UploadDpIcon} alt="upload_profile_picture" />
      </div>
      <div className={style.boxB}>
        <div className={style.boxB1}>
          <p>What should you be called as?</p>
        </div>
        <div className={style.boxB2}>
          <div className={style.box1A3}>
            <div>
              <input
                placeholder="Username"
                name="username"
                type="username"
                value={values.username}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={style.boxC}>
        <button
          onClick={(e) => {
            values?.username?.length > 0 && onSubmit(e);
          }}
          className={
            values?.username?.length > 0
              ? style.buttonEnabled
              : style.buttonDisabled
          }
        >
          Save
        </button>
      </div>
    </div>
  );
}
const SUBMIT_OTF = gql`
  mutation oneTimeForm($username: String!) {
    oneTimeForm(username: $username) {
      id
      email
      username
    }
  }
`;
export default IdentificationForm1;
