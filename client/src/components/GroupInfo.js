import { gql, useLazyQuery } from "@apollo/client";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth";

function GroupInfo({ groupId, groupOwnerId }) {
  const { user } = useContext(AuthContext);

  //SHOW GROUP NAME /GET GROUP INFO
  useEffect(() => {
    fetchGroupOwnerInfo();
    fetchGroupInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [fetchGroupInfo, groupInfo] = useLazyQuery(FETCH_GROUPINFO_QUERY, {
    variables: {
      groupId,
    },
    fetchPolicy: "network-only",
  });

  //SHOW GROUP USER NAME /GET GROUP OWNER INFO
  const [fetchGroupOwnerInfo, groupOwnerInfo] = useLazyQuery(
    FETCH_GROUPOWNERINFO_QUERY,
    {
      variables: {
        groupOwnerId,
      },
      fetchPolicy: "network-only",
    }
  );
  console.log("groupOwnerInfo", groupOwnerInfo);

  let groupData;
  if (!groupInfo.data) {
    groupData = (
      <div>
        <h1>Loading group data...</h1>
      </div>
    );
  } else {
    groupData = (
      <div>
        <h1>{groupInfo.data.getGroupInfo.groupName}</h1>
        <p>@{groupInfo.data.getGroupInfo.groupUserName}</p>
      </div>
    );
  }

  let groupOwnerData;
  if (!groupOwnerInfo.data) {
    groupOwnerData = (
      <div>
        <h1>Loading group data...</h1>
      </div>
    );
  } else {
    groupOwnerData = (
      <div>
        <p>Created by: @{groupOwnerInfo.data.getOwnerInfo.username}</p>

        {groupOwnerInfo.data.getOwnerInfo.email !== user.email ? (
          <button>Follow</button>
        ) : null}
      </div>
    );
  }

  //SHOW OWNER NAME
  return (
    <>
      <div>{groupData}</div>
      <div>{groupOwnerData}</div>
    </>
  );
}

const FETCH_GROUPINFO_QUERY = gql`
  query getGroupInfo($groupId: String!) {
    getGroupInfo(groupId: $groupId) {
      id
      groupId
      groupName
      groupUserName
      isPrivate
      createdAt
      groupFollowers {
        username
      }
    }
  }
`;
const FETCH_GROUPOWNERINFO_QUERY = gql`
  query getOwnerInfo($groupOwnerId: String!) {
    getOwnerInfo(groupOwnerId: $groupOwnerId) {
      id
      createdAt
      username
      userusername
      email
    }
  }
`;

export default GroupInfo;
