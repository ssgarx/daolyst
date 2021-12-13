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
function LystingForm1({ user }) {
  console.log("LystingForm1 user", user);
  const [localUser, setLocalUser] = useState({});
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.userProfileImg && userData?.username) {
      setLocalUser(userData);
    }
  }, []);
  return (
    <div className={style.box1}>
      <div className={style.box1A}>
        <div className={style.box1A1}>
          <div className={style.box1A1A}>
            <img className={style.editIcon} src={EditIcon} alt="add_icon" />
            <div className={style.logoBox}>
              <img src={PlusIcon} alt="add_icon" />
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
                className={style.editName}
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
            <div>
              <img src={EditIcon} alt="add_icon" />
              <img src={UploadImg1} alt="" />
            </div>
            <div>
              <img src={EditIcon} alt="add_icon" />
              <img src={UploadImg2} alt="" />
            </div>
            <div>
              <img src={EditIcon} alt="add_icon" />
              <img src={UploadImg3} alt="" />
            </div>
            <div>
              <img src={EditIcon} alt="add_icon" />
              <img src={UploadImg4} alt="" />
            </div>
            <div>
              <img src={EditIcon} alt="add_icon" />
              <img src={UploadImg5} alt="" />
            </div>
            <div>
              <img src={EditIcon} alt="add_icon" />
              <img src={UploadImg6} alt="" />
            </div>
          </div>
          <div className={style.box1B2}>
            <div className={style.inputDiv}>
              <div>
                <img src={YtIcon} alt="" />
              </div>
              <div>
                <input placeholder="Paste youtube video link" type="text" />
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
            <div>2</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LystingForm1;
