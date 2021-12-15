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

  const { user } = useContext(AuthContext);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const descriptionElementRef = React.useRef(null);

  const [daoIconImg, setDaoIconImg] = useState(null);
  const [daoName, setDaoName] = useState("");
  const [daoTagLine, setDaoTagLine] = useState("");
  const [expImg1, setExpImg1] = useState(null);
  const [expImg2, setExpImg2] = useState(null);
  const [expImg3, setExpImg3] = useState(null);
  const [expImg4, setExpImg4] = useState(null);
  const [expImg5, setExpImg5] = useState(null);
  const [expImg6, setExpImg6] = useState(null);
  const [videoLink, setVideoLink] = useState("");
  const [daoDescription, setDaoDescription] = useState("");
  const [isValidForSubmit, setIsValidForSubmit] = useState(false);

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

  return (
    <div ref={ref}>
      <div>
        {width > 800 ? (
          <Navbar user={user} setOpen={setOpen} setOpenLyst={setOpenLyst} />
        ) : (
          <MobileNavbar
            user={user}
            setOpen={setOpen}
            setOpenLyst={setOpenLyst}
          />
        )}
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
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={openLyst}
        // onClose={handleClose}
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
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
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
            >
              Lyst this DAO ⚡
            </button>
          </Tooltip>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Home;
