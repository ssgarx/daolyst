import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/auth";
import { Card, Form } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";

function Group(props, args = {}) {
  const { user } = useContext(AuthContext);
  const groupId = props.match.params.groupId;
  const [postedLinks, setPostedLinks] = useState("");

  const [submitPost] = useMutation(SUBMIT_LINKS_MUTATION, {
    update() {
      setPostedLinks("");
    },
    variables: {
      uid: user.id,
      groupId,
      body: postedLinks,
    },
  });

  return (
    <>
      <h1>Group name here</h1>
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
  mutation createPost($uid: uid, $groupId: String!, $body: String!) {
    createPost(uid: $uid, groupId: $groupId, body: $body) {
      id
    }
  }
`;
export default Group;
