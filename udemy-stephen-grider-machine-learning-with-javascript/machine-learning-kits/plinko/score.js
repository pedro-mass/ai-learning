const outputs = [];
const predictionPoint = 300;
const k = 3;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const bucket = _.chain(outputs)
    .map(([point, bounciness, ballSize, bucket]) => [distance(point), bucket])
    .sortBy(([distance]) => distance)
    .slice(0, k)
    .countBy(([, bucket]) => bucket)
    .toPairs()
    .maxBy(([, count]) => count)
    .first()
    .parseInt()
    .value();

  console.log({ bucket });
}

function distance(pointA, pointB = predictionPoint) {
  return Math.abs(pointA - pointB);
}
