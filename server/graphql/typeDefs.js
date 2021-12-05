const { gql } = require("apollo-server");
module.exports = gql`
  type User {
    id: ID!
    email: String!
    username: String
  }
  type Otp {
    code: String
    token: String
    email: String
    createdAt: String
  }
  type Query {
    checkIfNewUser(email: String!): Boolean!
  }
  type Mutation {
    register(email: String!): User!
    verifyOtp(code: String!): Otp
    deleteOtps(email: String!): Boolean!
    oneTimeForm(username: String!): User!
  }
`;
