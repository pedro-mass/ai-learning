require("@tensorflow/tfjs-node");
const tf = require("@tensorflow/tfjs");
const loadCSV = require("./load-csv");

/**
 * steps:
 * 1. find distances
 * 2. sort them
 * 3. get the top k records
 * 4. find the average of the values
 */
function knn(features, labels, predictionPoint, k) {
  // tf.moments() => gives { mean, variance }
  // Standard Deviation = sqrt(variance)
  const { mean, variance } = tf.moments(features, 0);
  const standardDeviation = variance.pow(0.5);
  const scale = point => standardize(point, mean, standardDeviation);

  return (
    scale(features)
      .sub(scale(predictionPoint))
      .pow(2)
      .sum(1)
      .pow(0.5)
      .expandDims(1)
      .concat(labels, 1)
      .unstack()
      .sort((a, b) => (a.get(0) > b.get(0) ? 1 : -1))
      .slice(0, k)
      .reduce((acc, pair) => acc + pair.get(1), 0) / k
  );
}

// standardization = (value - average) / Standard Deviation
function standardize(point, mean, standardDeviation) {
  return point.sub(mean).div(standardDeviation);
}

let { features, labels, testFeatures, testLabels } = loadCSV(
  "kc_house_data.csv",
  {
    shuffle: true,
    splitTest: 10,
    dataColumns: ["lat", "long", "sqft_lot"],
    labelColumns: ["price"]
  }
);

features = tf.tensor(features);
labels = tf.tensor(labels);

testFeatures.forEach((testPoint, i) => {
  const guess = knn(features, labels, tf.tensor(testPoint), 10);
  const expected = testLabels[i][0];
  console.log({
    guess,
    expected,
    error: ((expected - guess) / expected) * 100
  });
});
