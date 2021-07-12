import { gql, useMutation } from "@apollo/client";
import React, { useContext, useRef, useState } from "react";
import { Button, Container, Form } from "semantic-ui-react";
import { AuthContext } from "../context/auth";

function CreateGroup(props) {
  const { user } = useContext(AuthContext);
  console.log("user", user);

  const [errors, setErrors] = useState({});
  const [groupName, setGroupName] = useState("");
  const [groupUserName, setGroupUserName] = useState("");
  const isPrivate = true;
  const uid = user.id;

  const [onSubmit, { loading }] = useMutation(CREATE_GROUP, {
    update() {
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: {
      groupName,
      groupUserName,
      isPrivate,
      uid,
    },
  });

  return (
    <Container style={{ width: "500px" }}>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Create Group</h1>
        <Form.Input
          label="Groupname"
          placeholder="Groupname.."
          name="groupname"
          type="text"
          value={groupName}
          error={errors.groupname ? true : false}
          onChange={(event) => setGroupName(event.target.value)}
        />
        <Form.Input
          label="Groupusername"
          placeholder="Groupusername.."
          name="groupusername"
          type="groupusername"
          value={groupUserName}
          error={errors.groupusername ? true : false}
          onChange={(event) => setGroupUserName(event.target.value)}
        />
        <Button type="submit" primary>
          Create group
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
}

const CREATE_GROUP = gql`
  mutation (
    $groupName: String!
    $groupUserName: String!
    $isPrivate: Boolean!
    $uid: String!
  ) {
    createGroup(
      groupName: $groupName
      groupUserName: $groupUserName
      isPrivate: $isPrivate
      uid: $uid
    ) {
      id
      email
      username
      userusername
      bio
      userOwnedGroupIds {
        id
        owneruserusername
        groupName
        groupUserName
        isPrivate
        createdAt
      }
    }
  }
`;

export default CreateGroup;
