const generic = require("./src/cache/generic")

module.exports = {
  user: require("./src/cache/user"),
  app: require("./src/cache/appMetadata"),
  ...generic,
}
