import { Box, CircularProgress } from "@material-ui/core";
import React from "react";
import ListedItem from "./ListedItem";
import style from "./mainfeed.module.scss";

function MainFeed({ loading, data }) {
  console.log("dataxx", data);
  console.log("loadingxx", loading);
  return (
    <div className={style.box1}>
      <div className={style.feedRail}>
        <div className={style.feedinfobox}>
          <div>
            <p>
              Most upLysted ones here <span role="img">👇</span>
            </p>
          </div>
          <div>
            <button>By Uplysts</button>
            <button>By Newest</button>
            <button>By Vibe</button>
          </div>
        </div>
        <div className={style.lystbox}>
          {loading ? (
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
            data?.getLystedDaos?.map((item, index) =>
              item?.listedProjects?.map((item, index) => (
                <div key={index}>
                  <ListedItem item={item} />
                </div>
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default MainFeed;
