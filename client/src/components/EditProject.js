import React, { useState, useContext } from "react";
import style from "./editProject.module.scss";
import CrossIcon from "../assets/crossIcon.svg";
import EditIcon from "../assets/editIcon.svg";
import YtIcon from "../assets/ytIcon.svg";
import DefaultDp from "../assets/defaultDp.svg";
import Resizer from "react-image-file-resizer";

import { useEffect } from "react";
import DescEditor from "./DescEditor";

function EditProject({
  _id,
  createdAt,
  projectDescription,
  projectIcon,
  projectImages,
  projectName,
  projectTag,
  projectVideoLink,
  mainItem,
  uplysts,
  openEditPopup,
  setOpenEditPopup,
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
  handleEditFormClose,
  setDaoDescription,
}) {
  useEffect(() => {
    setDaoIconImg(projectIcon);
    setDaoName(projectName);
    setDaoTagLine(projectTag);
    setExpImg1(projectImages[0]);
    setExpImg2(projectImages[1]);
    setExpImg3(projectImages[2]);
    setExpImg4(projectImages[3]);
    setExpImg5(projectImages[4]);
    setExpImg6(projectImages[5]);
    setVideoLink(projectVideoLink);
    setDaoDescription(projectDescription);
  }, []);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        500,
        500,
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
      <span onClick={handleEditFormClose} className={style.closeLystForm}>
        <img src={CrossIcon} alt="close" />
      </span>
      <div className={style.box1A}>
        <div className={style.box1A1}>
          <div className={style.box1A1A}>
            <img
              className={style.editIcon}
              alt="add_icon"
              src={daoIconImg ? CrossIcon : EditIcon}
              style={
                daoIconImg
                  ? {
                      cursor: "pointer",
                      opacity: "0.6",
                    }
                  : {
                      cursor: "default",
                    }
              }
              onClick={() => {
                if (daoIconImg) {
                  setDaoIconImg(null);
                }
              }}
            />
            <label htmlFor="DAO_ICON">
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
                  src={daoIconImg ?? ""}
                  alt="add_icon"
                />
              </div>
              <input
                type="file"
                id="DAO_ICON"
                onChange={(e) => onChangeFile(e, "DAO_ICON")}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <div className={style.box1A1B}>
            <div className={style.box1A1B1}>
              <img
                className={style.editIconForName}
                src={daoName ? CrossIcon : EditIcon}
                alt="add_icon"
                style={
                  daoName
                    ? {
                        cursor: "pointer",
                        opacity: "0.6",
                      }
                    : {
                        cursor: "default",
                      }
                }
                onClick={() => {
                  if (daoName) {
                    setDaoName("");
                  }
                }}
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
                src={daoTagLine ? CrossIcon : EditIcon}
                alt="add_icon"
                style={
                  daoTagLine
                    ? {
                        cursor: "pointer",
                        opacity: "0.6",
                      }
                    : {
                        cursor: "default",
                      }
                }
                onClick={() => {
                  if (daoTagLine) {
                    setDaoTagLine("");
                  }
                }}
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
            <label htmlFor="EXP_IMG1">
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
                <img
                  alt="add_icon"
                  src={expImg1 ? CrossIcon : EditIcon}
                  style={
                    expImg1
                      ? {
                          cursor: "pointer",
                          opacity: "0.6",
                        }
                      : {
                          cursor: "default",
                        }
                  }
                  onClick={() => {
                    if (expImg1) {
                      setExpImg1(null);
                    }
                  }}
                />
                <input
                  type="file"
                  id="EXP_IMG1"
                  onChange={(e) => onChangeFile(e, "EXP_IMG1")}
                  style={{ display: "none" }}
                />
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
                  src={expImg1 ?? ""}
                  alt=""
                />
              </div>
            </label>
            <label htmlFor="EXP_IMG2">
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
                <img
                  alt="add_icon"
                  src={expImg2 ? CrossIcon : EditIcon}
                  style={
                    expImg2
                      ? {
                          cursor: "pointer",
                          opacity: "0.6",
                        }
                      : {
                          cursor: "default",
                        }
                  }
                  onClick={() => {
                    if (expImg2) {
                      setExpImg2(null);
                    }
                  }}
                />
                <input
                  type="file"
                  id="EXP_IMG2"
                  onChange={(e) => onChangeFile(e, "EXP_IMG2")}
                  style={{ display: "none" }}
                />
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
                  src={expImg2 ?? ""}
                  alt=""
                />
              </div>
            </label>
            <label htmlFor="EXP_IMG3">
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
                <img
                  alt="add_icon"
                  src={expImg3 ? CrossIcon : EditIcon}
                  style={
                    expImg3
                      ? {
                          cursor: "pointer",
                          opacity: "0.6",
                        }
                      : {
                          cursor: "default",
                        }
                  }
                  onClick={() => {
                    if (expImg3) {
                      setExpImg3(null);
                    }
                  }}
                />
                <input
                  type="file"
                  id="EXP_IMG3"
                  onChange={(e) => onChangeFile(e, "EXP_IMG3")}
                  style={{ display: "none" }}
                />
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
                  src={expImg3 ?? ""}
                  alt=""
                />
              </div>
            </label>
            <label htmlFor="EXP_IMG4">
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
                <img
                  alt="add_icon"
                  src={expImg4 ? CrossIcon : EditIcon}
                  style={
                    expImg4
                      ? {
                          cursor: "pointer",
                          opacity: "0.6",
                        }
                      : {
                          cursor: "default",
                        }
                  }
                  onClick={() => {
                    if (expImg4) {
                      setExpImg4(null);
                    }
                  }}
                />
                <input
                  type="file"
                  id="EXP_IMG4"
                  onChange={(e) => onChangeFile(e, "EXP_IMG4")}
                  style={{ display: "none" }}
                />
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
                  src={expImg4 ?? ""}
                  alt=""
                />
              </div>
            </label>
            <label htmlFor="EXP_IMG5">
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
                <img
                  alt="add_icon"
                  src={expImg5 ? CrossIcon : EditIcon}
                  style={
                    expImg5
                      ? {
                          cursor: "pointer",
                          opacity: "0.6",
                        }
                      : {
                          cursor: "default",
                        }
                  }
                  onClick={() => {
                    if (expImg5) {
                      setExpImg5(null);
                    }
                  }}
                />
                <input
                  type="file"
                  id="EXP_IMG5"
                  onChange={(e) => onChangeFile(e, "EXP_IMG5")}
                  style={{ display: "none" }}
                />
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
                  src={expImg5 ?? ""}
                  alt=""
                />
              </div>
            </label>
            <label htmlFor="EXP_IMG6">
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
                <img
                  alt="add_icon"
                  src={expImg6 ? CrossIcon : EditIcon}
                  style={
                    expImg6
                      ? {
                          cursor: "pointer",
                          opacity: "0.6",
                        }
                      : {
                          cursor: "default",
                        }
                  }
                  onClick={() => {
                    if (expImg6) {
                      setExpImg6(null);
                    }
                  }}
                />
                <input
                  type="file"
                  id="EXP_IMG6"
                  onChange={(e) => onChangeFile(e, "EXP_IMG6")}
                  style={{ display: "none" }}
                />
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
                  src={expImg6 ?? ""}
                  alt=""
                />
              </div>
            </label>
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
                  // style={{
                  //   borderRadius: "50%",
                  //   width: "50px",
                  // }}
                  src={
                    user?.userProfileImg?.length > 0
                      ? user?.userProfileImg
                      : DefaultDp
                  }
                  alt="dp"
                />
              </div>
            </div>
            <div>
              <p>{user?.username}</p>
              <p>Founding Member</p>
              <div>
                <DescEditor
                  daoDescription={daoDescription}
                  setDaoDescription={setDaoDescription}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProject;
