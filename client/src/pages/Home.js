import React, { useContext, useEffect, useState } from "react";
import { useResizeDetector } from "react-resize-detector";
import Navbar from "./navbar/Navbar";
import MobileNavbar from "./navbar/MobileNavbar";
import { AuthContext } from "../context/auth";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import {
  Box,
  Dialog,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import Login from "./login/Login";
import IdentificationForm1 from "./Onboarding/IdentificationForm1";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    borderRadius: 0,
  },
}));

function Home(props) {
  const { width, ref } = useResizeDetector();
  const [open, setOpen] = useState(false);
  //IS TRUE ONLY WHEN USER HAS LOGGED VIA OTP BUT HAS A INCOMPLETE PROFILE
  const [isNewUser, setIsNewUser] = useState(true);
  console.log("isNewUser", isNewUser);
  const { user } = useContext(AuthContext);
  console.log("user", user);
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  let email = user?.email;
  const [openLyst, setOpenLyst] = useState(false);

  useEffect(() => {
    //this check decides if show OTF or main screen
    //if user exists, call checlIfNewUser and deleteOtps function
    if (user) {
      checkIfNewUser();
    }
  }, []);

  const [checkIfNewUser, { loading }] = useLazyQuery(CHECK_FOR_NEWUSER, {
    onCompleted: (data) => {
      if (data.checkIfNewUser) {
        //NEW USER DETECTED
        setIsNewUser(true);
      } else {
        //OLD USER DETECTED
        setIsNewUser(false);
      }
    },
    variables: {
      email,
    },
    fetchPolicy: "network-only",
  });

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
          {isNewUser && !user ? (
            <Login setOpen={setOpen} />
          ) : (
            <IdentificationForm1 setOpen={setOpen} />
          )}
        </Box>
      </Dialog>
    </div>
  );
}

const CHECK_FOR_NEWUSER = gql`
  query checkIfNewUser($email: String!) {
    checkIfNewUser(email: $email)
  }
`;

export default Home;
