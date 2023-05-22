const express = require("express");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLSchema,
} = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const { resolve } = require("path");

const app = express();

let usersList = [
  { id: "1", name: "John", email: "john@gmail.com" },
  { id: "2", name: "Ann", email: "ann@gmail.com" },
  { id: "3", name: "Tony", email: "tony@gmail.com" },
];

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return usersList;
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return usersList.find((user) => user.id === args.id);
      },
    },
  },
});

const mutations = new GraphQLObjectType({
  name: "mutations",
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        const newUser = {
          id: usersList.length,
          name: args.name,
          email: args.email,
        };
        usersList.push(newUser);

        return newUser;
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve(parent, args) {
        const user = usersList.find((user) => user.id === args.id);
        user.name = args.name;
        user.email = args.email;

        return user;
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        const user = usersList.find((user) => user.id === args.id);
        usersList = usersList.filter((u) => u.id !== args.id);

        return user;
      },
    },
  },
});

const schema = new GraphQLSchema({ query: RootQuery, mutation: mutations });

app.use("/graphql", graphqlHTTP({ schema: schema, graphiql: true }));

app.listen(3000, () => {
  console.log("Server is running...");
});
