/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import gql from "graphql-tag";
import { AuthContext } from "../context/auth";
import { useLazyQuery } from "@apollo/client";
import CentralPollingUnit from "../components/CentralPollingUnit";
import { GroupSelectorContext } from "../context/groupSelector";
import { NotifierContext } from "../context/notifier";

function Groups(args = {}) {
  const { user } = useContext(AuthContext);
  const groupSelContext = useContext(GroupSelectorContext);
  const { notifArray } = useContext(NotifierContext);
  const { groupData } = useContext(GroupSelectorContext);
  const uid = user.id;
  let history = useHistory();

  useEffect(() => {
    console.log("notifArray: ", notifArray);
  }, [notifArray]);

  useEffect(() => {
    fetchGroups();
    fetchUserFollowedGroups();
  }, []);

  const [fetchGroups, { data }] = useLazyQuery(FETCH_GROUPS_QUERY, {
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
  let groupsMarkUp;
  if (!data) {
    groupsMarkUp = <p>Loading groups</p>;
  } else if (data.getGroups.length === 0) {
    groupsMarkUp = <p>No groups yet</p>;
  } else {
    groupsMarkUp = data.getGroups.map((x, index) => (
      <div style={{ margin: "3px" }} key={index}>
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
        <br />
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
          <div style={{ margin: "3px" }} key={index}>
            <span
              style={{
                border: "1px solid black",
                cursor: "pointer",
              }}
              onClick={() => {
                groupSelContext.createGroupSelection(x.id, x.groupId);
              }}
            >
              <span>
                {x.groupName}{" "}
                {notifArray &&
                  !notifArray.includes(groupData?.groupId) &&
                  notifArray.includes(x.id) &&
                  "*"}
              </span>
            </span>{" "}
            <br />
          </div>
        )
      );
  }
  return (
    <>
      <h1>Groups</h1>
      <button onClick={() => history.push("/")}>Home</button>
      <hr />
      <h4>Your Groups</h4>
      <div>{groupsMarkUp}</div>
      <hr />
      <h4>Groups you follow</h4>
      <div>{followingGroupMarkUp}</div>
      <div>
        <button onClick={() => history.push("/creategroup")}>
          CreateGroup
        </button>
      </div>
      <CentralPollingUnit />
    </>
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
