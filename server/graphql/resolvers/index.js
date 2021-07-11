const usersResolvers = require("./users");

module.exports = {
  Query: {
    sayHii: () => "Dummy query ESSENTIAL",
  },
  Mutation: {
    ...usersResolvers.Mutation,
  },
};
