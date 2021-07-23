import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import { Card, Form } from "semantic-ui-react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import GroupInfo from "../components/GroupInfo";

function Group(props, args = {}) {
  const { user } = useContext(AuthContext);
  const groupId = props.match.params.groupId;
  const groupOwnerId = props.location.state;
  const uid = user.id;
  const [postedLinks, setPostedLinks] = useState("");

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [fetchPosts, { data }] = useLazyQuery(FETCH_LINKS_QUERY, {
    variables: {
      groupId,
    },
    fetchPolicy: "network-only",
  });

  const [submitPost] = useMutation(SUBMIT_LINKS_MUTATION, {
    update() {
      setPostedLinks("");
      fetchPosts();
    },
    variables: {
      uid,
      groupId,
      body: postedLinks,
    },
  });

  let postsMarkUp;
  if (!data) {
    postsMarkUp = <p>Loading posts</p>;
  } else if (data.getGroupPosts.length === 0) {
    postsMarkUp = <p>No posts yet</p>;
  } else {
    postsMarkUp = data.getGroupPosts.map((x, index) => (
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
      <GroupInfo groupId={groupId} groupOwnerId={groupOwnerId} />
      <hr />
      <div>{postsMarkUp}</div>
      <hr />
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
                onClick={submitPost}
              >
                Submit
              </button>
            </div>
          </Form>
        </Card.Content>
      </Card>
    </>
  );
}
const SUBMIT_LINKS_MUTATION = gql`
  mutation createGroupPost($uid: String!, $groupId: String!, $body: String!) {
    createGroupPost(uid: $uid, groupId: $groupId, body: $body) {
      id
      postsId
      username
      userusername
      postBody
      createdAt
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
