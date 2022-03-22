import * as coda from "@codahq/packs-sdk";
import * as helpers from "./linear";
import * as schemas from "./schemas";

export const pack = coda.newPack();

pack.addFormula({
  name: "FitMultiinputLinearModel",
  description: "Returns an equation representing a linear relationship between any number of input variables and a single output variable.",

  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.NumberArray,
      name: "output_variable",
      description: "The list of values for the single output variable.",
    }),
  ],

  varargParameters: [
    coda.makeParameter({
      type: coda.ParameterType.NumberArray,
      name: "input_variable",
      description: "1 or more lists of values for the input variable(s)",
    }),
  ],

  resultType: coda.ValueType.Object,
  schema: schemas.LinearEquationSchema,

  execute: async function ([outputVariable, ...inputVariables], context) {
    return helpers.fitMultiInputModel(context, outputVariable, inputVariables);
  },
});

pack.addFormula({
  name: "FitBasicLinearModel",
  description: "Returns an equation representing a linear relationship between a single input variable and a single output variable.",

  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.NumberArray,
      name: "output_variable",
      description: "The list of values for the single output variable.",
    }),
  ],

  varargParameters: [
    coda.makeParameter({
      type: coda.ParameterType.NumberArray,
      name: "input_variable",
      description: "1 or more lists of values for the single input variable",
    }),
  ],

  resultType: coda.ValueType.Object,
  schema: schemas.LinearEquationSchema,

  execute: async function ([outputVariable, inputVariable], context) {
    return helpers.fitBasicModel(context, outputVariable, inputVariable);
  },
});

pack.addFormula({
  name: "CalculateLinearOutput",
  description: "Returns an output value.",

  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: "equation_intercept",
      description: "The intercept from the equation.",
    }),
    coda.makeParameter({
      type: coda.ParameterType.NumberArray,
      name: "input_variable_coefficients",
      description: "The coefficients from the equation.",
    }),
  ],

  varargParameters: [
    coda.makeParameter({
      type: coda.ParameterType.NumberArray,
      name: "input_variable_value",
      description: "The value(s) for the input variables in the same order as the coefficients from the equation.",
    }),
  ],

  resultType: coda.ValueType.Number,

  execute: async function ([equationIntercept, inputVariableCoefficients, ...inputVariableValues], context) {
    if (inputVariableCoefficients.length != inputVariableValues.length){
      throw new coda.UserVisibleError(`${inputVariableValues.length} input values were provided. This equation expects ${inputVariableCoefficients.length} values.`)
    }
    return inputVariableCoefficients.reduce((total, coefficient, index) => total+coefficient*inputVariableValues[index], 0) + equationIntercept;
  },
});