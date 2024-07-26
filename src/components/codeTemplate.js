export const getCodeTemplate = (functionName, language) => {
  if (language === 'Java') {
    switch (functionName) {
      case 'add':
        return `public static int ${functionName}(int a, int b) {
    return a + b;
}`;
      case 'subtract':
        return `public static int ${functionName}(int a, int b) {
    return a - b;
}`;
      case 'multiply':
        return `public static int ${functionName}(int a, int b) {
    return a * b;
}`;
      case 'divide':
        return `public static int ${functionName}(int a, int b) {
    return a / b;
}`;
      case 'power':
        return `public static int ${functionName}(int a, int b) {
    return (int) Math.pow(a, b);
}`;
      case 'mod':
        return `public static int ${functionName}(int a, int b) {
    return a % b;
}`;
      case 'concat_strings':
        return `public static String ${functionName}(String a, String b) {
    return a + b;
}`;
      case 'find_max':
        return `public static int ${functionName}(int a, int b) {
    return Math.max(a, b);
}`;
      case 'is_even':
        return `public static boolean ${functionName}(int a) {
    return a % 2 == 0;
}`;
      case 'factorial':
        return `public static int ${functionName}(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
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
      case 'concat_strings':
        return `def ${functionName}(a, b):\n    # Write your code here\n    pass`;
      case 'find_max':
        return `def ${functionName}(a, b):\n    # Write your code here\n    pass`;
      case 'is_even':
        return `def ${functionName}(a):\n    # Write your code here\n    pass`;
      case 'factorial':
        return `def ${functionName}(n):\n    # Write your code here\n    pass`;
      default:
        return `# Write your code here\n# You can start coding right away\n# The editor will scroll if the content gets too long\n`;
    }
  }
};
