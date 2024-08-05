export const getCodeTemplate = (functionName, language) => {
  if (language === 'Java') {
    switch (functionName) {
      case 'add':
        return `public static int ${functionName}(int a, int b) {
    // Write your code here
}`;
      case 'subtract':
        return `public static int ${functionName}(int a, int b) {
    // Write your code here
}`;
      case 'multiply':
        return `public static int ${functionName}(int a, int b) {
    // Write your code here
}`;
      case 'divide':
        return `public static int ${functionName}(int a, int b) {
    // Write your code here
}`;
      case 'power':
        return `public static int ${functionName}(int a, int b) {
    // Write your code here
}`;
      case 'mod':
        return `public static int ${functionName}(int a, int b) {
    // Write your code here
}`;
      case 'concatStrings':
        return `public static String ${functionName}(String a, String b) {
    // Write your code here
}`;
      case 'findMax':
        return `public static int ${functionName}(int a, int b) {
    // Write your code here
}`;
      case 'isEven':
        return `public static boolean ${functionName}(int a) {
    // Write your code here
}`;
      case 'factorial':
        return `public static int ${functionName}(int n) {
    // Write your code here
}`;
      case 'stringLength':
        return `public static int ${functionName}(String a) {
    // Write your code here
}`;
      case 'reverseString':
        return `public static String ${functionName}(String a) {
    // Write your code here
}`;
      case 'toUpperCase':
        return `public static String ${functionName}(String a) {
    // Write your code here
}`;
      case 'toLowerCase':
        return `public static String ${functionName}(String a) {
    // Write your code here
}`;
      case 'isPalindrome':
        return `public static boolean ${functionName}(String a) {
    // Write your code here
}`;
      case 'replaceSubstring':
        return `public static String ${functionName}(String a, String b, String c) {
    // Write your code here
}`;
      case 'findSubstring':
        return `public static int ${functionName}(String a, String b) {
    // Write your code here
}`;
      case 'splitString':
        return `public static String[] ${functionName}(String a, String delimiter) {
    // Write your code here
}`;
      case 'joinStrings':
        return `public static String ${functionName}(String[] a, String delimiter) {
    // Write your code here
}`;
      case 'addItem':
        return `public static void ${functionName}(List<Integer> list, int item) {
    // Write your code here
}`;
      case 'removeItem':
        return `public static void ${functionName}(List<Integer> list, int item) {
    // Write your code here
}`;
      case 'findIndex':
        return `public static int ${functionName}(List<Integer> list, int item) {
    // Write your code here
}`;
      case 'sortList':
        return `public static void ${functionName}(List<Integer> list) {
    // Write your code here
}`;
      case 'reverseList':
        return `public static void ${functionName}(List<Integer> list) {
    // Write your code here
}`;
      case 'mergeLists':
        return `public static List<Integer> ${functionName}(List<Integer> list1, List<Integer> list2) {
    // Write your code here
}`;
      case 'maxValue':
        return `public static int ${functionName}(List<Integer> list) {
    // Write your code here
}`;
      case 'minValue':
        return `public static int ${functionName}(List<Integer> list) {
    // Write your code here
}`;
      case 'countOccurrences':
        return `public static int ${functionName}(List<Integer> list, int item) {
    // Write your code here
}`;
      case 'removeDuplicates':
        return `public static List<Integer> ${functionName}(List<Integer> list) {
    // Write your code here
}`;
      case 'addKeyValue':
        return `public static void ${functionName}(Map<String, Integer> map, String key, int value) {
    // Write your code here
}`;
      case 'removeKeyValue':
        return `public static void ${functionName}(Map<String, Integer> map, String key) {
    // Write your code here
}`;
      case 'findValue':
        return `public static int ${functionName}(Map<String, Integer> map, String key) {
    // Write your code here
}`;
      case 'mergeMaps':
        return `public static Map<String, Integer> ${functionName}(Map<String, Integer> map1, Map<String, Integer> map2) {
    // Write your code here
}`;
      case 'keyExists':
        return `public static boolean ${functionName}(Map<String, Integer> map, String key) {
    // Write your code here
}`;
      case 'getKeys':
        return `public static Set<String> ${functionName}(Map<String, Integer> map) {
    // Write your code here
}`;
      case 'getValues':
        return `public static Collection<Integer> ${functionName}(Map<String, Integer> map) {
    // Write your code here
}`;
      case 'maxValueKey':
        return `public static String ${functionName}(Map<String, Integer> map) {
    // Write your code here
}`;
      case 'invertMap':
        return `public static Map<Integer, String> ${functionName}(Map<String, Integer> map) {
    // Write your code here
}`;
      case 'sortByKeys':
        return `public static Map<String, Integer> ${functionName}(Map<String, Integer> map) {
    // Write your code here
}`;
      case 'addElement':
        return `public static void ${functionName}(Set<Integer> set, int element) {
    // Write your code here
}`;
      case 'removeElement':
        return `public static void ${functionName}(Set<Integer> set, int element) {
    // Write your code here
}`;
      case 'unionSets':
        return `public static Set<Integer> ${functionName}(Set<Integer> set1, Set<Integer> set2) {
    // Write your code here
}`;
      case 'intersectionSets':
        return `public static Set<Integer> ${functionName}(Set<Integer> set1, Set<Integer> set2) {
    // Write your code here
}`;
      case 'differenceSets':
        return `public static Set<Integer> ${functionName}(Set<Integer> set1, Set<Integer> set2) {
    // Write your code here
}`;
      case 'isSubset':
        return `public static boolean ${functionName}(Set<Integer> set1, Set<Integer> set2) {
    // Write your code here
}`;
      case 'isSuperset':
        return `public static boolean ${functionName}(Set<Integer> set1, Set<Integer> set2) {
    // Write your code here
}`;
      case 'clearSet':
        return `public static void ${functionName}(Set<Integer> set) {
    // Write your code here
}`;
      case 'lengthSet':
        return `public static int ${functionName}(Set<Integer> set) {
    // Write your code here
}`;
      case 'listToSet':
        return `public static Set<Integer> ${functionName}(List<Integer> list) {
    // Write your code here
}`;
      default:
        return `// Write your code here\n// You can start coding right away\n// The editor will scroll if the content gets too long\n`;
    }
  } else if (language === 'JavaScript') {
    switch (functionName) {
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
      case 'power':
      case 'mod':
      case 'concatStrings':
        return `function ${functionName}(a, b) {
    // Write your code here
}`;
      case 'findMax':
        return `function ${functionName}(a, b) {
    // Write your code here
}`;
      case 'isEven':
        return `function ${functionName}(a) {
    // Write your code here
}`;
      case 'factorial':
        return `function ${functionName}(n) {
    // Write your code here
}`;
      case 'stringLength':
        return `function ${functionName}(a) {
    // Write your code here
}`;
      case 'reverseString':
        return `function ${functionName}(a) {
    // Write your code here
}`;
      case 'toUpperCase':
        return `function ${functionName}(a) {
    // Write your code here
}`;
      case 'toLowerCase':
        return `function ${functionName}(a) {
    // Write your code here
}`;
      case 'isPalindrome':
        return `function ${functionName}(a) {
    // Write your code here
}`;
      case 'replaceSubstring':
        return `function ${functionName}(a, b, c) {
    // Write your code here
}`;
      case 'findSubstring':
        return `function ${functionName}(a, b) {
    // Write your code here
}`;
      case 'splitString':
        return `function ${functionName}(a, delimiter) {
    // Write your code here
}`;
      case 'joinStrings':
        return `function ${functionName}(a, delimiter) {
    // Write your code here
}`;
      case 'addItem':
        return `function ${functionName}(list, item) {
    // Write your code here
}`;
      case 'removeItem':
        return `function ${functionName}(list, item) {
    // Write your code here
}`;
      case 'findIndex':
        return `function ${functionName}(list, item) {
    // Write your code here
}`;
      case 'sortList':
        return `function ${functionName}(list) {
    // Write your code here
}`;
      case 'reverseList':
        return `function ${functionName}(list) {
    // Write your code here
}`;
      case 'mergeLists':
        return `function ${functionName}(list1, list2) {
    // Write your code here
}`;
      case 'maxValue':
        return `function ${functionName}(list) {
    // Write your code here
}`;
      case 'minValue':
        return `function ${functionName}(list) {
    // Write your code here
}`;
      case 'countOccurrences':
        return `function ${functionName}(list, item) {
    // Write your code here
}`;
      case 'removeDuplicates':
        return `function ${functionName}(list) {
    // Write your code here
}`;
      case 'addKeyValue':
        return `function ${functionName}(map, key, value) {
    // Write your code here
}`;
      case 'removeKeyValue':
        return `function ${functionName}(map, key) {
    // Write your code here
}`;
      case 'findValue':
        return `function ${functionName}(map, key) {
    // Write your code here
}`;
      case 'mergeMaps':
        return `function ${functionName}(map1, map2) {
    // Write your code here
}`;
      case 'keyExists':
        return `function ${functionName}(map, key) {
    // Write your code here
}`;
      case 'getKeys':
        return `function ${functionName}(map) {
    // Write your code here
}`;
      case 'getValues':
        return `function ${functionName}(map) {
    // Write your code here
}`;
      case 'maxValueKey':
        return `function ${functionName}(map) {
    // Write your code here
}`;
      case 'invertMap':
        return `function ${functionName}(map) {
    // Write your code here
}`;
      case 'sortByKeys':
        return `function ${functionName}(map) {
    // Write your code here
}`;
      case 'addElement':
        return `function ${functionName}(set, element) {
    // Write your code here
}`;
      case 'removeElement':
        return `function ${functionName}(set, element) {
    // Write your code here
}`;
      case 'unionSets':
        return `function ${functionName}(set1, set2) {
    // Write your code here
}`;
      case 'intersectionSets':
        return `function ${functionName}(set1, set2) {
    // Write your code here
}`;
      case 'differenceSets':
        return `function ${functionName}(set1, set2) {
    // Write your code here
}`;
      case 'isSubset':
        return `function ${functionName}(set1, set2) {
    // Write your code here
}`;
      case 'isSuperset':
        return `function ${functionName}(set1, set2) {
    // Write your code here
}`;
      case 'clearSet':
        return `function ${functionName}(set) {
    // Write your code here
}`;
      case 'lengthSet':
        return `function ${functionName}(set) {
    // Write your code here
}`;
      case 'arrayToSet':
        return `function ${functionName}(list) {
    // Write your code here
}`;
      default:
        return `// Write your code here\n// You can start coding right away\n// The editor will scroll if the content gets too long\n`;
    }
  } else {
    switch (functionName) {
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
      case 'power':
      case 'mod':
      case 'concatStrings':
        return `def ${functionName}(a, b):\n    # Write your code here\n    pass`;
      case 'findMax':
        return `def ${functionName}(a, b):\n    # Write your code here\n    pass`;
      case 'isEven':
        return `def ${functionName}(a):\n    # Write your code here\n    pass`;
      case 'factorial':
        return `def ${functionName}(n):\n    # Write your code here\n    pass`;
      case 'stringLength':
        return `def ${functionName}(a):\n    # Write your code here\n    pass`;
      case 'reverseString':
        return `def ${functionName}(a):\n    # Write your code here\n    pass`;
      case 'toUpperCase':
        return `def ${functionName}(a):\n    # Write your code here\n    pass`;
      case 'toLowerCase':
        return `def ${functionName}(a):\n    # Write your code here\n    pass`;
      case 'isPalindrome':
        return `def ${functionName}(a):\n    # Write your code here\n    pass`;
      case 'replaceSubstring':
        return `def ${functionName}(a, b, c):\n    # Write your code here\n    pass`;
      case 'findSubstring':
        return `def ${functionName}(a, b):\n    # Write your code here\n    pass`;
      case 'splitString':
        return `def ${functionName}(a, delimiter):\n    # Write your code here\n    pass`;
      case 'joinStrings':
        return `def ${functionName}(a, delimiter):\n    # Write your code here\n    pass`;
      case 'addItem':
        return `def ${functionName}(list, item):\n    # Write your code here\n    pass`;
      case 'removeItem':
        return `def ${functionName}(list, item):\n    # Write your code here\n    pass`;
      case 'findIndex':
        return `def ${functionName}(list, item):\n    # Write your code here\n    pass`;
      case 'sortList':
        return `def ${functionName}(list):\n    # Write your code here\n    pass`;
      case 'reverseList':
        return `def ${functionName}(list):\n    # Write your code here\n    pass`;
      case 'mergeLists':
        return `def ${functionName}(list1, list2):\n    # Write your code here\n    pass`;
      case 'maxValue':
        return `def ${functionName}(list):\n    # Write your code here\n    pass`;
      case 'minValue':
        return `def ${functionName}(list):\n    # Write your code here\n    pass`;
      case 'countOccurrences':
        return `def ${functionName}(list, item):\n    # Write your code here\n    pass`;
      case 'removeDuplicates':
        return `def ${functionName}(list):\n    # Write your code here\n    pass`;
      case 'addKeyValue':
        return `def ${functionName}(map, key, value):\n    # Write your code here\n    pass`;
      case 'removeKeyValue':
        return `def ${functionName}(map, key):\n    # Write your code here\n    pass`;
      case 'findValue':
        return `def ${functionName}(map, key):\n    # Write your code here\n    pass`;
      case 'mergeMaps':
        return `def ${functionName}(map1, map2):\n    # Write your code here\n    pass`;
      case 'keyExists':
        return `def ${functionName}(map, key):\n    # Write your code here\n    pass`;
      case 'getKeys':
        return `def ${functionName}(map):\n    # Write your code here\n    pass`;
      case 'getValues':
        return `def ${functionName}(map):\n    # Write your code here\n    pass`;
      case 'maxValueKey':
        return `def ${functionName}(map):\n    # Write your code here\n    pass`;
      case 'invertMap':
        return `def ${functionName}(map):\n    # Write your code here\n    pass`;
      case 'sortByKeys':
        return `def ${functionName}(map):\n    # Write your code here\n    pass`;
      case 'addElement':
        return `def ${functionName}(set, element):\n    # Write your code here\n    pass`;
      case 'removeElement':
        return `def ${functionName}(set, element):\n    # Write your code here\n    pass`;
      case 'unionSets':
        return `def ${functionName}(set1, set2):\n    # Write your code here\n    pass`;
      case 'intersectionSets':
        return `def ${functionName}(set1, set2):\n    # Write your code here\n    pass`;
      case 'differenceSets':
        return `def ${functionName}(set1, set2):\n    # Write your code here\n    pass`;
      case 'isSubset':
        return `def ${functionName}(set1, set2):\n    # Write your code here\n    pass`;
      case 'isSuperset':
        return `def ${functionName}(set1, set2):\n    # Write your code here\n    pass`;
      case 'clearSet':
        return `def ${functionName}(set):\n    # Write your code here\n    pass`;
      case 'lengthSet':
        return `def ${functionName}(set):\n    # Write your code here\n    pass`;
      case 'listToSet':
        return `def ${functionName}(list):\n    # Write your code here\n    pass`;
      default:
        return `# Write your code here\n# You can start coding right away\n# The editor will scroll if the content gets too long\n`;
    }
  }
};
