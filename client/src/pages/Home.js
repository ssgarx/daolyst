import React, { useContext, useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import Navbar from "./navbar/Navbar";
import MobileNavbar from "./navbar/MobileNavbar";
import { AuthContext } from "../context/auth";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
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
      {/* FOR LOGIN POPUPS */}
      {/* <Dialog
        classes={{ paper: classes.dialogPaper }}
        fullScreen={fullScreen}
        open={openLyst}
        // onClose={handleClose}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            setOpenLyst(false);
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
          {!user ? <Login setOpen={setOpen} /> : <LystingForm1 />}
        </Box>
      </Dialog> */}
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
            <LystingForm1 />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button>Cancel</Button>
          <Button>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Home;
