/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import GroupInfo from "../components/GroupInfo";
import CentralPollingUnit from "../components/CentralPollingUnit";
import { NotifierContext } from "../context/notifier";
import { GroupSelectorContext } from "../context/groupSelector";
import style from "./group.module.scss";
import GreetingScreem from "../components/GreetingScreem";
import Posts from "../components/Posts";

function Group(props, args = {}) {
  const { user } = useContext(AuthContext);
  const { notifArray, removeNotification } = useContext(NotifierContext);
  const { groupData } = useContext(GroupSelectorContext);
  const groupId = groupData.groupId;
  const groupOwnerId = groupData.groupOwnerId;

  const uid = user.id;
  const [postedLinks, setPostedLinks] = useState("");
  const [displayPosts, setDisplayPosts] = useState("");

  useEffect(() => {
    if (groupId) {
      if (!JSON.parse(localStorage.getItem(groupId))) {
        fetchPosts();
      }
      setDisplayPosts(JSON.parse(localStorage.getItem(groupId)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (notifArray.includes(groupId)) {
      removeNotification(groupId);
    }
  }, [groupId]);

  useEffect(() => {
    setDisplayPosts(JSON.parse(localStorage.getItem(groupId)));
    if (notifArray.includes(groupId)) {
      removeNotification(groupId);
    }
  }, [notifArray]);

  const saveGroupMessagesToLocal = (data, groupId) => {
    let groupMessages = data;
    localStorage.setItem(groupId, JSON.stringify(groupMessages));
    setDisplayPosts(groupMessages);
  };

  const addMessageToLocal = (message, groupId) => {
    let groupMessages = JSON.parse(localStorage.getItem(groupId));
    if (!groupMessages.find((item) => item.id === message.id)) {
      groupMessages.push(message);
      localStorage.setItem(groupId, JSON.stringify(groupMessages));
      setDisplayPosts(groupMessages);
    }
  };

  const [fetchPosts, { data, loading }] = useLazyQuery(FETCH_LINKS_QUERY, {
    onCompleted() {
      saveGroupMessagesToLocal(data.getGroupPosts, groupId);
    },
    variables: {
      groupId,
    },
    fetchPolicy: "network-only",
  });

  const [submitPost] = useMutation(SUBMIT_LINKS_MUTATION, {
    update() {
      setPostedLinks("");
    },
    onCompleted(data) {
      addMessageToLocal(data.createGroupPost, groupId);
    },
    variables: {
      uid,
      groupId,
      body: postedLinks,
    },
  });

  return (
    <>
      {!groupId && !groupOwnerId ? (
        <GreetingScreem />
      ) : (
        <>
          <div style={{ height: "95vh" }}>
            {groupId && groupOwnerId && (
              <GroupInfo groupId={groupId} groupOwnerId={groupOwnerId} />
            )}
            <div className={style.home_posts}>
              <div>
                <Posts loading={loading} displayPosts={displayPosts} />
              </div>
            </div>
            <div style={{ border: "5px solid white" }}>
              {groupOwnerId === user.id && (
                <>
                  <div className={style.home_send_parent}>
                    <form
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: "white",
                      }}
                    >
                      <div style={{ flex: 12 }}>
                        <input
                          className={style.home_send}
                          type="text"
                          placeholder="Post links here"
                          value={postedLinks}
                          onChange={(event) =>
                            setPostedLinks(event.target.value)
                          }
                        />
                      </div>
                      {postedLinks && (
                        <div style={{ flex: 1 }}>
                          <button
                            type="submit"
                            className={style.home_send_btn}
                            disabled={postedLinks.trim() === ""}
                            onClick={(e) => {
                              e.preventDefault();
                              postedLinks.trim() !== "" && submitPost();
                            }}
                          >
                            send
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </>
              )}
              <CentralPollingUnit />
            </div>
          </div>
        </>
      )}
    </>
  );
}
const SUBMIT_LINKS_MUTATION = gql`
  mutation createGroupPost($uid: String!, $groupId: String!, $body: String!) {
    createGroupPost(uid: $uid, groupId: $groupId, body: $body) {
      createdAt
      id
      likeCount
      postBody

      postTitle
      postDescription
      postDomain
      postImage

      postLikes {
        username
      }
      postViews {
        username
      }
      postsId
      username
      userusername
      viewCount
    }
  }
`;

const FETCH_LINKS_QUERY = gql`
  query getGroupPosts($groupId: String!) {
    getGroupPosts(groupId: $groupId) {
      id
      postsId
      username
      userusername
      postBody
      createdAt

      postTitle
      postDescription
      postDomain
      postImage

      postLikes {
        username
      }
      postViews {
        username
      }
      likeCount
      viewCount
    }
  }
`;

export default Group;
