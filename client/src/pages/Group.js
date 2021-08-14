/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import { Card, Form } from "semantic-ui-react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import GroupInfo from "../components/GroupInfo";
import CentralPollingUnit from "../components/CentralPollingUnit";
import { NotifierContext } from "../context/notifier";
import { GroupSelectorContext } from "../context/groupSelector";

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
    // if (!JSON.parse(localStorage.getItem(groupId))) {
    // }
  };

  const addMessageToLocal = (message, groupId) => {
    let groupMessages = JSON.parse(localStorage.getItem(groupId));
    if (!groupMessages.find((item) => item.id === message.id)) {
      groupMessages.push(message);
      localStorage.setItem(groupId, JSON.stringify(groupMessages));
      setDisplayPosts(groupMessages);
    }
  };

  const [fetchPosts, { data }] = useLazyQuery(FETCH_LINKS_QUERY, {
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

  let postsMarkUp;
  if (!displayPosts) {
    postsMarkUp = <p>No posts yet</p>;
  } else {
    postsMarkUp = displayPosts.map((x, index) => (
      <div style={{ margin: "3px" }} key={index}>
        <span
          style={{
            border: "1px solid black",
          }}
        >
          {x.postBody}
        </span>{" "}
        <br />
        <span>By {x.username}</span>
      </div>
    ));
  }

  return (
    <>
      {!groupId && !groupOwnerId ? (
        <>tap on group or something</>
      ) : (
        <>
          {groupId && groupOwnerId && (
            <GroupInfo groupId={groupId} groupOwnerId={groupOwnerId} />
          )}
          <hr />
          <div>{postsMarkUp}</div>
          <hr />
          <>
            {groupOwnerId === user.id && (
              <Card fluid>
                <Card.Content>
                  <p>Post link here</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Post links here"
                        value={postedLinks}
                        onChange={(event) => setPostedLinks(event.target.value)}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={postedLinks.trim() === ""}
                        onClick={() => submitPost()}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            <CentralPollingUnit />
          </>
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
