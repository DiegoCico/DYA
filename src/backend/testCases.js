const testCases = {
  add: Array.from({ length: 50 }, () => {
    const a = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return { inputs: [a, b], expected: a + b };
  }),
  subtract: Array.from({ length: 50 }, () => {
    const a = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return { inputs: [a, b], expected: a - b };
  }),
  multiply: Array.from({ length: 50 }, () => {
    const a = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return { inputs: [a, b], expected: a * b };
  }),
  divide: Array.from({ length: 50 }, () => {
    const a = Math.floor(Math.random() * 100) + 1;
    const b = Math.floor(Math.random() * 100) + 1;
    return { inputs: [a, b], expected: Math.floor(a / b) };
  }),
  power: Array.from({ length: 50 }, () => {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 5);
    return { inputs: [a, b], expected: Math.pow(a, b) };
  }),
  mod: Array.from({ length: 50 }, () => {
    const a = Math.floor(Math.random() * 100) + 1;
    const b = Math.floor(Math.random() * 50) + 1;
    return { inputs: [a, b], expected: a % b };
  }),
  concatStrings: Array.from({ length: 50 }, () => {
    const str1 = Math.random().toString(36).substring(2, 15);
    const str2 = Math.random().toString(36).substring(2, 15);
    return { inputs: [str1, str2], expected: str1 + str2 };
  }),
  findMax: Array.from({ length: 50 }, () => {
    const a = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return { inputs: [a, b], expected: Math.max(a, b) };
  }),
  isEven: Array.from({ length: 50 }, () => {
    const a = Math.floor(Math.random() * 100);
    return { inputs: [a], expected: a % 2 === 0 };
  }),
  factorial: Array.from({ length: 50 }, () => {
    const a = Math.floor(Math.random() * 10);
    const factorial = (n) => n <= 1 ? 1 : n * factorial(n - 1);
    return { inputs: [a], expected: factorial(a) };
  }),
  stringLength: Array.from({ length: 50 }, () => {
    const str = Math.random().toString(36).substring(2, 15);
    return { inputs: [str], expected: str.length };
  }),
  reverseString: Array.from({ length: 50 }, () => {
    const str = Math.random().toString(36).substring(2, 15);
    return { inputs: [str], expected: str.split('').reverse().join('') };
  }),
  toUpperCase: Array.from({ length: 50 }, () => {
    const str = Math.random().toString(36).substring(2, 15);
    return { inputs: [str], expected: str.toUpperCase() };
  }),
  toLowerCase: Array.from({ length: 50 }, () => {
    const str = Math.random().toString(36).substring(2, 15);
    return { inputs: [str], expected: str.toLowerCase() };
  }),
  isPalindrome: Array.from({ length: 50 }, () => {
    const str = Math.random().toString(36).substring(2, 7);
    const reversed = str.split('').reverse().join('');
    return { inputs: [str], expected: str === reversed };
  }),
  replaceSubstring: Array.from({ length: 50 }, () => {
    const str = Math.random().toString(36).substring(2, 15);
    const substr = str.substring(2, 5);
    const replacement = Math.random().toString(36).substring(2, 5);
    const result = str.replace(substr, replacement);
    return { inputs: [str, substr, replacement], expected: result };
  }),
  findSubstring: Array.from({ length: 50 }, () => {
    const str = Math.random().toString(36).substring(2, 15);
    const substr = str.substring(2, 5);
    return { inputs: [str, substr], expected: str.indexOf(substr) };
  }),
  splitString: Array.from({ length: 50 }, () => {
    const str = Math.random().toString(36).substring(2, 15);
    const delimiter = str[3];
    const result = str.split(delimiter);
    return { inputs: [str, delimiter], expected: result };
  }),
  joinStrings: Array.from({ length: 50 }, () => {
    const arr = Array.from({ length: 5 }, () => Math.random().toString(36).substring(2, 7));
    const delimiter = '-';
    const result = arr.join(delimiter);
    return { inputs: [arr, delimiter], expected: result };
  }),
  addItem: Array.from({ length: 50 }, () => {
    const list = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    const item = Math.floor(Math.random() * 100);
    return { inputs: [list, item], expected: [...list, item] };
  }),
  removeItem: Array.from({ length: 50 }, () => {
    const list = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    const item = list[2];
    const result = list.filter(i => i !== item);
    return { inputs: [list, item], expected: result };
  }),
  findIndex: Array.from({ length: 50 }, () => {
    const list = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    const item = list[2];
    return { inputs: [list, item], expected: list.indexOf(item) };
  }),
  sortList: Array.from({ length: 50 }, () => {
    const list = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    const result = [...list].sort((a, b) => a - b);
    return { inputs: [list], expected: result };
  }),
  reverseList: Array.from({ length: 50 }, () => {
    const list = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    const result = [...list].reverse();
    return { inputs: [list], expected: result };
  }),
  mergeLists: Array.from({ length: 50 }, () => {
    const list1 = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    const list2 = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    const result = [...list1, ...list2];
    return { inputs: [list1, list2], expected: result };
  }),
  maxValue: Array.from({ length: 50 }, () => {
    const list = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    const result = Math.max(...list);
    return { inputs: [list], expected: result };
  }),
  minValue: Array.from({ length: 50 }, () => {
    const list = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    const result = Math.min(...list);
    return { inputs: [list], expected: result };
  }),
  countOccurrences: Array.from({ length: 50 }, () => {
    const list = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    const item = list[2];
    const result = list.filter(i => i === item).length;
    return { inputs: [list, item], expected: result };
  }),
  removeDuplicates: Array.from({ length: 50 }, () => {
    const list = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10));
    const result = [...new Set(list)];
    return { inputs: [list], expected: result };
  }),
  addKeyValue: Array.from({ length: 50 }, () => {
    const map = {};
    const key = Math.random().toString(36).substring(2, 7);
    const value = Math.floor(Math.random() * 100);
    const result = { ...map, [key]: value };
    return { inputs: [map, key, value], expected: result };
  }),
  removeKeyValue: Array.from({ length: 50 }, () => {
    const key = Math.random().toString(36).substring(2, 7);
    const map = { [key]: Math.floor(Math.random() * 100) };
    const result = { ...map };
    delete result[key];
    return { inputs: [map, key], expected: result };
  }),
  findValue: Array.from({ length: 50 }, () => {
    const key = Math.random().toString(36).substring(2, 7);
    const value = Math.floor(Math.random() * 100);
    const map = { [key]: value };
    return { inputs: [map, key], expected: value };
  }),
  mergeMaps: Array.from({ length: 50 }, () => {
    const map1 = { a: 1, b: 2 };
    const map2 = { b: 3, c: 4 };
    const result = { ...map1, ...map2 };
    return { inputs: [map1, map2], expected: result };
  }),
  keyExists: Array.from({ length: 50 }, () => {
    const key = Math.random().toString(36).substring(2, 7);
    const map = { [key]: Math.floor(Math.random() * 100) };
    return { inputs: [map, key], expected: true };
  }),
  getKeys: Array.from({ length: 50 }, () => {
    const map = { a: 1, b: 2, c: 3 };
    const result = Object.keys(map);
    return { inputs: [map], expected: result };
  }),
  getValues: Array.from({ length: 50 }, () => {
    const map = { a: 1, b: 2, c: 3 };
    const result = Object.values(map);
    return { inputs: [map], expected: result };
  }),
  maxValueKey: Array.from({ length: 50 }, () => {
    const map = { a: 1, b: 3, c: 2 };
    const maxKey = Object.keys(map).reduce((a, b) => (map[a] > map[b] ? a : b));
    return { inputs: [map], expected: maxKey };
  }),
  invertMap: Array.from({ length: 50 }, () => {
    const map = { a: 1, b: 2, c: 3 };
    const result = Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]));
    return { inputs: [map], expected: result };
  }),
  sortByKeys: Array.from({ length: 50 }, () => {
    const map = { b: 2, c: 3, a: 1 };
    const result = Object.keys(map)
      .sort()
      .reduce((acc, key) => {
        acc[key] = map[key];
        return acc;
      }, {});
    return { inputs: [map], expected: result };
  }),
  addElement: Array.from({ length: 50 }, () => {
    const set = new Set(Array.from({ length: 5 }, () => Math.floor(Math.random() * 100)));
    const element = Math.floor(Math.random() * 100);
    const result = new Set(set);
    result.add(element);
    return { inputs: [set, element], expected: result };
  }),
  removeElement: Array.from({ length: 50 }, () => {
    const element = Math.floor(Math.random() * 100);
    const set = new Set([element, ...Array.from({ length: 4 }, () => Math.floor(Math.random() * 100))]);
    const result = new Set(set);
    result.delete(element);
    return { inputs: [set, element], expected: result };
  }),
  unionSets: Array.from({ length: 50 }, () => {
    const set1 = new Set(Array.from({ length: 5 }, () => Math.floor(Math.random() * 100)));
    const set2 = new Set(Array.from({ length: 5 }, () => Math.floor(Math.random() * 100)));
    const result = new Set([...set1, ...set2]);
    return { inputs: [set1, set2], expected: result };
  }),
  intersectionSets: Array.from({ length: 50 }, () => {
    const set1 = new Set([1, 2, 3, 4, 5]);
    const set2 = new Set([3, 4, 5, 6, 7]);
    const result = new Set([...set1].filter(x => set2.has(x)));
    return { inputs: [set1, set2], expected: result };
  }),
  differenceSets: Array.from({ length: 50 }, () => {
    const set1 = new Set([1, 2, 3, 4, 5]);
    const set2 = new Set([3, 4, 5, 6, 7]);
    const result = new Set([...set1].filter(x => !set2.has(x)));
    return { inputs: [set1, set2], expected: result };
  }),
  isSubset: Array.from({ length: 50 }, () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([1, 2, 3, 4, 5]);
    return { inputs: [set1, set2], expected: true };
  }),
  isSuperset: Array.from({ length: 50 }, () => {
    const set1 = new Set([1, 2, 3, 4, 5]);
    const set2 = new Set([1, 2, 3]);
    return { inputs: [set1, set2], expected: true };
  }),
  clearSet: Array.from({ length: 50 }, () => {
    const set = new Set([1, 2, 3, 4, 5]);
    return { inputs: [set], expected: new Set() };
  }),
  lengthSet: Array.from({ length: 50 }, () => {
    const set = new Set([1, 2, 3, 4, 5]);
    return { inputs: [set], expected: set.size };
  }),
  listToSet: Array.from({ length: 50 }, () => {
    const list = [1, 2, 2, 3, 4, 5];
    return { inputs: [list], expected: new Set(list) };
  }),
};

module.exports = testCases;
