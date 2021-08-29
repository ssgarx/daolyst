import { gql, useLazyQuery, useMutation } from "@apollo/client";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth";
import UnionB from "../assets/UnionB.png";
import style from "./groupInfo.module.scss";
import Skeleton from "@material-ui/lab/Skeleton";

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
    update() {
      fetchGroupInfo();
      fetchGroupOwnerInfo();
    },
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
      <div
        style={{ display: "flex", maxHeight: "55px", padding: "7px 7px 7px 0" }}
      >
        <div>
          <img className={style.icon_home} src={UnionB} alt="" />
        </div>
        <div style={{ marginTop: 3, fontWeight: "500" }}>
          <p className={style.home_name}>
            <Skeleton width={200} height={30}></Skeleton>
          </p>
          <p className={style.home_username}>
            <Skeleton width={150} height={20}></Skeleton>
          </p>
        </div>
      </div>
    );
  } else {
    groupData = (
      <div style={{ display: "flex", padding: "7px 7px 7px 0" }}>
        <div>
          <img className={style.icon_home} src={UnionB} alt="" />
        </div>
        <div style={{ marginTop: 3, fontWeight: "500" }}>
          <span className={style.home_name}>
            {groupInfo.data.getGroupInfo.groupName}
          </span>
          <span>
            <i
              style={{ cursor: "pointer", padding: "5px" }}
              className="fas fa-ellipsis-v fa-sm "
            ></i>
          </span>
          <br />
          <span className={style.home_username}>
            @{groupInfo.data.getGroupInfo.groupUserName}
          </span>
        </div>
      </div>
    );
  }

  let groupOwnerData;
  if (!groupOwnerInfo.data || !userAdditionalInfo.data || !groupInfo.data) {
    groupOwnerData = (
      <div>
        <p className={style.home_username}>
          <Skeleton width={50} height={20}></Skeleton>
        </p>
      </div>
    );
  } else {
    groupOwnerData = (
      <div>
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
  query getOwnerInfo($groupOwnerId: ID!) {
    getOwnerInfo(groupOwnerId: $groupOwnerId) {
      id
      # createdAt
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
