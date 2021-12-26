import { useLazyQuery } from "@apollo/client";
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import gql from "graphql-tag";
import React, { useEffect, useState } from "react";
import ShowProject from "../pages/Feed/ShowProject";
const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    borderRadius: 0,
    backgroundColor: "#fffbfb !important",
  },
}));
function SingleProjectView(props) {
  const id = props?.match?.params?.id;
  console.log("id", id);
  const classes = useStyles();
  const [openSVP, setOpenSVP] = useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const projElementRef = React.useRef(null);

  const handleSVPOpen = () => {
    setOpenSVP(true);
  };
  const handleSVPClose = () => {
    setOpenSVP(false);
    //redirect to home page
    window.location.href = "/";
  };

  useEffect(() => {
    fetchUserByPID();
  }, []);

  const [fetchUserByPID, { loading, data }] = useLazyQuery(GET_USER_BY_PID, {
    onCompleted: () => {
      console.log("fetchUserByPID data:", data.getUserByProjectId);
    },
    variables: {
      projectId: id,
    },
    fetchPolicy: "no-cache",
  });

  return (
    <>
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={openSVP}
        onClose={handleSVPClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullScreen={fullScreen}
        maxWidth={"md"}
      >
        <DialogContent>
          <DialogContentText
            id="scroll-dialog-description"
            ref={projElementRef}
            tabIndex={-1}
          >
            <CircularProgress />
            {/* <ShowProject
              _id={_id}
              createdAt={createdAt}
              projectDescription={projectDescription}
              projectIcon={projectIcon}
              projectImages={projectImages}
              projectName={projectName}
              projectTag={projectTag}
              projectVideoLink={projectVideoLink}
              mainItem={mainItem}
              setOpenProject={setOpenProject}
              uplysts={uplysts}
              currentUplyst={currentUplyst}
              setCurrentUplyst={setCurrentUplyst}
              currentView={currentView}
              setCurrentView={setCurrentView}
            /> */}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}

const GET_USER_BY_PID = gql`
  query getUserByProjectId($projectId: String!) {
    getUserByProjectId(projectId: $projectId) {
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

export default SingleProjectView;
