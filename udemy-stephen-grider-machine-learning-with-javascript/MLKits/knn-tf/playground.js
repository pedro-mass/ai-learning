// paste in: https://stephengrider.github.io/JSPlaygrounds/

// longitude, latitude
const features = tf.tensor([
  [-121, 47],
  [-121.2, 46.5],
  [-122, 46.4],
  [-120.9, 46.7]
]);

// home price
const labels = tf.tensor([[200], [250], [215], [240]]);

const predictionPoint = tf.tensor([-121, 47]);

// distances
const distances = features
  .sub(predictionPoint)
  .pow(2)
  .sum(1)
  .pow(0.5);

const distancesWithLabels = distances.expandDims(1).concat(labels, 1);

const sortedTensors = distancesWithLabels
  .unstack()
  .sort((a, b) => (a.get(0) > b.get(0) ? 1 : -1));

const k = 2;
const topKRecords = sortedTensors.slice(0, k);

const sumLabels = topKRecords.reduce((acc, obj) => acc + obj.get(1), 0);
const average = sumLabels / k;
average;
