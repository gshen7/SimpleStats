import * as coda from "@codahq/packs-sdk";

export const LinearEquationSchema = coda.makeObjectSchema({
  properties: {
    equation: {type: coda.ValueType.String},
    intercept: {type: coda.ValueType.Number},
    coefficients: {
      type: coda.ValueType.Array,
      items: {type: coda.ValueType.Number}
    }
  },
  displayProperty: "equation",
});

export const KMeansClusterSchema = coda.makeObjectSchema({
  properties: {
    coordinates: {type: coda.ValueType.Array, items: {type:coda.ValueType.Number}},
    cluster: {type:coda.ValueType.String},
    centroid: {type: coda.ValueType.Array, items: {type:coda.ValueType.Number}},
  },
  displayProperty: "cluster",
});