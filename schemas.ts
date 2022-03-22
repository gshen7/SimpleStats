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
  primary: "equation",
});