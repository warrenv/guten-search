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
      query: "world", // param
    },

    // only query text within a line number range.
    {
      key: "searchXRange", // name can be anything
      type: "number",
      field: "line",
      min: 0, // param
      max: 800, // param
    },

    { key: "results", type: "results" },
  ],
}

const dsl = {
  key: "root",
  type: "group",
  join: "and",
  schema: "gutenberg",
  children: [
  // items: [
    {
      // key: "text",
      key: "searchTitle",
      type: "text",
      field: "title",
      data: {
        operator: "containsWord",
        value: "Moby",
      },
    },
    {
      key: "results",
      type: "results",
    },
  ],
}

// module.exports = tree
module.exports = dsl
