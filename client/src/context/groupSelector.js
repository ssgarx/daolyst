import React, { useReducer, createContext } from "react";
const initialState = {
  groupData: { groupId: null, groupOwnerId: null },
};

const GroupSelectorContext = createContext({
  groupData: { groupId: null, groupOwnerId: null },
  createGroupSelection: (groupId, groupOwnerId) => {},
});

function groupSelectorReducer(state, action) {
  switch (action.type) {
    case "SELECT_GROUP":
      return {
        ...state,
        groupData: {
          groupId: action.payload.groupId,
          groupOwnerId: action.payload.groupOwnerId,
        },
      };

    default:
      return state;
  }
}

function GroupSelectorProvider(props) {
  const [state, dispatch] = useReducer(groupSelectorReducer, initialState);

  function createGroupSelection(groupId, groupOwnerId) {
    dispatch({
      type: "SELECT_GROUP",
      payload: { groupId, groupOwnerId },
    });
  }

  return (
    <GroupSelectorContext.Provider
      value={{ groupData: state.groupData, createGroupSelection }}
      {...props}
    />
  );
}

export { GroupSelectorContext, GroupSelectorProvider };
