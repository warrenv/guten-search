const _ = require("lodash/fp")
const Contexture = require("contexture")
const provider = require("contexture-elasticsearch")
const types = require("contexture-elasticsearch/types")
// let Provider = require('../../src/index');
// let types = require('../../src/types');
const elasticsearch = require("@elastic/elasticsearch")
const AgentKeepAlive = require("agentkeepalive")

module.exports = async () => {
  /// //////////////////////////// orig integration test
  // this.timeout(10000);
  //    // Setup
  //    let getClient = _.memoize(
  //      () =>
  //        new elasticsearch.Client({
  //          node: 'http://localhost:9200',
  //          //'http://test-elasticsearch-master.default.svc.cluster.local:9200',
  //          apiVersion: '7.14.0',
  //
  //          // This is an example config, see the elasticsearch js docs for more
  //          minSockets: 1,
  //          maxSockets: 20,
  //          keepAlive: true,
  //          createNodeAgent: (connection, config) =>
  //            new AgentKeepAlive(connection.makeAgentConfig(config)),
  //        })
  //    );
  //
  //    let esClient = getClient();
  //    await esClient.ping();
  //
  //    let provider = Provider({
  //      getClient,
  //      types: types({
  //        // geo: { geocodeLocation: query => googleplaces.textSearch({ query }) },
  //      }),
  //    });

  //  let schemas = await provider.getSchemas();

  // how to get fields to populate. must be es insert or index thing.
  //  console.info(`SCHEMAS: ${JSON.stringify(schemas, null, 2)}`);

  //    let process = Contexture({
  //      schemas,
  //      providers: { elasticsearch: provider },
  //    });
  /// //////////////////////////// orig integration test

  /// ///////////////// from contexture-elasticsearch/README.md
  // Setup
  const process = Contexture({
    // schemas,
    // hardcoding output from integration test run on contexture-elasticsearch
    // should we retrieve dynamically?
    schemas: {
      "gutenberg-books": {
        elasticsearch: {
          index: "gutenberg-books",
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
    },

    providers: {
      elasticsearch: provider({
        getClient: _.memoize(() =>
          new elasticsearch.Client({
            node: "http://localhost:9200",
            // This is an example config, see the elasticsearch js docs for more
            apiVersion: "7.14.0",
            minSockets: 1,
            maxSockets: 20,
            keepAlive: true,
            createNodeAgent: (connection, config) =>
              new AgentKeepAlive(connection.makeAgentConfig(config)),
          }),
        ),
        types: types({
          //            geo: {
          //              geocodeLocation: query =>
          //                googleplaces.textSearch({
          //                  query
          //                })
          //            }
        }),
      }),
    },
  })

  // NOTE: Simple usage (tree would come from the client)
  // process(tree)

  const tree = {
    key: "root",
    type: "group",
    join: "and",
    schema: "gutenberg-books",
    children: [
      {
        key: "searchXQuery", // name can be anything
        type: "query",
        field: "text",
        query: "world",
      },

      // only query text within a line number range.
      {
        key: "searchXRange", // name can be anything
        type: "number",
        field: "line",
        min: 0,
        max: 800,
      },

      { key: "results", type: "results" },
    ],
  }

  return process(tree)
//  let result = await process(tree);
//
//  console.info('\nRESULTS');
//  console.info(JSON.stringify(result, null, 2));
//  console.info('\nCONTEXT');
//  console.info(JSON.stringify(result.children[1].context,null,2));
}
