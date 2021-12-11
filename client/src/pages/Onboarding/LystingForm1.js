import React from "react";
import style from "./lystingForm1.module.scss";
import PlusIcon from "../../assets/plusIcon.svg";
import EditIcon from "../../assets/editIcon.svg";
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
