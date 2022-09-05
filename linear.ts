import { UserVisibleError } from "@codahq/packs-sdk";

const jsregression = require("js-regression");

export function fitMultiInputModel(
  outputVariable: number[],
  inputVariables: number[][]
) {
  // check for valid input - for this, it's just that the output variable and input variables have the same amount of entries
  let dataLength = outputVariable.length;
  if (inputVariables.some((arr) => arr.length!=dataLength)){
    throw new UserVisibleError("Make sure all of your input variable data contains the same number of values as the output variable data.")
  }

  // shape the data as required by jsregression - output variable has to be the last column
  let trainingData = []
  for(let i = 0; i < dataLength; i++){
    let entry = [];
    inputVariables.forEach((inputVariableArr)=>entry.push(inputVariableArr[i]));
    entry.push(outputVariable[i]);
    trainingData.push(entry)
  }

  let regression = new jsregression.LinearRegression();
  let model = regression.fit(trainingData)

  // build a string representing the model
  let equation = "y = "
  for (let i = 0; i< model.theta.length - 1; i++){
    equation += `${model.theta[i]} (x_${i+1}) + `
  }
  equation += model.theta[model.theta.length - 1]

  return {
    equation: equation,
    intercept: model.theta[model.theta.length - 1],
    coefficients: model.theta.slice(0, model.theta.length - 1)
  };
}

export function fitBasicModel(
  outputVariable: number[],
  inputVariable: number[]
) {
  // check for valid input - for this, it's just that the output variable and input variable have the same amount of entries
  if (inputVariable.length != outputVariable.length){
    throw new UserVisibleError("Make sure all of your input variable data contains the same number of values as the output variable data.")
  }
  let dataLength = outputVariable.length;

  let xMean = inputVariable.reduce((sum, x) => sum+x, 0)/dataLength;
  let yMean = outputVariable.reduce((sum, x) => sum+x, 0)/dataLength;

  let xyDev = inputVariable.reduce((total, x, i) => total + x*outputVariable[i]) - dataLength*xMean*yMean;
  let xxDev = inputVariable.reduce((total, x) => total + x*x) - dataLength*xMean*xMean;

  let coefficient = xyDev / xxDev;
  let intercept = yMean - coefficient*xMean;

  // build a string representing the model
  let equation = `y = ${coefficient} (x_1) + ${intercept}`

  return {
    equation,
    intercept,
    coefficients: [coefficient]
  };
}
