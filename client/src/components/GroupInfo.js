import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";

function GroupInfo({ groupId, groupOwnerId }) {
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
    }
  }
`;

export default GroupInfo;
