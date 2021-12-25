const { gql } = require("apollo-server");
module.exports = gql`
  type User {
    id: ID!
    email: String!
    username: String
    userProfileImg: String
    createdAt: String
    listedProjects: [listedProject]
  }
  type listedProject {
    _id: String
    projectIcon: String
    projectName: String
    projectTag: String
    projectDescription: String
    projectImages: [String]
    projectVideoLink: String
    createdAt: String
    uplysts: [User]
  }
  type Otp {
    code: String
    token: String
    email: String
    username: String
    userProfileImg: String
    createdAt: String
  }
  type Query {
    checkIfNewUser(email: String!): Boolean!
    getLystedDaos(page: Int!, limit: Int!): [User]
    getAllProjects(email: String!): User!
  }
  type Mutation {
    register(email: String!): User!
    verifyOtp(code: String!): Otp
    deleteOtps(email: String!): Boolean!
    oneTimeForm(username: String!, userProfileImg: String): User!
    createProject(
      projectIcon: String!
      projectName: String!
      projectTag: String!
      projectDescription: String!
      projectImages: [String!]
      projectVideoLink: String
    ): User!
    upLystProject(
      upLysterEmail: String!
      projectOwnerEmail: String!
      projectId: String!
    ): Boolean!
    deleteProject(projectId: String!): Boolean!
    editProject(
      projectId: String!
      projectIcon: String!
      projectName: String!
      projectTag: String!
      projectDescription: String!
      projectImages: [String!]
      projectVideoLink: String
    ): User!
  }
`;
