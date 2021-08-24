const _ = require("lodash/fp")
const Contexture = require("contexture")
const esProvider = require("contexture-elasticsearch")
// const esTypes = require("contexture-elasticsearch").types
const esTypes = require("../../../../contexture-elasticsearch/src/types")
const elasticsearch = require("@elastic/elasticsearch")
const AgentKeepAlive = require("agentkeepalive")
const mongoProvider = require("contexture-mongo")
const mongoTypes = require("contexture-mongo/types")
const MongoClient = require("mongodb").MongoClient

const mongoUrl = "mongodb://app:development@localhost:27017/gutenberg" // config
const esUrl = "http://localhost:9200" // config

console.log(`esTypes: ${JSON.stringify(esTypes({}), null, 2)}`)
console.log(`mongoTypes: ${JSON.stringify(mongoTypes({}), null, 2)}`)

module.exports = () => Contexture({
  schemas: {
    "gutenberg-books": { // config
      elasticsearch: {
        index: "gutenberg-books", // config
        type: "properties",
      },
      fields: {
        "": {
          field: "",
          label: "",
          elasticsearch: {},
        },
      },
    },

    gutenberg: { // param or config
      mongo: {
        collection: "books", // param or config
      },
    },
  },

  providers: {
    elasticsearch: esProvider({
      getClient: _.memoize(() =>
        new elasticsearch.Client({
          node: esUrl,
          apiVersion: "7.14.0", // config
          // This is an example config, see the elasticsearch js docs for more
          minSockets: 1,
          maxSockets: 20,
          keepAlive: true,
          createNodeAgent: (connection, config) =>
            new AgentKeepAlive(connection.makeAgentConfig(config)),
        }),
      ),
      types: esTypes({}),
    }),

    mongo: mongoProvider({
      getClient: async () => MongoClient.connect(mongoUrl, {}), // config
      mongoTypes,
    }),
  },
})
