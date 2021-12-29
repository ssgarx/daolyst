import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  makeStyles,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import style from "./dashboardProjs.module.scss";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import EditProject from "./EditProject";
import { AuthContext } from "../context/auth";
const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    borderRadius: 0,
    backgroundColor: "#fffbfb !important",
  },
}));

function DashboardProjs({
  mainItem,
  fetchedProjects,
  setFetchedProjects,
  item,
}) {
  const classes = useStyles();
  const theme = useTheme();
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const projElementRef = React.useRef(null);

  const { user } = useContext(AuthContext);
  const [daoIconImg, setDaoIconImg] = useState(null);
  const [daoName, setDaoName] = useState("");
  const [daoTagLine, setDaoTagLine] = useState("");
  const [expImg1, setExpImg1] = useState("");
  const [expImg2, setExpImg2] = useState("");
  const [expImg3, setExpImg3] = useState("");
  const [expImg4, setExpImg4] = useState("");
  const [expImg5, setExpImg5] = useState("");
  const [expImg6, setExpImg6] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [daoDescription, setDaoDescription] = useState("");
  const [isValidForSubmit, setIsValidForSubmit] = useState(false);

  const {
    _id,
    createdAt,
    projectDescription,
    projectIcon,
    projectImages,
    projectName,
    projectTag,
    projectVideoLink,
    uplysts,
    views,
  } = item;

  const [deleteProject] = useMutation(DELETE_PROJECT, {
    onCompleted: (data) => {
      //remove project from state fetchedProjects
      const newFetchedProjects = fetchedProjects?.filter(
        (project) => project._id !== _id
      );
      setFetchedProjects(newFetchedProjects);
    },
    variables: {
      projectId: _id,
    },
  });

  useEffect(() => {
    //check if form is valid
    if (
      daoIconImg &&
      daoName &&
      daoTagLine &&
      (expImg1 || expImg2 || expImg3 || expImg4 || expImg5 || expImg6) &&
      daoDescription
    ) {
      setIsValidForSubmit(true);
    } else {
      setIsValidForSubmit(false);
    }
  }, [
    daoIconImg,
    daoName,
    daoTagLine,
    expImg1,
    expImg2,
    expImg3,
    expImg4,
    expImg5,
    expImg6,
    videoLink,
    daoDescription,
  ]);

  const handleEditFormClose = () => {
    setOpenEditPopup(false);
    //clear all form fields
    setDaoIconImg(null);
    setDaoName("");
    setDaoTagLine("");
    setExpImg1(null);
    setExpImg2(null);
    setExpImg3(null);
    setExpImg4(null);
    setExpImg5(null);
    setExpImg6(null);
    setVideoLink("");
    setDaoDescription("");
  };

  const [submiEditedtLyst, { loading }] = useMutation(SUBMIT_EDITED_FORM, {
    onCompleted: () => {
      //relaod page
      window.location.reload();
    },
    onError(err) {
      console.log("ERROR", err);
    },
    variables: {
      projectId: _id,
      projectIcon: daoIconImg,
      projectName: daoName,
      projectTag: daoTagLine,
      projectDescription: daoDescription,
      projectImages: [expImg1, expImg2, expImg3, expImg4, expImg5, expImg6],
      projectVideoLink: videoLink,
    },
    //clear network cache
    fetchPolicy: "no-cache",
  });

  return (
    <>
      <div className={style.box1}>
        <div className={style.box1A}>
          <div className={style.box1A1}>
            <img src={projectIcon} alt="product_img" />
          </div>
          <div className={style.box1A2}>
            <p>{projectName}</p>
            <p>{projectTag}</p>
          </div>
        </div>
        <div className={style.box1B}>
          <div>
            <Tooltip title="Views" placement="top" arrow>
              <button>
                {views ?? 0}
                <span
                  style={{
                    position: "relative",
                    top: "-1px",
                  }}
                >
                  👀
                </span>
              </button>
            </Tooltip>
            <Tooltip title="Uplysts" placement="top" arrow>
              <button>
                {uplysts?.length}
                <span>⚡</span>
              </button>
            </Tooltip>
            <Tooltip title="Edit" placement="top" arrow>
              <button
                onClick={() => {
                  setOpenEditPopup(true);
                }}
              >
                <span>✏️</span>
              </button>
            </Tooltip>
            <Tooltip title="Delete" placement="top" arrow>
              <button onClick={deleteProject}>
                <span>🗑️</span>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={openEditPopup}
        onClose={() => setOpenEditPopup(false)}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullScreen={fullScreen}
        maxWidth={"lg"}
      >
        <DialogContent style={{ padding: 0 }}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={projElementRef}
            tabIndex={-1}
          >
            <EditProject
              _id={_id}
              createdAt={createdAt}
              projectDescription={projectDescription}
              projectIcon={projectIcon}
              projectImages={projectImages}
              projectName={projectName}
              projectTag={projectTag}
              projectVideoLink={projectVideoLink}
              mainItem={mainItem}
              uplysts={uplysts}
              openEditPopup={openEditPopup}
              setOpenEditPopup={setOpenEditPopup}
              user={user}
              daoIconImg={daoIconImg}
              setDaoIconImg={setDaoIconImg}
              daoName={daoName}
              setDaoName={setDaoName}
              daoTagLine={daoTagLine}
              setDaoTagLine={setDaoTagLine}
              expImg1={expImg1}
              setExpImg1={setExpImg1}
              expImg2={expImg2}
              setExpImg2={setExpImg2}
              expImg3={expImg3}
              setExpImg3={setExpImg3}
              expImg4={expImg4}
              setExpImg4={setExpImg4}
              expImg5={expImg5}
              setExpImg5={setExpImg5}
              expImg6={expImg6}
              setExpImg6={setExpImg6}
              videoLink={videoLink}
              setVideoLink={setVideoLink}
              daoDescription={daoDescription}
              setDaoDescription={setDaoDescription}
              handleEditFormClose={handleEditFormClose}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className={style.publishBtn}>
            <Tooltip
              title={isValidForSubmit ? "" : "Enter required fields"}
              placement="top"
              enterDelay={500}
            >
              <button
                style={
                  isValidForSubmit
                    ? {
                        opacity: 1,
                      }
                    : {
                        opacity: 0.5,
                        cursor: "not-allowed",
                      }
                }
                className={style.lystBtn}
                onClick={() => {
                  if (isValidForSubmit) {
                    submiEditedtLyst();
                  }
                }}
              >
                {loading ? "Editing 🏗️✏️" : "Lyst edited DAO ⚡"}
              </button>
            </Tooltip>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}

const SUBMIT_EDITED_FORM = gql`
  mutation editProject(
    $projectId: String!
    $projectIcon: String!
    $projectName: String!
    $projectTag: String!
    $projectDescription: String!
    $projectImages: [String!]
    $projectVideoLink: String!
  ) {
    editProject(
      projectId: $projectId
      projectIcon: $projectIcon
      projectName: $projectName
      projectTag: $projectTag
      projectDescription: $projectDescription
      projectImages: $projectImages
      projectVideoLink: $projectVideoLink
    ) {
      id
      email
      username
      userProfileImg
      createdAt
    }
  }
`;

const DELETE_PROJECT = gql`
  mutation deleteProject($projectId: String!) {
    deleteProject(projectId: $projectId)
  }
`;

export default DashboardProjs;
