import { UserVisibleError } from "@codahq/packs-sdk";
const skmeans = require("skmeans");

const K_LIMIT = 20;

export function getClusterForPoint(
  k: number,
  forceK: boolean,
  coordinatesWithPoint: number[][],
) {
  const relevantCoordinate = coordinatesWithPoint.filter((_element, index) => {
    return index % 2 === 0;
  }).flat()
  const coordinates = coordinatesWithPoint.filter((_element, index) => {
    return index % 2 === 1;
  })

  if(relevantCoordinate.length != coordinates.length){
    throw new UserVisibleError("Make sure your point has the same number of dimensions as the lists provided.")
  }
  for(let i=0; i<coordinates.length; i++){
    coordinates[i].push(relevantCoordinate[i])
  }
  const result = getKMeansClusters(k, forceK, coordinates)
  return result[result.length - 1]
}

export function getKMeansClusters(
  k: number,
  forceK: boolean,
  coordinates: number[][],
) {
  if(coordinates.length <= 0) {
    return []
  }
  const m = coordinates[0].length
  // check for valid input - for this, it's just that the coordinates matrix is n x m
  if (k > K_LIMIT && !forceK) {
    throw new UserVisibleError("This probably won't work with more than 20 clusters. Pass in forceK as true to override.")
  }
  for(const dimension of coordinates) {
    if (dimension.length !== m) {
      throw new UserVisibleError("Make sure all of your lists of coordinates data contains the same number of values.")
    }
  }

  // shape the data
  const data = []
  for (let i=0; i<m; i++){
    const point = []
    for (let j=0; j<coordinates.length; j++){
      point.push(coordinates[j][i])
    }
    data.push(point)
  }

  let result: SkMeansResult = skmeans(data,k)

  return result.idxs.map((cluster, idx) => {
    return {
      cluster: String.fromCharCode(97 + cluster),
      coordinates: data[idx],
      centroid: result.centroids[cluster]
    }
  });
}

interface SkMeansResult {
  it: number;
  k: number;
  idxs: number[];
  centroids: number[][];
}

