import React from "react";
import style from "./showProject.module.scss";
function ShowProject({
  createdAt,
  projectDescription,
  projectIcon,
  projectImages,
  projectName,
  projectTag,
  projectVideoLink,
}) {
  return (
    <div className={style.box1}>
      <div className={style.box1A}>
        <div className={style.box1A1}>
          <div className={style.projIcon}>
            <img src={projectIcon} alt="icon" />
          </div>
          <div className={style.projInfo}>
            <p>{projectName}</p>
            <p>{projectTag}</p>
          </div>
        </div>
        <div className={style.box1A2}>
          <button>upLyst this DAO</button>
        </div>
      </div>
      <div className={style.box1B}>B</div>
      <div className={style.box1C}>C</div>
    </div>
  );
}

export default ShowProject;
