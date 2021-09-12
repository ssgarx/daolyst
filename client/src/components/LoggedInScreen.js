/* eslint-disable jsx-a11y/anchor-is-valid */
// import React, { useContext } from "react";
// import { AuthContext } from "../context/auth";
import CentralPollingUnit from "./CentralPollingUnit";
import Groups from "../pages/Groups";
import Group from "../pages/Group";
import Explore from "../pages/Explore";
import {
  Container,
  Grid,
  Hidden,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import style from "./loggedInScreen.module.scss";
import { useWindowSize } from "../util/hooks";
function LoggedInScreen({ user }, args = {}) {
  const theme = useTheme();
  const isXsTriggered = useMediaQuery(theme.breakpoints.down("xs"));
  console.log("isXsTriggered", isXsTriggered);
  return (
    <Container maxWidth="lg">
      <Grid container>
        <Grid item={true} xs={12} sm={4} md={2}>
          <div className={style.hm_master_blocks}>
            <Groups />
          </div>
        </Grid>
        <Hidden xsDown>
          <Grid item={true} sm={8} md={7}>
            <div className={style.hm_master_blocks}>
              <Group />
            </div>
          </Grid>
        </Hidden>
        <Hidden smDown>
          <Grid item={true} md={3}>
            <div className={style.hm_master_blocks}>
              <Explore />
            </div>
          </Grid>
        </Hidden>
      </Grid>
      <CentralPollingUnit />
    </Container>
  );
}

export default LoggedInScreen;
