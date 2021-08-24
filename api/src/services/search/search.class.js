const tree = require("./tree")
const process = require("./contexture")

/* eslint-disable no-unused-vars */
exports.Search = class Search {
  constructor (options) {
    this.options = options || {}
  }

  async find (params) {
    return []
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`,
    }
  }

  async create (data, params) {
    //    if (Array.isArray(data)) {
    //      return Promise.all(data.map(current => this.create(current, params)))
    //    }
    //
    //    return data

    console.log("in service.search.create")
    console.log(`data: ${JSON.stringify(data, null, 2)}`)
    console.log(`params: ${JSON.stringify(params, null, 2)}`)

    // tree will come from data or params.
    const result = await process(this.options)(tree, { debug: true })

    console.info("\nRESULTS")
    console.info(JSON.stringify(result, null, 2))
    console.info("\nCONTEXT")
    console.info(JSON.stringify(result.children[1].context, null, 2))

    return result
  }

  async update (id, data, params) {
    return data
  }

  async patch (id, data, params) {
    return data
  }

  async remove (id, params) {
    return { id }
  }
}
