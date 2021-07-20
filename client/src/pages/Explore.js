import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Card, Form } from "semantic-ui-react";

function Explore() {
  const [searchedText, setSearchedText] = useState("");
  const [submitSearchedText, { data }] = useLazyQuery(FETCH_SEARCH_RESULT, {
    variables: {
      searchedText,
    },
  });
  console.log("data", data);

  let groupsMarkUp;
  if (!data) {
    groupsMarkUp = <p>Loading groups</p>;
  } else if (data.searchGroups.length === 0) {
    groupsMarkUp = <p>No groups found</p>;
  } else {
    groupsMarkUp = data.searchGroups.map((x, index) => (
      <div style={{ margin: "3px", border: "1pz solid black" }} key={index}>
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
      <Card fluid>
        <Card.Content>
          <p>Search for groups here</p>
          <Form>
            <div className="ui action input fluid">
              <input
                type="text"
                placeholder="Type group username here"
                value={searchedText}
                onChange={(event) => setSearchedText(event.target.value)}
              />
              <button
                type="submit"
                className="ui button teal"
                disabled={searchedText.trim() === ""}
                onClick={() => submitSearchedText()}
              >
                Submit
              </button>
            </div>
          </Form>
        </Card.Content>
      </Card>
      <div>{groupsMarkUp}</div>
    </>
  );
}

const FETCH_SEARCH_RESULT = gql`
  query searchGroups($searchedText: String!) {
    searchGroups(searchedText: $searchedText) {
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

export default Explore;
