const usersResolvers = require("./users");

module.exports = {
  Query: {
    ...usersResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
  },
};

// Query: {
//   sayHii: () => "Dummy query ESSENTIAL",
// },
