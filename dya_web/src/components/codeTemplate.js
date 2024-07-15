export const getCodeTemplate = (functionName) => {
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
  };
  