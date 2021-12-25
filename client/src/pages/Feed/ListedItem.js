/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import style from "./listedItem.module.scss";

import {
  Dialog,
  DialogContent,
  DialogContentText,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import ShowProject from "./ShowProject";
const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    borderRadius: 0,
    backgroundColor: "#fffbfb !important",
  },
}));

function ListedItem({ mainItem, item }) {
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
  const classes = useStyles();
  const theme = useTheme();
  const [openProject, setOpenProject] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const projElementRef = React.useRef(null);

  const [currentUplyst, setCurrentUplyst] = useState([]);
  const [currentView, setCurrentView] = useState([]);

  useEffect(() => {
    setCurrentUplyst([...uplysts]);
    setCurrentView(views);
  }, []);

  return (
    <>
      <div onClick={() => setOpenProject(true)} className={style.box1}>
        <div className={style.box1A}>
          <div className={style.box1A1}>
            <div className={style.iconBox}>
              <img src={projectIcon} alt="product_img" />
            </div>
          </div>
          <div className={style.box1A2}>
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
                  fontSize: "12px",
                  // filter: "invert(50%)",
                }}
              >
                {/* <img
                  style={{
                    width: "12px",
                  }}
                  src={ViewIcon}
                  alt=""
                /> */}
                👀
                <span
                  style={{
                    marginLeft: "2px",
                    marginTop: "3px",
                    filter: "invert(50%)",
                  }}
                >
                  {currentView ?? 0}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className={style.box1B}>
          <div>
            <button>
              <div>
                <div>
                  <span
                    style={{
                      marginBottom: "3px",
                    }}
                  >
                    ⚡
                  </span>
                </div>
                <div>{currentUplyst.length}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={openProject}
        onClose={() => setOpenProject(false)}
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
              currentView={currentView}
              setCurrentView={setCurrentView}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ListedItem;
