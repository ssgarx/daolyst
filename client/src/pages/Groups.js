/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import gql from "graphql-tag";
import { AuthContext } from "../context/auth";
import { useLazyQuery } from "@apollo/client";
import CentralPollingUnit from "../components/CentralPollingUnit";
import { GroupSelectorContext } from "../context/groupSelector";
import { NotifierContext } from "../context/notifier";
import Union from "../assets/Union.png";
import { CircularProgress } from "@material-ui/core";

function Groups(args = {}) {
  const { user } = useContext(AuthContext);
  const groupSelContext = useContext(GroupSelectorContext);
  const { notifArray } = useContext(NotifierContext);
  const { groupData } = useContext(GroupSelectorContext);
  const groupId = groupData.groupId;
  const uid = user.id;
  let history = useHistory();

  useEffect(() => {}, [notifArray]);

  useEffect(() => {
    if (user.id) {
      fetchGroups();
      fetchUserFollowedGroups();
    }
  }, []);

  const [fetchGroups, { data }] = useLazyQuery(FETCH_GROUPS_QUERY, {
    onCompleted: (data) => {
      console.log("data", data);
    },
    variables: {
      uid,
    },
    fetchPolicy: "network-only",
  });

  const [fetchUserFollowedGroups, userFollowedGroups] = useLazyQuery(
    FETCH_USERFOLLOWEDGROUPS_QUERY,
    {
      variables: {
        groupOwnerId: uid,
      },
      fetchPolicy: "network-only",
    }
  );

  // Your Groups
  let yourGroupsMarkup;
  if (!data) {
    yourGroupsMarkup = <CircularProgress style={{ color: "black" }} />;
  } else if (data.getGroups.length === 0) {
    yourGroupsMarkup = <p>No groups yet</p>;
  } else {
    yourGroupsMarkup = data.getGroups.map((x, index) => (
      <div
        className="home_gp"
        style={
          groupId && groupId === x.id ? { backgroundColor: "#fcf3f3" } : null
        }
        key={index}
        onClick={() => {
          groupSelContext.createGroupSelection(x.id, x.groupId);
        }}
      >
        <span className="home_gp_name">{x.groupName}</span>
        <br />
        <span className="home_gp_username">@{x.groupUserName}</span>
      </div>
    ));
  }

  // Groups you follow
  let followingGroupMarkUp;
  if (!userFollowedGroups.data) {
    followingGroupMarkUp = <p>Loading groups</p>;
  } else if (
    userFollowedGroups.data.getOwnerInfo.followingGroupsLists.length === 0
  ) {
    followingGroupMarkUp = <p>No groups yet</p>;
  } else {
    followingGroupMarkUp =
      userFollowedGroups.data.getOwnerInfo.followingGroupsLists.map(
        (x, index) => (
          <>
            <div
              className="home_gp"
              key={index}
              onClick={() => {
                groupSelContext.createGroupSelection(x.id, x.groupId);
              }}
            >
              <span className="home_gp_name">
                {x.groupName}
                {notifArray &&
                  !notifArray.includes(groupData?.groupId) &&
                  notifArray.includes(x.id) &&
                  "*"}
              </span>
              <br />
              <span className="home_gp_username">@{x.groupUserName}</span>
            </div>
          </>
        )
      );
  }
  return (
    <div style={{ height: "95vh" }}>
      <div style={{ display: "flex", padding: "7px 7px 7px 0" }}>
        <div>
          <img className="icon_home" src={Union} alt="" />
        </div>
        <div style={{ marginTop: 3, fontWeight: "500" }}>
          <span className="home_name">Some name</span>
          <span>
            <i className="fas fa-ellipsis-v fa-sm mnu"></i>
          </span>
          <br />
          <span className="home_username">@username</span>
        </div>
      </div>
      <div className="home_posts">{yourGroupsMarkup}</div>
      <div className="hm_create_div">
        <button
          className="hm_create_btn"
          onClick={() => history.push("/creategroup")}
        >
          +
        </button>
      </div>
      <CentralPollingUnit />
    </div>
  );
}

const FETCH_GROUPS_QUERY = gql`
  query getGroups($uid: String!) {
    getGroups(uid: $uid) {
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
const FETCH_USERFOLLOWEDGROUPS_QUERY = gql`
  query getOwnerInfo($groupOwnerId: ID!) {
    getOwnerInfo(groupOwnerId: $groupOwnerId) {
      id
      followingGroupsLists {
        id
        groupId
        groupName
      }
    }
  }
`;

export default Groups;
