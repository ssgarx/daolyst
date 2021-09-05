/* eslint-disable jsx-a11y/anchor-is-valid */
// import React, { useContext } from "react";
// import { AuthContext } from "../context/auth";
import CentralPollingUnit from "./CentralPollingUnit";
import Groups from "../pages/Groups";
import Group from "../pages/Group";
import Explore from "../pages/Explore";
import { Container, Grid } from "@material-ui/core";
import style from "./loggedInScreen.module.scss";

function LoggedInScreen({ user }, args = {}) {
  return (
    <Container maxWidth="lg">
      <Grid container>
        <Grid item={true} md={3}>
          <div className={style.hm_master_blocks}>
            <Groups />
          </div>
        </Grid>
        <Grid item={true} md={6}>
          <div className={style.hm_master_blocks}>
            <Group />
          </div>
        </Grid>
        <Grid item={true} md={3}>
          <div className={style.hm_master_blocks}>
            <Explore />
          </div>
        </Grid>
      </Grid>
      <CentralPollingUnit />
    </Container>
  );
}

export default LoggedInScreen;
