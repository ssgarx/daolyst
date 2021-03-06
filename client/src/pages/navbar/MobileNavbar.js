import React, { useState } from "react";
import style from "./mobileNavbar.module.scss";
import logo from "../../assets/mainLogo.svg";
import hamIcon from "../../assets/hamIcon.svg";
import hamIconRotated from "../../assets/hamIconRotated.svg";
import SidePanel from "./SidePanel";

function MobileNavbar({ setOpen, user, setOpenLyst, handleDashboardOpen }) {
  const [isHamOpen, setIsHamOpen] = useState(false);

  return (
    <>
      <div
        style={
          isHamOpen
            ? { backgroundColor: "#fffbfb" }
            : { backgroundColor: "white" }
        }
        className={style.box}
      >
        <div className={style.box1}>
          <div className={style.box1A}>
            <img src={logo} alt="logo" />
          </div>
          <div
            className={style.box1B}
            onClick={() => {
              setIsHamOpen(!isHamOpen);
            }}
          >
            {!isHamOpen ? (
              <img src={hamIcon} alt="hamIcon" />
            ) : (
              <img src={hamIconRotated} alt="hamIcon" />
            )}
          </div>
        </div>
      </div>
      <div
        style={{
          zIndex: 1,
          right: isHamOpen ? "0" : "-100%",
        }}
        className={style.notifPanel}
      >
        <SidePanel
          user={user}
          setOpen={setOpen}
          setOpenLyst={setOpenLyst}
          handleDashboardOpen={handleDashboardOpen}
        />
      </div>
    </>
  );
}

export default MobileNavbar;
