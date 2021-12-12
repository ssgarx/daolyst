import React from "react";
import style from "./lystingForm1.module.scss";
import PlusIcon from "../../assets/daoIcon.svg";
import EditIcon from "../../assets/editIcon.svg";
import UploadImg1 from "../../assets/upl1.svg";
import UploadImg2 from "../../assets/upl2.svg";
import UploadImg3 from "../../assets/upl3.svg";
import UploadImg4 from "../../assets/upl4.svg";
import UploadImg5 from "../../assets/upl5.svg";
import UploadImg6 from "../../assets/upl6.svg";
function LystingForm1() {
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
        <div className={style.box1B1}>
          <div className={style.imgBox1}>
            <img src={UploadImg1} alt="" />
          </div>
          <div className={style.imgBox1}>
            <img src={UploadImg2} alt="" />
          </div>
          <div className={style.imgBox1}>
            <img src={UploadImg3} alt="" />
          </div>
        </div>
        <div className={style.box1B1}>
          <div className={style.imgBox1}>
            <img src={UploadImg4} alt="" />
          </div>
          <div className={style.imgBox1}>
            <img src={UploadImg5} alt="" />
          </div>
          <div className={style.imgBox1}>
            <img src={UploadImg6} alt="" />
          </div>
        </div>
      </div>
      {[...new Array(50)]
        .map(
          () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
        )
        .join("\n")}
    </div>
  );
}

export default LystingForm1;
