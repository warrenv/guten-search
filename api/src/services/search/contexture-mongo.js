const types = require("../../types")()
const Contexture = require("contexture")
const provider = require("../../src")
const _ = require("lodash/fp")
const testSetup = require("../setup")

const schemaName = "Documents"
const collection = "document"
const clients = []

const asyncPipe = (...fns) => x => fns.reduce(async (y, f) => f(await y), x)

afterAll(async () => {
  await asyncPipe(...clients)(() => {})
})

const contextureTestSetup = async ({ collection }) => {
  const { client, db, ids } = await testSetup({ collection })
  clients.push(() => client.close())

  return {
    db,
    ids,
    process: Contexture({
      schemas: {
        [schemaName]: {
          mongo: {
            collection,
          },
        },
      },
      providers: {
        mongo: provider({
          getClient: () => db,
          types,
        }),
      },
    }),
  }
}

describe("Grouping text and mongoId", () => {
  it("should work", async () => {
    try {
      const {
        ids: [id],
        process,
      } = await contextureTestSetup({ collection })

      const dsl = {
        type: "group",
        schema: schemaName,
        join: "and",
        items: [
          {
            key: "text",
            type: "text",
            field: "code",
            data: {
              operator: "containsWord",
              value: "22",
            },
          },
          {
            key: "specificUser",
            type: "mongoId",
            field: "_id",
            data: {
              value: id,
            },
          },
          {
            key: "results",
            type: "results",
          },
        ],
      }

      const result = await process(dsl, { debug: true })
      const response = _.last(result.items).context.response

      expect(response.totalRecords).toBe(3)
      expect(response.results[0]._id.toString()).toBe(id.toString())
    } catch (err) {
      expect(err).toBe(false)
    }
  })

  it("should work with populate", async () => {
    const {
      ids: [id, id2],
      process,
    } = await contextureTestSetup({ collection })

    const dsl = {
      type: "group",
      schema: schemaName,
      join: "and",
      items: [
        {
          key: "text",
          type: "text",
          field: "code",
          data: {
            operator: "containsWord",
            value: "22",
          },
        },
        {
          key: "specificUser",
          type: "mongoId",
          field: "_id",
          data: {
            value: id,
          },
        },
        {
          key: "results",
          type: "results",
          config: {
            populate: {
              child: {
                schema: "Documents",
                foreignField: "_id",
                localField: "nextCode",
              },
            },
          },
        },
      ],
    }

    const result = await process(dsl, { debug: true })
    const response = _.last(result.items).context.response

    expect(response.totalRecords).toBe(3)
    expect(response.results[0]._id.toString()).toBe(id.toString())
    expect(response.results[0].nextCode.toString()).toBe(id2.toString())
  })
})
