// const { gql } = require("apollo-server");

// module.exports = gql`
//   type User {
//     id: ID!
//     email: String!
//     token: String!
//     createdAt: String!
//   }

//   input RegisterInput {
//     email: String!
//     password: String!
//     confirmPassword: String!
//   }

//   type Query {
//     sayHii: String!
//   }

//   type Mutation {
//     register(registerInput: RegisterInput): User!
//     login(email: String!, password: String!): User!
//   }
// `;
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
    userOwnedGroupIds: [UserOwnedGroupId]!
    userFollowingGroupIds: [UserFollowingGroupId]!
  }
  type UserOwnedGroupId {
    id: ID!
    groupName: String!
    groupUserName: String!
    isPrivate: Boolean!
    createdAt: String!
    groupFollowers: [GroupFollower]!
    groupPosts: [GroupPost]!
  }
  type UserFollowingGroupId {
    id: ID
    groupUserName: String!
  }
  type GroupFollower {
    id: ID!
    username: String!
    userusername: String!
    createdAt: String!
  }
  type GroupPost {
    id: ID!
    username: String!
    userusername: String!
    postBody: String!
    createdAt: String!
    postLikes: [PostLike]!
    postViews: [PostView]!
    likeCount: Int!
    viewCount: Int!
  }
  type PostLike {
    username: String!
    userusername: String!
    createdAt: String!
  }
  type PostView {
    username: String!
    userusername: String!
    createdAt: String!
  }
  input RegisterInput {
    email: String!
    password: String!
    confirmPassword: String!
    username: String!
    userusername: String!
    bio: String
  }
  type Query {
    sayHii: String!
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
  }
`;
