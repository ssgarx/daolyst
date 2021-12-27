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
  const classes = useStyles();
  const [openSVP, setOpenSVP] = useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const projElementRef = React.useRef(null);
  const [fetchedProject, setFetchedProject] = useState(null);
  const [currentUplyst, setCurrentUplyst] = useState([]);
  const [currentView, setCurrentView] = useState([]);

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
      let tmp = data.getUserByProjectId;
      tmp.listedProjects = tmp.listedProjects.filter(
        (project) => project._id === id
      );
      setCurrentUplyst([...tmp.listedProjects[0].uplysts]);
      setCurrentView(tmp.listedProjects[0].views);
      setFetchedProject(tmp);
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
            {loading ? (
              <CircularProgress
                style={{
                  color: "gray",
                }}
              />
            ) : (
              fetchedProject?.listedProjects?.map((project) => (
                <ShowProject
                  _id={project._id}
                  createdAt={project.createdAt}
                  projectDescription={project.projectDescription}
                  projectIcon={project.projectIcon}
                  projectImages={project.projectImages}
                  projectName={project.projectName}
                  projectTag={project.projectTag}
                  projectVideoLink={project.projectVideoLink}
                  mainItem={fetchedProject}
                  setOpenProject={project.setOpenProject}
                  uplysts={project.uplysts}
                  currentUplyst={currentUplyst}
                  setCurrentUplyst={setCurrentUplyst}
                  currentView={currentView}
                  setCurrentView={setCurrentView}
                  origin="SPV"
                />
              ))
            )}
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
      email
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
