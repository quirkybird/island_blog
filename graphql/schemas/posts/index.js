const {
  getRecentPosts, 
  getAllPosts,
  getPostById,
  getFriendLinks
  } = require("../../src/service/root.service")
const fs = require("fs")
const path = require("path")

module.exports = {
  resolver: {
    Query: {
      recentPost: async () => await getRecentPosts(),
      allPost: async () => await getAllPosts(),
      post: async (_parent, _args) => await getPostById(_args.id),
      friendlinks: async () => await getFriendLinks()
    }
  },
  schema: fs.readFileSync(
    path.resolve(__dirname, "./posts-schema.graphql")
  ).toString()
}