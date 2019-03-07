// paste in: https://stephengrider.github.io/JSPlaygrounds/

const numbers = tf.tensor([[1, 2], [3, 4], [5, 6]]);

const { mean, variance } = tf.moments(numbers, 0);
// variance ^ 0.5 = standard deviation

numbers.sub(mean).div(variance.pow(0.5)); // standard deviation
