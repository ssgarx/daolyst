import React from "react";
import style from "./mainfeed.module.scss";

function MainFeed() {
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
      </div>
    </div>
  );
}

export default MainFeed;
