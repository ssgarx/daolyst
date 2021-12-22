import React from "react";
import style from "./showProject.module.scss";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ReactPlayer from "react-player";
import parse from "html-react-parser";
import CrossIcon from "../../assets/crossIcon.svg";

function ShowProject({
  mainItem,
  createdAt,
  projectDescription,
  projectIcon,
  projectImages,
  projectName,
  projectTag,
  projectVideoLink,
  openProject,
  setOpenProject,
}) {
  console.log("projectDescription", projectDescription);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <div className={style.box1}>
      <span
        onClick={() => setOpenProject(false)}
        className={style.closeLystForm}
      >
        <img src={CrossIcon} alt="close" />
      </span>
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
          <button>
            <span>&#9650;</span> upLyst
          </button>
        </div>
      </div>
      <div className={style.box1B}>
        <div className={style.box1B1}>
          <Slider {...settings}>
            {projectVideoLink && (
              <div className={style.projImgBox}>
                <ReactPlayer
                  url={projectVideoLink}
                  width="100%"
                  height="100%"
                />
              </div>
            )}
            {projectImages?.map(
              (image, index) =>
                image && (
                  <div className={style.projImgBox} key={index}>
                    <img src={image} alt="project" />
                  </div>
                )
            )}
          </Slider>
        </div>
      </div>
      <div className={style.box1C}>
        <div className={style.box1CX}>
          <p>few words from the makers ✒️</p>
        </div>
      </div>
      <div className={style.box1D}>
        <div className={style.box1DX}>
          <div className={style.box1D1}>
            <div className={style.box1D1}>
              <div className={style.userProfile}>
                <img src={mainItem?.userProfileImg} alt="img" />
              </div>
            </div>
            <div className={style.box1D2}>
              <div className={style.creds}>
                <p>{mainItem?.username}</p>
                <p>Founding member</p>
              </div>
              <div className={style.desc}>{parse(projectDescription)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowProject;
