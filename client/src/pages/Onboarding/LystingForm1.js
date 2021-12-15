import React, { useEffect } from "react";
import style from "./lystingForm1.module.scss";
import PlusIcon from "../../assets/daoIcon.svg";
import EditIcon from "../../assets/editIcon.svg";
import UploadImg1 from "../../assets/upl1.svg";
import UploadImg2 from "../../assets/upl2.svg";
import UploadImg3 from "../../assets/upl3.svg";
import UploadImg4 from "../../assets/upl4.svg";
import UploadImg5 from "../../assets/upl5.svg";
import UploadImg6 from "../../assets/upl6.svg";
import YtIcon from "../../assets/ytIcon.svg";
import { useState } from "react";
import Resizer from "react-image-file-resizer";

function LystingForm1({
  user,
  daoIconImg,
  setDaoIconImg,
  daoName,
  setDaoName,
  daoTagLine,
  setDaoTagLine,
  expImg1,
  setExpImg1,
  expImg2,
  setExpImg2,
  expImg3,
  setExpImg3,
  expImg4,
  setExpImg4,
  expImg5,
  setExpImg5,
  expImg6,
  setExpImg6,
  videoLink,
  setVideoLink,
  daoDescription,
  setDaoDescription,
}) {
  console.log("LystingForm1 user", user);
  const [localUser, setLocalUser] = useState({});

  // const [daoIconImg, setDaoIconImg] = useState(null);
  // const [daoName, setDaoName] = useState("");
  // const [daoTagLine, setDaoTagLine] = useState("");
  // const [expImg1, setExpImg1] = useState(null);
  // const [expImg2, setExpImg2] = useState(null);
  // const [expImg3, setExpImg3] = useState(null);
  // const [expImg4, setExpImg4] = useState(null);
  // const [expImg5, setExpImg5] = useState(null);
  // const [expImg6, setExpImg6] = useState(null);
  // const [videoLink, setVideoLink] = useState("");
  // const [daoDescription, setDaoDescription] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.userProfileImg && userData?.username) {
      setLocalUser(userData);
    }
  }, []);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        100,
        100,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });

  const onChangeFile = async (event, location) => {
    try {
      const file = event.target.files[0];
      const image = await resizeFile(file);
      if (location === "DAO_ICON") {
        setDaoIconImg(image);
      } else if (location === "EXP_IMG1") {
        setExpImg1(image);
      } else if (location === "EXP_IMG2") {
        setExpImg2(image);
      } else if (location === "EXP_IMG3") {
        setExpImg3(image);
      } else if (location === "EXP_IMG4") {
        setExpImg4(image);
      } else if (location === "EXP_IMG5") {
        setExpImg5(image);
      } else if (location === "EXP_IMG6") {
        setExpImg6(image);
      }
    } catch (err) {
      console.log(err);
    }
  };

  document
    ?.getElementById("DAO_ICON")
    ?.addEventListener("change", onChangeFile);
  document
    ?.getElementById("EXP_IMG1")
    ?.addEventListener("change", onChangeFile);
  document
    ?.getElementById("EXP_IMG2")
    ?.addEventListener("change", onChangeFile);
  document
    ?.getElementById("EXP_IMG3")
    ?.addEventListener("change", onChangeFile);
  document
    ?.getElementById("EXP_IMG4")
    ?.addEventListener("change", onChangeFile);
  document
    ?.getElementById("EXP_IMG5")
    ?.addEventListener("change", onChangeFile);
  document
    ?.getElementById("EXP_IMG6")
    ?.addEventListener("change", onChangeFile);

  return (
    <div className={style.box1}>
      <div className={style.box1A}>
        <div className={style.box1A1}>
          <div className={style.box1A1A}>
            <img className={style.editIcon} src={EditIcon} alt="add_icon" />
            <div
              style={
                daoIconImg
                  ? {}
                  : {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }
              }
              className={style.logoBox}
            >
              <label htmlFor="DAO_ICON">
                <img
                  style={
                    daoIconImg
                      ? {
                          opacity: "1",
                          width: "99%",
                          objectFit: "cover",
                          height: "100%",
                        }
                      : {
                          opacity: 0.02,
                        }
                  }
                  src={daoIconImg ?? PlusIcon}
                  alt="add_icon"
                />
              </label>
              <input
                type="file"
                id="DAO_ICON"
                onChange={(e) => onChangeFile(e, "DAO_ICON")}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <div className={style.box1A1B}>
            <div className={style.box1A1B1}>
              <img
                className={style.editIconForName}
                src={EditIcon}
                alt="add_icon"
              />
              <input
                type="text"
                placeholder="DAO name"
                onChange={(e) => setDaoName(e.target.value)}
                className={style.editName}
                value={daoName}
              />
            </div>
            <div className={style.box1A1B2}>
              <img
                className={style.editIconForTag}
                src={EditIcon}
                alt="add_icon"
              />
              <input
                type="text"
                placeholder="Describe your DAO in short"
                className={style.editTag}
                onChange={(e) => setDaoTagLine(e.target.value)}
                value={daoTagLine}
              />
            </div>
          </div>
        </div>
        <div className={style.box1A2}>
          <button>upLyst this DAO</button>
        </div>
      </div>
      <div className={style.box1B}>
        <div className={style.box1Bx}>
          <div className={style.box1B1}>
            <div
              style={
                expImg1
                  ? {}
                  : {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }
              }
            >
              <img src={EditIcon} alt="add_icon" />
              <input
                type="file"
                id="EXP_IMG1"
                onChange={(e) => onChangeFile(e, "EXP_IMG1")}
                style={{ display: "none" }}
              />
              <label htmlFor="EXP_IMG1">
                <img
                  style={
                    expImg1
                      ? {
                          opacity: "1",
                          width: "99%",
                          objectFit: "cover",
                          height: "100%",
                        }
                      : {
                          opacity: 0.02,
                        }
                  }
                  src={expImg1 ?? UploadImg1}
                  alt=""
                />
              </label>
            </div>
            <div
              style={
                expImg2
                  ? {}
                  : {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }
              }
            >
              <img src={EditIcon} alt="add_icon" />
              <input
                type="file"
                id="EXP_IMG2"
                onChange={(e) => onChangeFile(e, "EXP_IMG2")}
                style={{ display: "none" }}
              />
              <label htmlFor="EXP_IMG2">
                <img
                  style={
                    expImg2
                      ? {
                          opacity: "1",
                          width: "99%",
                          objectFit: "cover",
                          height: "100%",
                        }
                      : {
                          opacity: 0.02,
                        }
                  }
                  src={expImg2 ?? UploadImg2}
                  alt=""
                />
              </label>
            </div>
            <div
              style={
                expImg3
                  ? {}
                  : {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }
              }
            >
              <img src={EditIcon} alt="add_icon" />
              <input
                type="file"
                id="EXP_IMG3"
                onChange={(e) => onChangeFile(e, "EXP_IMG3")}
                style={{ display: "none" }}
              />
              <label htmlFor="EXP_IMG3">
                <img
                  style={
                    expImg3
                      ? {
                          opacity: "1",
                          width: "99%",
                          objectFit: "cover",
                          height: "100%",
                        }
                      : {
                          opacity: 0.02,
                        }
                  }
                  src={expImg3 ?? UploadImg3}
                  alt=""
                />
              </label>
            </div>
            <div
              style={
                expImg4
                  ? {}
                  : {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }
              }
            >
              <img src={EditIcon} alt="add_icon" />
              <input
                type="file"
                id="EXP_IMG4"
                onChange={(e) => onChangeFile(e, "EXP_IMG4")}
                style={{ display: "none" }}
              />
              <label htmlFor="EXP_IMG4">
                <img
                  style={
                    expImg4
                      ? {
                          opacity: "1",
                          width: "99%",
                          objectFit: "cover",
                          height: "100%",
                        }
                      : {
                          opacity: 0.02,
                        }
                  }
                  src={expImg4 ?? UploadImg4}
                  alt=""
                />
              </label>
            </div>
            <div
              style={
                expImg5
                  ? {}
                  : {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }
              }
            >
              <img src={EditIcon} alt="add_icon" />
              <input
                type="file"
                id="EXP_IMG5"
                onChange={(e) => onChangeFile(e, "EXP_IMG5")}
                style={{ display: "none" }}
              />
              <label htmlFor="EXP_IMG5">
                <img
                  style={
                    expImg5
                      ? {
                          opacity: "1",
                          width: "99%",
                          objectFit: "cover",
                          height: "100%",
                        }
                      : {
                          opacity: 0.02,
                        }
                  }
                  src={expImg5 ?? UploadImg5}
                  alt=""
                />
              </label>
            </div>
            <div
              style={
                expImg6
                  ? {}
                  : {
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }
              }
            >
              <img src={EditIcon} alt="add_icon" />
              <input
                type="file"
                id="EXP_IMG6"
                onChange={(e) => onChangeFile(e, "EXP_IMG6")}
                style={{ display: "none" }}
              />
              <label htmlFor="EXP_IMG6">
                <img
                  style={
                    expImg6
                      ? {
                          opacity: "1",
                          width: "99%",
                          objectFit: "cover",
                          height: "100%",
                        }
                      : {
                          opacity: 0.02,
                        }
                  }
                  src={expImg6 ?? UploadImg6}
                  alt=""
                />
              </label>
            </div>
          </div>
          <div className={style.box1B2}>
            <div className={style.inputDiv}>
              <div>
                <img src={YtIcon} alt="" />
              </div>
              <div>
                <input
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="Paste youtube video link"
                  type="text"
                  value={videoLink}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={style.box1C}>
        <div>
          <p>few words from the makers</p>
        </div>
      </div>
      <div className={style.box1D}>
        <div>
          <div className={style.descBox}>
            <div>
              <div className={style.userProfileImg}>
                <img
                  style={{
                    borderRadius: "50%",
                    width: "50px",
                  }}
                  src={
                    user?.userProfileImg?.length > 0
                      ? user?.userProfileImg
                      : localUser?.userProfileImg
                  }
                  alt="dp"
                />
              </div>
            </div>
            <div>
              <p>{user?.username}</p>
              <p>Founding Member</p>
              <div>
                <textarea
                  onChange={(e) => setDaoDescription(e.target.value)}
                  placeholder="There are many variations of passages of Lorem Ipsum available, 
                                but the majority have suffered alteration in some form, by injected humour, or randomised words 
                                which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you 
                                need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators 
                                on https://kjdhkshds.com the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. 
                                It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.
                                The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
                  cols="30"
                  rows="10"
                  value={daoDescription}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LystingForm1;
