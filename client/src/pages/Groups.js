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
  }, []);

  const [fetchGroups, { data }] = useLazyQuery(FETCH_GROUPS_QUERY, {
    variables: {
      uid,
    },
    fetchPolicy: "network-only",
  });

  let groupsMarkUp;
  if (!data) {
    groupsMarkUp = <p>Loading groups</p>;
  } else if (data.getGroups.length === 0) {
    groupsMarkUp = <p>No groups yet</p>;
  } else {
    groupsMarkUp = data.getGroups.map((x, index) => (
      <div style={{ margin: "3px" }} key={index}>
        {/* `/groups/${x.id}` */}
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

export default Groups;
