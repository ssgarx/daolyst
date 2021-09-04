import { gql, useMutation } from "@apollo/client";
import { Box, FormControlLabel, Switch } from "@material-ui/core";
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/auth";
import { GroupUpdaterContext } from "../context/groupsUpdater";
import style from "./groupInfoMenu.module.scss";
function UserInfo(props) {
  const { user } = useContext(AuthContext);
  const [errors, setErrors] = useState({});
  const [groupName, setGroupName] = useState("");
  const [groupUserName, setGroupUserName] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const uid = user.id;
  const { updateNumberOfGroups } = useContext(GroupUpdaterContext);

  const [onSubmit, { loading }] = useMutation(CREATE_GROUP, {
    // update() {
    //   updateNumberOfGroups("ADD");
    //   props.handleClose();
    //   props.history.push("/");
    // },
    // onError(err) {
    //   setErrors(err.graphQLErrors[0].extensions.exception.errors);
    // },
    // variables: {
    //   groupName,
    //   groupUserName,
    //   isPrivate,
    //   uid,
    // },
  });

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight={props.fullScreen && 95}
    >
      <p>User info</p>
      <div className={style.cg}>
        {props.fullScreen && (
          <div style={{ textAlign: "right" }}>
            <button
              className={style.close_button}
              onClick={props.handleClose}
              color="primary"
            >
              close
            </button>
          </div>
        )}
      </div>
    </Box>
  );
}

const CREATE_GROUP = gql`
  mutation createGroup(
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
      groupId
      groupName
      groupUserName
      isPrivate
      createdAt
    }
  }
`;

export default UserInfo;
