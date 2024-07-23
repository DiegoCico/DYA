const testCases = {
    add: [
      { inputs: [1, 2], expected: 3 },
      { inputs: [3, 5], expected: 8 },
      { inputs: [-1, -1], expected: -2 },
    ],
    subtract: [
      { inputs: [5, 3], expected: 2 },
      { inputs: [10, 5], expected: 5 },
      { inputs: [0, 0], expected: 0 },
    ],
    multiply: [
      { inputs: [2, 3], expected: 6 },
      { inputs: [4, 5], expected: 20 },
      { inputs: [0, 10], expected: 0 },
    ],
    divide: [
      { inputs: [6, 3], expected: 2 },
      { inputs: [10, 2], expected: 5 },
      { inputs: [9, 3], expected: 3 },
    ],
    power: [
      { inputs: [2, 3], expected: 8 },
      { inputs: [5, 2], expected: 25 },
      { inputs: [10, 0], expected: 1 },
    ],
    mod: [
      { inputs: [10, 3], expected: 1 },
      { inputs: [14, 5], expected: 4 },
      { inputs: [9, 2], expected: 1 },
    ],
    concat_strings: [
      { inputs: ['Hello', 'World'], expected: 'HelloWorld' },
      { inputs: ['foo', 'bar'], expected: 'foobar' },
      { inputs: ['123', '456'], expected: '123456' },
    ],
    find_max: [
      { inputs: [1, 2], expected: 2 },
      { inputs: [10, 5], expected: 10 },
      { inputs: [-1, -10], expected: -1 },
    ],
    is_even: [
      { inputs: [2], expected: true },
      { inputs: [3], expected: false },
      { inputs: [0], expected: true },
    ],
    factorial: [
      { inputs: [3], expected: 6 },
      { inputs: [5], expected: 120 },
      { inputs: [0], expected: 1 },
    ],
  };
  
  module.exports = testCases;
  