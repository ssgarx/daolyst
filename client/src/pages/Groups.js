/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { AuthContext } from "../context/auth";
import { useLazyQuery } from "@apollo/client";

function Groups(args = {}) {
  const { user } = useContext(AuthContext);
  const uid = user.id;

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

  let groupsMarkUp;
  if (!data) {
    groupsMarkUp = <p>Loading groups</p>;
  } else if (data.getGroups.length === 0) {
    groupsMarkUp = <p>No groups yet</p>;
  } else {
    groupsMarkUp = data.getGroups.map((x, index) => (
      <div style={{ margin: "3px" }} key={index}>
        <Link
          to={{
            pathname: `/groups/${x.id}`,
            state: x.groupId,
          }}
        >
          <span
            style={{
              border: "1px solid black",
              cursor: "pointer",
            }}
          >
            {x.groupName}
          </span>{" "}
          <br />
        </Link>
      </div>
    ));
  }

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
            <Link
              to={{
                pathname: `/groups/${x.id}`,
                state: x.groupId,
              }}
            >
              <span
                style={{
                  border: "1px solid black",
                  cursor: "pointer",
                }}
              >
                {x.groupName}
              </span>{" "}
              <br />
            </Link>
          </div>
        )
      );
  }
  return (
    <>
      <h1>Groups</h1>
      <Link to="/">
        <p>Home</p>
      </Link>
      <hr />
      <h4>Your Groups</h4>
      <div>{groupsMarkUp}</div>
      <hr />
      <h4>Groups you follow</h4>
      <div>{followingGroupMarkUp}</div>
      <div>
        <Link to="/creategroup">
          <button>CreateGroup</button>
        </Link>
      </div>
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
