import * as coda from "@codahq/packs-sdk";
import * as linear from "./linear";
import * as kmeans from "./kmeans";
import * as schemas from "./schemas";

export const pack = coda.newPack();

pack.addFormula({
  name: "FitMultiinputLinearModel",
  description: "Returns an equation representing a linear relationship between any number of input variables and a single output variable.",

  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.NumberArray,
      name: "outputVariable",
      description: "The list of values for the single output variable.",
    }),
  ],

  varargParameters: [
    coda.makeParameter({
      type: coda.ParameterType.NumberArray,
      name: "inputVariable",
      description: "1 or more lists of values for the input variable(s)",
    }),
  ],

  resultType: coda.ValueType.Object,
  schema: schemas.LinearEquationSchema,

  execute: async function ([outputVariable, ...inputVariables]) {
    return linear.fitMultiInputModel(outputVariable, inputVariables);
  },
});

pack.addFormula({
  name: "FitBasicLinearModel",
  description: "Returns an equation representing a linear relationship between a single input variable and a single output variable.",

  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.NumberArray,
      name: "outputVariable",
      description: "The list of values for the single output variable.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.NumberArray,
      name: "inputVariable",
      description: "1 or more lists of values for the single input variable",
    }),
  ],

  resultType: coda.ValueType.Object,
  schema: schemas.LinearEquationSchema,

  execute: async function ([outputVariable, inputVariable]) {
    return linear.fitBasicModel(outputVariable, inputVariable);
  },
});

pack.addFormula({
  name: "CalculateLinearOutput",
  description: "Returns an output value.",

  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "equationIntercept",
      description: "The intercept from the equation.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.NumberArray,
      name: "inputVariableCoefficients",
      description: "The coefficients from the equation.",
    }),
  ],

  varargParameters: [
    coda.makeParameter({
      type: coda.ParameterType.NumberArray,
      name: "inputVariableValue",
      description: "The value(s) for the input variables in the same order as the coefficients from the equation.",
    }),
  ],

  resultType: coda.ValueType.Number,

  execute: async function ([equationIntercept, inputVariableCoefficients, ...inputVariableValues]) {
    if (inputVariableCoefficients.length != inputVariableValues.length){
      throw new coda.UserVisibleError(`${inputVariableValues.length} input values were provided. This equation expects ${inputVariableCoefficients.length} values.`)
    }
    return inputVariableCoefficients.reduce((total, coefficient, index) => total+coefficient*inputVariableValues[index], 0) + equationIntercept;
  },
});

pack.addFormula({
  name: "GetKMeansCluster",
  description: "Returns a list of cluster numbers for given coordinates",

  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "numClusters",
      description: "Number of clusters to form from all data; the given point will be grouped into one of the clusters.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.Boolean,
      name: "forceK",
      description: "Override limit of number of clusters. You should probably just set this to false.",
      suggestedValue: false,
    }),
  ],

  varargParameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "pointCoordinates",
      description: "1 or more value for the coordinates of the point to get the cluster for.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.NumberArray,
      name: "allCoordinates",
      description: "1 or more lists of all values in the data set for the respective coordinate. Do not include the point you are trying to get the cluster for.",
    }),
  ],

  resultType: coda.ValueType.Object,
  schema: schemas.KMeansClusterSchema,

  execute: async function ([k, forceK, ...coordinatesWithPoint]) {
    return kmeans.getClusterForPoint(k, forceK, coordinatesWithPoint);
  },
});

pack.addFormula({
  name: "GenerateAllClusters",
  description: "Returns a list of clusters and the coordinates in them.",

  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "numClusters",
      description: "Number of clusters to form.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.Boolean,
      name: "forceK",
      description: "Override limit of number of clusters. You should probably just set this to false.",
      suggestedValue: false,
    }),
  ],

  varargParameters: [
    coda.makeParameter({
      type: coda.ParameterType.NumberArray,
      name: "allCoordinates",
      description: "1 or more lists of all values in the data set for the respective coordinate. Each point should be the same index in all lists (ex. points (0,0) and (1,2) should be represented as [0,1], [0,2]). Include the point you are trying to get the cluster for.",
    }),
  ],

  resultType: coda.ValueType.Array,
  items: schemas.KMeansClusterSchema,

  execute: async function ([k, forceK, ...coordinates]) {
    return kmeans.getKMeansClusters(k, forceK, coordinates);
  },
});

pack.addFormula({
  name: "GetCentroid",
  description: "Returns a centroid coordinate for a list of coordinates.",

  parameters: [],

  varargParameters: [
    coda.makeParameter({
      type: coda.ParameterType.NumberArray,
      name: "allCoordinates",
      description: "1 or more lists of all values in the data set for the respective coordinate. Each point should be the same index in all lists (ex. points (0,0) and (1,2) should be represented as [0,1], [0,2]).",
    }),
  ],

  resultType: coda.ValueType.Array,
  items: {type:coda.ValueType.Number},

  execute: async function ([k, forceK, ...coordinates]) {
    return kmeans.getKMeansClusters(1, false, coordinates)[0].centroid;
  },
});