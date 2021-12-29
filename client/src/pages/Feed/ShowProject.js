import React, { useContext, useEffect } from "react";
import style from "./showProject.module.scss";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ReactPlayer from "react-player";
import parse from "html-react-parser";
import CrossIcon from "../../assets/crossIcon.svg";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { AuthContext } from "../../context/auth";
import CopyLinkIcon from "../../assets/copyLinkIcon.svg";
import TwitterIcon from "../../assets/twitterIcon.svg";

function ShowProject({
  _id,
  createdAt,
  projectDescription,
  projectIcon,
  projectImages,
  projectName,
  projectTag,
  projectVideoLink,
  setOpenProject,
  uplysts,
  currentUplyst,
  setCurrentUplyst,
  currentView,
  setCurrentView,
  origin,
  creatorEmail,
  creatorName,
  creatorProfileImg,
  creatorUsername,
  creatorId,
}) {
  console.log("creatorId", creatorId);
  const { user } = useContext(AuthContext);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  useEffect(() => {
    addView();
  }, []);

  const [addView] = useMutation(ADD_VIEW, {
    onCompleted: (data) => {
      //convert currentView from string to number and add 1 to it and then convert it back to string
      setCurrentView((currentView = Number(currentView) + 1).toString());
    },
    variables: {
      projectId: _id,
      creatorId: creatorId,
    },
  });
  const [uplystThisProject] = useMutation(SUBMIT_LYST_FORM, {
    onCompleted: (data) => {
      if (currentUplyst.find((uplyst) => uplyst.email === user.email)) {
        setCurrentUplyst(
          uplysts.filter((uplyst) => uplyst.email !== user.email)
        );
      } else {
        setCurrentUplyst([...currentUplyst, { email: user.email }]);
      }
    },
    variables: {
      upLysterEmail: user?.email,
      projectOwnerEmail: creatorEmail,
      projectId: _id,
    },
  });

  return (
    <div className={style.box1}>
      <span
        onClick={() => {
          if (origin === "SPV") {
            window.location.href = "/";
          } else {
            setOpenProject(false);
          }
        }}
        className={style.closeLystForm}
      >
        <img src={CrossIcon} alt="close" />
      </span>
      <div className={style.box1A}>
        <div className={style.box1A1}>
          <div>
            <div className={style.projIcon}>
              <img src={projectIcon} alt="icon" />
            </div>
          </div>
          <div className={style.projInfo}>
            <p>{projectName}</p>
            <p>{projectTag}</p>
            <div
              style={{
                display: "flex",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row",
                  fontSize: "15px",
                  color: "black",
                }}
              >
                👀
                <span
                  style={{
                    marginLeft: "2px",
                    marginTop: "3px",
                  }}
                >
                  {currentView ?? 0}
                </span>
              </span>
            </div>
            <div className={style.sharebar}>
              <div>
                <button
                  onClick={() => {
                    let link = `${window.location.href}${_id}/spv`;
                    navigator.clipboard.writeText(link);
                  }}
                  className={style.copyBtn}
                >
                  <span>
                    <img
                      style={{
                        width: "15px",
                        transform: "rotate(-45deg)",
                        position: "relative",
                        top: "3px",
                        marginRight: "3px",
                      }}
                      src={CopyLinkIcon}
                      alt=""
                    />
                    copy link
                  </span>
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    window.open(
                      `https://twitter.com/intent/tweet?text=${
                        projectName + ":" + projectTag
                      }&url=${window.location.href}${_id}/spv`
                    );
                  }}
                  className={style.copyBtn}
                >
                  <span>
                    <img
                      style={{
                        width: "15px",
                        position: "relative",
                        top: "3.5px",
                        // marginRight: "3px",
                      }}
                      src={TwitterIcon}
                      alt=""
                    />
                    {/* copy link */}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={style.box1A2}>
          <button
            onClick={() => {
              uplystThisProject();
            }}
          >
            <span>⚡</span> upLyst <span>{currentUplyst.length} </span>
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
                <img src={creatorProfileImg} alt="img" />
              </div>
            </div>
            <div className={style.box1D2}>
              <div className={style.creds}>
                <p>{creatorUsername}</p>
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

const ADD_VIEW = gql`
  mutation addViews($projectId: String!, $creatorId: String!) {
    addViews(projectId: $projectId, creatorId: $creatorId) {
      email
    }
  }
`;
const SUBMIT_LYST_FORM = gql`
  mutation upLystProject(
    $upLysterEmail: String!
    $projectOwnerEmail: String!
    $projectId: String!
  ) {
    upLystProject(
      upLysterEmail: $upLysterEmail
      projectOwnerEmail: $projectOwnerEmail
      projectId: $projectId
    )
  }
`;

export default ShowProject;
