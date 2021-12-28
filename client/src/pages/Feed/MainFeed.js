import { Box, CircularProgress, Tooltip } from "@material-ui/core";
import React from "react";
import ListedItem from "./ListedItem";
import style from "./mainfeed.module.scss";

function MainFeed({
  loading,
  sortOrder,
  setSortOrder,
  sortedProjectList,
  getLystedDaos,
  setPage,
  setLimit,
}) {
  const handlePreferenceClick = (pref) => {
    setSortOrder(pref);
    localStorage.setItem("sortOrder", pref);
    setPage(0);
    setLimit(10);
    getLystedDaos();
  };

  // const handleScroll = (e) => {
  //   if (
  //     e.target.scrollHeight - e.target.scrollTop - 10 <=
  //     e.target.clientHeight
  //   ) {
  //     // console.log("bottomx");
  //     // setLimit((limit) => limit + 10);
  //     // getLystedDaos();
  //   }
  // };

  return (
    <div className={style.box1} id="test">
      <div className={style.feedRail}>
        <div className={style.feedinfobox}>
          <div>
            <p>
              Most upLysted ones here <span role="img">👇</span>
            </p>
          </div>
          <div>
            <Tooltip title="lyst by new" placement="top">
              <button
                style={{
                  backgroundColor: sortOrder === "BY_NEW" ? "#dedede" : "",
                }}
                onClick={() => {
                  handlePreferenceClick("BY_NEW");
                }}
              >
                🆕
              </button>
            </Tooltip>
            <Tooltip title="lyst by uplysts" placement="top">
              <button
                style={{
                  backgroundColor: sortOrder === "BY_UPLYST" ? "#dedede" : "",
                }}
                onClick={() => {
                  handlePreferenceClick("BY_UPLYST");
                }}
              >
                By ⚡
              </button>
            </Tooltip>
            <Tooltip title="lyst by views" placement="top">
              <button
                style={{
                  backgroundColor: sortOrder === "BY_VIEWS" ? "#dedede" : "",
                }}
                onClick={() => {
                  handlePreferenceClick("BY_VIEWS");
                }}
              >
                By 👀
              </button>
            </Tooltip>
          </div>
        </div>
        <div className={style.lystbox}>
          {sortedProjectList?.length === 0 && loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="90vh"
            >
              <CircularProgress
                style={{
                  color: "gray",
                }}
              />
            </Box>
          ) : (
            sortedProjectList?.map((item, index) => (
              <div key={index}>
                <ListedItem item={item} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MainFeed;
