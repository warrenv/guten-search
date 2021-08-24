// Initializes the `search` service on path `/search`
const { Search } = require("./search.class")
const hooks = require("./search.hooks")

module.exports = function (app) {
  const options = {
    paginate: app.get("paginate"),
    // mongoUrl, esUrl, etc.
    debug: true,
  }

  // Initialize our service with any options it requires
  app.use("/search", new Search(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service("search")

  service.hooks(hooks)
}
