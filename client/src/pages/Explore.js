import { gql, useLazyQuery } from "@apollo/client";
import { LinearProgress, makeStyles } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { Card, Form } from "semantic-ui-react";
import { AuthContext } from "../context/auth";
import { GroupSelectorContext } from "../context/groupSelector";
import style from "./explore.module.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiLinearProgress-barColorPrimary": {
      backgroundColor: "#FF4B33",
    },
    "& .MuiLinearProgress-colorPrimary": {
      backgroundColor: "red",
    },
  },
}));

let searchTimer;
function Explore() {
  const classes = useStyles();
  const { user } = useContext(AuthContext);
  const [searchedText, setSearchedText] = useState("");
  const groupSelContext = useContext(GroupSelectorContext);
  const [submitSearchedText, { data, loading }] = useLazyQuery(
    FETCH_SEARCH_RESULT,
    {
      variables: {
        searchedText,
        uid: user.id,
      },
    }
  );

  const handleSearch = async (e) => {
    setSearchedText(e.target.value);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      console.log("SEARCHING");
      submitSearchedText();
    }, 2000);
  };

  let groupsMarkUp;
  if (!data) {
    groupsMarkUp = loading && <p>Loading groupsX</p>;
  } else if (data.searchGroups.length === 0) {
    groupsMarkUp = <p>No groups found</p>;
  } else {
    groupsMarkUp = data.searchGroups.map((x, index) => (
      <div style={{ margin: "3px", border: "1pz solid black" }} key={index}>
        <span
          style={{
            border: "1px solid black",
            cursor: "pointer",
          }}
          onClick={() => {
            groupSelContext.createGroupSelection(x.id, x.groupId);
          }}
        >
          {x.groupName}
        </span>
      </div>
    ));
  }
  return (
    <>
      <div>
        <div className={style.exp_srch_pt}>
          <div className={style.fake_searchbox}>
            <span>
              <i
                style={
                  searchedText
                    ? {
                        paddingLeft: 6,
                        color: "#FF4B33",
                        transition: "0.3s all",
                      }
                    : { paddingLeft: 6, transition: "0.3s all" }
                }
                className="fas fa-search fa-lg"
              ></i>
            </span>
            <input
              className={style.explore_input}
              type="text"
              placeholder="Type group username here"
              value={searchedText}
              onChange={(e) => handleSearch(e)}
            />
            {searchedText && (
              <span>
                <i
                  onClick={() => setSearchedText("")}
                  style={{ cursor: "pointer", color: "#FF4B33" }}
                  class="fas fa-times fa-lg"
                ></i>
              </span>
            )}
            <div
              className={
                searchedText ? style.search_visible : style.search_invisible
              }
            >
              {loading && (
                <div style={{ position: "relative", top: "-10px" }}>
                  <LinearProgress className={classes.root} />
                </div>
              )}
              {groupsMarkUp}
            </div>
          </div>
        </div>
      </div>
      {/* <div>{groupsMarkUp}</div> */}
    </>
  );
}

const FETCH_SEARCH_RESULT = gql`
  query searchGroups($searchedText: String!, $uid: ID!) {
    searchGroups(searchedText: $searchedText, uid: $uid) {
      id
      groupId
      groupName
      groupUserName
      isPrivate
      createdAt
      groupFollowers {
        followersId
        createdAt
      }
    }
  }
`;

export default Explore;
