import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import style from "./identificationForm1.module.scss";
import UploadDpIcon from "../../assets/uploadIcon.svg";
import crossIcon from "../../assets/crossIcon.svg";
import Resizer from "react-image-file-resizer";

// Resizer.imageFileResizer(
//   file, // Is the file of the image which will resized.
//   maxWidth, // Is the maxWidth of the resized new image.
//   maxHeight, // Is the maxHeight of the resized new image.
//   compressFormat, // Is the compressFormat of the resized new image.
//   quality, // Is the quality of the resized new image.
//   rotation, // Is the degree of clockwise rotation to apply to uploaded image.
//   responseUriFunc, // Is the callBack function of the resized new image URI.
//   outputType, // Is the output type of the resized new image.
//   minWidth, // Is the minWidth of the resized new image.
//   minHeight // Is the minHeight of the resized new image.
// );

function IdentificationForm1({ setOpen }) {
  const [username, setUsername] = useState("");
  const [uploadedImg, setUploadedImg] = useState(null);
  const [errors, setErrors] = useState({});

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        100,
        100,
        "JPEG",
        20,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const [submitOtf] = useMutation(SUBMIT_OTF, {
    update(_, { data: { oneTimeForm: userData } }) {
      localStorage.setItem("userData", JSON.stringify(userData));
      setOpen(false);
      window.location.reload();
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    // variables: values,
    variables: {
      username,
      userProfileImg: uploadedImg,
    },
  });

  const onChangeFile = async (event) => {
    try {
      const file = event.target.files[0];
      const image = await resizeFile(file);
      setUploadedImg(image);
    } catch (err) {
      console.log("ERROR", err);
    }
  };

  document?.getElementById("filex")?.addEventListener("change", onChangeFile);
  return (
    <div className={style.box1}>
      <div className={style.boxA}>
        <label htmlFor="filex">
          <p>Select Avatar</p>
          <div className={style.imgBox}>
            <img
              src={uploadedImg ?? UploadDpIcon}
              alt="upload_profile_picture"
            />
          </div>
        </label>
        {/* <input type="file" id="file" style={{ display: "none" }} /> */}
        <input
          type="file"
          id="filex"
          onChange={onChangeFile}
          style={{ display: "none" }}
        />
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
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      {Object.keys(errors).length > 0 && (
        <div className={style.errors}>
          {Object.values(errors).map((value) => (
            <div key={value}>{value}</div>
          ))}
        </div>
      )}
      <div className={style.boxC}>
        <button
          onClick={(e) => {
            username?.length > 0 && submitOtf(e);
          }}
          className={
            username?.length > 0 ? style.buttonEnabled : style.buttonDisabled
          }
        >
          Save
        </button>
      </div>
    </div>
  );
}
const SUBMIT_OTF = gql`
  mutation oneTimeForm($username: String!, $userProfileImg: String) {
    oneTimeForm(username: $username, userProfileImg: $userProfileImg) {
      id
      email
      username
      userProfileImg
    }
  }
`;
export default IdentificationForm1;
