import React, { useContext, useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import Navbar from "./navbar/Navbar";
import MobileNavbar from "./navbar/MobileNavbar";
import { AuthContext } from "../context/auth";
import styles from "../../src/pages/Onboarding/lystingForm1.module.scss";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  makeStyles,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import Login from "./login/Login";
import IdentificationForm1 from "./Onboarding/IdentificationForm1";
import LystingForm1 from "./Onboarding/LystingForm1";
import gql from "graphql-tag";
import { useLazyQuery, useMutation } from "@apollo/client";
import MainFeed from "./Feed/MainFeed";
import Dashboard from "../components/Dashboard";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    borderRadius: 0,
    backgroundColor: "#FFFBFB",
  },
}));

function Home(props) {
  const { width, ref } = useResizeDetector();
  const classes = useStyles();
  const theme = useTheme();

  const [open, setOpen] = useState(false); //for login popup
  const [openLyst, setOpenLyst] = useState(false); //for lystMyDAO popup
  const [openDashboard, setOpenDashboard] = useState(false); //for dashboard popup

  const { user } = useContext(AuthContext);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const descriptionElementRef = React.useRef(null);

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
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    //check if form is valid
    if (
      daoIconImg &&
      daoName &&
      daoTagLine &&
      (expImg1 || expImg2 || expImg3 || expImg4 || expImg5 || expImg6) &&
      videoLink &&
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

  const [submitLyst] = useMutation(SUBMIT_LYST_FORM, {
    onCompleted: () => {
      handleLystFormClose();
      getLystedDaos();
    },
    onError(err) {
      console.log("ERROR", err);
    },
    variables: {
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

  const handleLystFormClose = () => {
    setOpenLyst(false);
    //clear all form fields
    setDaoIconImg(null);
    setDaoName("");
    setDaoTagLine("");
    setExpImg1("");
    setExpImg2("");
    setExpImg3("");
    setExpImg4("");
    setExpImg5("");
    setExpImg6("");
    setVideoLink("");
    setDaoDescription("");
  };
  const handleDashboardClose = () => {
    setOpenDashboard(false);
  };
  const handleDashboardOpen = () => {
    setOpenDashboard(true);
  };

  useEffect(() => {
    getLystedDaos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [getLystedDaos, { loading, data }] = useLazyQuery(GET_LYSTED_DAOS, {
    variables: {
      page: page,
      limit: limit,
    },
    fetchPolicy: "no-cache",
  });

  return (
    <div ref={ref}>
      <div>
        {width > 900 ? (
          <Navbar
            user={user}
            setOpen={setOpen}
            setOpenLyst={setOpenLyst}
            handleDashboardOpen={handleDashboardOpen}
          />
        ) : (
          <MobileNavbar
            user={user}
            setOpen={setOpen}
            setOpenLyst={setOpenLyst}
            handleDashboardOpen={handleDashboardOpen}
          />
        )}
        <MainFeed loading={loading} data={data} />
      </div>
      {/* FOR LOGIN POPUPS */}
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        fullScreen={fullScreen}
        open={open}
        // onClose={handleClose}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            setOpen(false);
          }
        }}
        aria-labelledby="responsive-dialog-title"
        disableEscapeKeyDown={true}
        // onBackdropClick="false"
      >
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={fullScreen && "95vh"}
        >
          {!user ? (
            <Login setOpen={setOpen} />
          ) : (
            <IdentificationForm1 setOpen={setOpen} />
          )}
        </Box>
      </Dialog>
      {/* FOR LYSTING */}
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={openLyst}
        onClose={handleLystFormClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullScreen={fullScreen}
        maxWidth={"lg"}
      >
        <DialogContent>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <LystingForm1
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
              handleLystFormClose={handleLystFormClose}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className={styles.publishBtn}>
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
                className={styles.lystBtn}
                onClick={() => {
                  if (isValidForSubmit) {
                    submitLyst();
                  }
                }}
              >
                Lyst this DAO ⚡
              </button>
            </Tooltip>
          </div>
        </DialogActions>
      </Dialog>
      {/* FOR DASHBOARD */}
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={openDashboard}
        onClose={handleDashboardClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullScreen={fullScreen}
        maxWidth={"lg"}
      >
        <DialogContent>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Dashboard
              setOpenDashboard={setOpenDashboard}
              setOpenLyst={setOpenLyst}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const SUBMIT_LYST_FORM = gql`
  mutation createProject(
    $projectIcon: String!
    $projectName: String!
    $projectTag: String!
    $projectDescription: String!
    $projectImages: [String!]
    $projectVideoLink: String!
  ) {
    createProject(
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

const GET_LYSTED_DAOS = gql`
  query getLystedDaos($page: Int!, $limit: Int!) {
    getLystedDaos(page: $page, limit: $limit) {
      email
      username
      userProfileImg
      createdAt
      listedProjects {
        _id
        projectName
        projectTag
        projectDescription
        projectIcon
        projectImages
        projectVideoLink
        createdAt
        uplysts {
          email
          username
          userProfileImg
        }
        views
      }
    }
  }
`;

export default Home;
