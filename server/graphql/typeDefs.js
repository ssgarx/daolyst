const { gql } = require("apollo-server");
module.exports = gql`
  type User {
    id: ID!
    email: String!
    token: String!
    createdAt: String!
    username: String!
    userusername: String!
    bio: String!
  }
  type Group {
    id: ID
    groupId: String
    groupName: String
    groupUserName: String
    isPrivate: Boolean
    createdAt: String
    groupFollowers: [GroupFollower]
  }
  type GroupFollower {
    id: ID
    username: String
    userusername: String
    createdAt: String
  }
  type UserFollowingGroupId {
    id: ID
    groupUserName: String!
  }
  type GroupPosts {
    id: ID
    postsId: String
    username: String
    userusername: String
    postBody: String
    createdAt: String
    postLikes: [PostLike]
    postViews: [PostView]
    likeCount: Int
    viewCount: Int
  }
  type PostLike {
    username: String
    userusername: String
    createdAt: String
  }
  type PostView {
    username: String
    userusername: String
    createdAt: String
  }
  input RegisterInput {
    email: String!
    password: String!
    confirmPassword: String!
    username: String!
    userusername: String!
    bio: String
  }
  # type Query {
  #   sayHii: String!
  # }
  type Query {
    getGroups(uid: String!): [Group]
    getGroupPosts(groupId: String!): [GroupPosts]
    getGroupInfo(groupId: String!): Group!
    getOwnerInfo(groupOwnerId: String!): User!
    searchGroups(searchedText: String!): [Group]
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    createGroup(
      groupName: String!
      groupUserName: String!
      isPrivate: Boolean!
      uid: String!
    ): Group
    createGroupPost(
      uid: String!
      groupId: String!
      body: String!
    ): [GroupPosts]!
  }
`;
