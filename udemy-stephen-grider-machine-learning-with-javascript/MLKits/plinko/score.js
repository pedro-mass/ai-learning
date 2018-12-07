const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 50;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);

  _.range(1, 15).forEach(k => {
    const accuracy = _.chain(testSet)
      .filter(
        ([point, , , actualBucket]) =>
          knn(trainingSet, point, k) === actualBucket
      )
      .size()
      .divide(testSetSize)
      .value();

    console.log({ k, accuracy });
  });
}

function knn(data, desiredPoint, k) {
  return _.chain(data)
    .map(([point, bounciness, ballSize, bucket]) => [
      distance(point, desiredPoint),
      bucket
    ])
    .sortBy(([distance]) => distance)
    .slice(0, k)
    .countBy(([, bucket]) => bucket)
    .toPairs()
    .maxBy(([, count]) => count)
    .first()
    .parseInt()
    .value();
}

function distance(pointA, pointB) {
  return Math.abs(pointA - pointB);
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}
