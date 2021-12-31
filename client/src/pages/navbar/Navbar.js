import React, { useEffect, useState } from "react";
import style from "./navbar.module.scss";
import logo from "../../assets/mainLogo.svg";
import searchIcon from "../../assets/searchIcon.svg";
import crossIcon from "../../assets/crossIcon.svg";
import ArrowDownIcon from "../../assets/arrowDownIcon.svg";
import { makeStyles, Popover } from "@material-ui/core";
import ProfileDropdown from "../../components/ProfileDropdown";
import DefaultDp from "../../assets/defaultDp.svg";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    borderRadius: 0,
    backgroundColor: "#ffffff !important",
  },
}));

function Navbar({ setOpen, user, setOpenLyst, handleDashboardOpen }) {
  const classes = useStyles();
  const [localUser, setLocalUser] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.userProfileImg && userData?.username) {
      setLocalUser(userData);
    }
  }, []);
  // FOR POPOVER
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <div className={style.box}>
        <div className={style.box1}>
          <div className={style.box1A}>
            <img src={logo} alt="logo" />
          </div>
          <div className={style.box1B}>
            <div
              style={{
                display: "none",
              }}
            >
              <div>
                <img src={searchIcon} alt="search" />
              </div>
              <div>
                <input type="text" placeholder="Search" />
              </div>
              <div>
                <img src={crossIcon} alt="search" />
              </div>
            </div>
            <div
              style={
                window.location.pathname === "/"
                  ? { fontWeight: "bold" }
                  : { fontWeight: "normal" }
              }
            >
              DAO's
            </div>
            <div
              onClick={() => {
                window.open("https://discord.gg/nnvUxpbF", "_blank");
              }}
            >
              community
            </div>
            <div
              onClick={() => {
                window.open("https://bip.so/@dao57za/-fzSph", "_blank");
              }}
            >
              about
            </div>
            <div
              onClick={() => {
                user ? setOpenLyst(true) : setOpen(true);
              }}
            >
              lyst my DAO⚡
            </div>
            {!user ? (
              <div
                onClick={() => {
                  setOpen(true);
                }}
              >
                log in
              </div>
            ) : (
              <div
                className={style.signedIn}
                aria-describedby={id}
                variant="contained"
                onClick={handleClick}
              >
                <div className={style.signedInA}>
                  <div className={style.imgbox}>
                    <img
                      src={
                        user?.userProfileImg?.length > 0
                          ? user.userProfileImg
                          : localUser?.userProfileImg
                          ? localUser.userProfileImg
                          : DefaultDp
                      }
                      alt="dp"
                    />
                  </div>
                </div>
                <div className={style.signedInB}>
                  <div>
                    <p>
                      {user?.username?.length > 0
                        ? user.username
                        : localUser.username}
                    </p>
                  </div>
                  <div>
                    <img src={ArrowDownIcon} alt="." />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        classes={{ paper: classes.dialogPaper }}
      >
        <ProfileDropdown handleDashboardOpen={handleDashboardOpen} />
      </Popover>
    </>
  );
}

export default Navbar;
