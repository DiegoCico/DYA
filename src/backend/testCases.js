const testCases = {
  add: Array.from({ length: 50 }, (_, i) => {
    const a = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return { inputs: [a, b], expected: a + b };
  }),
  subtract: Array.from({ length: 50 }, (_, i) => {
    const a = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return { inputs: [a, b], expected: a - b };
  }),
  multiply: Array.from({ length: 50 }, (_, i) => {
    const a = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return { inputs: [a, b], expected: a * b };
  }),
  divide: Array.from({ length: 50 }, (_, i) => {
    const a = Math.floor(Math.random() * 100) + 1;
    const b = Math.floor(Math.random() * 100) + 1;
    return { inputs: [a, b], expected: Math.floor(a / b) };
  }),
  power: Array.from({ length: 50 }, (_, i) => {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 5);
    return { inputs: [a, b], expected: Math.pow(a, b) };
  }),
  mod: Array.from({ length: 50 }, (_, i) => {
    const a = Math.floor(Math.random() * 100) + 1;
    const b = Math.floor(Math.random() * 50) + 1;
    return { inputs: [a, b], expected: a % b };
  }),
  concat_strings: Array.from({ length: 50 }, (_, i) => {
    const str1 = Math.random().toString(36).substring(2, 15);
    const str2 = Math.random().toString(36).substring(2, 15);
    return { inputs: [str1, str2], expected: str1 + str2 };
  }),
  find_max: Array.from({ length: 50 }, (_, i) => {
    const a = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return { inputs: [a, b], expected: Math.max(a, b) };
  }),
  is_even: Array.from({ length: 50 }, (_, i) => {
    const a = Math.floor(Math.random() * 100);
    return { inputs: [a], expected: a % 2 === 0 };
  }),
  factorial: Array.from({ length: 50 }, (_, i) => {
    const a = Math.floor(Math.random() * 10);
    const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1);
    return { inputs: [a], expected: factorial(a) };
  }),
};

module.exports = testCases;
