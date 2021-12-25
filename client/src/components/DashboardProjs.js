import { makeStyles, Tooltip } from "@material-ui/core";
import React from "react";
import style from "./dashboardProjs.module.scss";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import DeleteIcon from "../assets/deleteIcon.svg";
import EditIcon from "../assets/editIcon.svg";

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
  } = item;

  const [deleteProject, { loading }] = useMutation(DELETE_PROJECT, {
    onCompleted: (data) => {
      console.log("data", data);
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

  return (
    <>
      <div
        onClick={() => {
          //   setOpenProject(true)
        }}
        className={style.box1}
      >
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
            <button>
              <span>&#9650;</span> {uplysts?.length}
            </button>
            <button>edit</button>
            <Tooltip title="Delete" placement="top">
              <button onClick={deleteProject}>delete</button>
            </Tooltip>
          </div>
        </div>
      </div>
      {/* <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={openProject}
        onClose={() => setOpenProject(false)}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullScreen={fullScreen}
        maxWidth={"lg"}
      >
        <DialogContent>
          <DialogContentText
            id="scroll-dialog-description"
            ref={projElementRef}
            tabIndex={-1}
          >
            <ShowProject
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
            />
          </DialogContentText>
        </DialogContent>
      </Dialog> */}
    </>
  );
}

const DELETE_PROJECT = gql`
  mutation deleteProject($projectId: String!) {
    deleteProject(projectId: $projectId)
  }
`;

export default DashboardProjs;
