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
        testPoint =>
          knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint)
      )
      .size()
      .divide(testSetSize)
      .value();

    console.log({ k, accuracy });
  });
}

function knn(data, desiredPoint, k) {
  return _.chain(data)
    .map(point => [distance(_.initial(point), desiredPoint), _.last(point)])
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
  // pointA = [dropPosition, bounciness, ballSize, bucket]
  return (
    _.chain(pointA)
      .zip(pointB)
      .map(([a, b]) => (a - b) ** 2)
      .sum()
      .value() ** 0.5
  );
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}
