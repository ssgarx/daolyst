import { gql, useLazyQuery, useQuery } from "@apollo/client";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth";
import { useInterval } from "../util/hooks";

function CentralPollingUnit() {
  const { user } = useContext(AuthContext);
  let uid = user.id;

  useInterval(() => {
    // put your interval code here.
    // makeCall();
    console.log("POLLING");
  }, 1000 * 10);

  const sortData = async (arrayOfArray) => {
    let sortedArray = [];
    for (let i = 0; i < arrayOfArray.length; i++) {
      if (arrayOfArray[i].length > 0) {
        let key = arrayOfArray[i][0].postsId;
        let value = arrayOfArray[i];
        let obj = { key, value };
        sortedArray.push(obj);
      }
    }

    for (let i = 0; i < sortedArray.length; i++) {
      let localData = JSON.parse(localStorage.getItem(sortedArray[i].key));
      if (localData) {
        if (localData.length !== sortedArray[i].value.length) {
          console.log("SEND A NOTIFICATION FOR: ", sortedArray[i].key);
          localStorage.removeItem(sortedArray[i].key);
          localStorage.setItem(
            sortedArray[i].key,
            JSON.stringify(sortedArray[i].value)
          );
        } else {
          console.log("NO NOTIFICATIONS GENERATED");
        }
      }
    }
  };

  const [makeCall, { loading, error, data }] = useLazyQuery(
    GET_ALL_RELEVENT_DATA,
    {
      onCompleted() {
        console.log("on completed");
        sortData(data.getAllRelevantPosts);
      },
      variables: {
        uid,
      },
      fetchPolicy: "network-only",
    }
  );
  return null;
}

export default CentralPollingUnit;

const GET_ALL_RELEVENT_DATA = gql`
  query getAllRelevantPosts($uid: ID!) {
    getAllRelevantPosts(uid: $uid) {
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
