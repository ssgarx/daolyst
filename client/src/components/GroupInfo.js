import { gql, useLazyQuery, useMutation } from "@apollo/client";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth";

function GroupInfo({ groupId, groupOwnerId }) {
  const { user } = useContext(AuthContext);

  //SHOW GROUP NAME /GET GROUP INFO
  useEffect(() => {
    fetchGroupOwnerInfo();
    fetchGroupInfo();
    fetchUserAdditionalInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [fetchGroupInfo, groupInfo] = useLazyQuery(FETCH_GROUPINFO_QUERY, {
    variables: {
      groupId,
    },
    fetchPolicy: "network-only",
  });

  const [groupConnection] = useMutation(GROUP_ACTION_MUTATION, {
    update() {},
    variables: {
      groupId,
      uid: user.id,
    },
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
  const [fetchUserAdditionalInfo, userAdditionalInfo] = useLazyQuery(
    FETCH_GROUPOWNERINFO_QUERY,
    {
      variables: {
        groupOwnerId: user.id,
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
        <p>{groupInfo.data.getGroupInfo.groupFollowers.length}followers</p>
      </div>
    );
  }

  // &&
  // userAdditionalInfo.data.getOwnerInfo.followingGroupsLists.some(
  //   (group) => group.id === groupInfo.data.getGroupInfo.id
  // )

  let groupOwnerData;
  if (!groupOwnerInfo.data || !userAdditionalInfo.data || !groupInfo.data) {
    groupOwnerData = (
      <div>
        <h1>Loading group data...</h1>
      </div>
    );
  } else {
    groupOwnerData = (
      <div>
        <p>Created by: @{groupOwnerInfo.data.getOwnerInfo.username}</p>
        {groupOwnerInfo.data.getOwnerInfo.email !== user.email &&
        !userAdditionalInfo.data.getOwnerInfo.followingGroupsLists.some(
          (group) => group.id === groupInfo.data.getGroupInfo.id
        ) ? (
          <button onClick={() => groupConnection()}>Follow</button>
        ) : groupOwnerInfo.data.getOwnerInfo.email === user.email ? null : (
          <button onClick={() => groupConnection()}>Unfollow</button>
        )}
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
        followersId
        createdAt
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
      followingGroupsLists {
        id
        groupId
        groupName
      }
    }
  }
`;

const GROUP_ACTION_MUTATION = gql`
  mutation followGroup($uid: String!, $groupId: String!) {
    followGroup(uid: $uid, groupId: $groupId) {
      id
      username
      followingGroupsLists {
        id
        createdAt
      }
    }
  }
`;

export default GroupInfo;
