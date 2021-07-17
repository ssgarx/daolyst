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
  console.log("data", data);

  let getPostsMarkup;
  if (!data) {
    getPostsMarkup = <p>Loading groups</p>;
  } else {
    getPostsMarkup = data.getGroups.map((x, index) => (
      <div style={{ margin: "3px" }} key={index}>
        <Link to={`/groups/${x.id}`}>
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
      <div>{getPostsMarkup}</div>
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
      groupName
      groupUserName
      isPrivate
      createdAt
      groupFollowers {
        id
        username
        userusername
        createdAt
      }
    }
  }
`;

export default Groups;
