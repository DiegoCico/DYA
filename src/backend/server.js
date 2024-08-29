const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5002;

// Middleware Setup
app.use(bodyParser.json());
app.use(cors());

// Socket.io Setup
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

/**
 * GET /ping
 * 
 * A simple endpoint to check if the server is running.
 * Returns a "Server is running" message.
 */
app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

/**
 * POST /test-function
 * 
 * This endpoint receives the user's code, the function name, the programming language,
 * and the number of test cases to run. It then executes the code against the specified 
 * test cases and sends the results back via Socket.io.
 * 
 * Request Body:
 * - functionName: The name of the function to be tested.
 * - activityOrder: The order of the activity (used for identifying the activity).
 * - userId: The ID of the user submitting the code.
 * - questionId: The ID of the question associated with the code.
 * - userCode: The code submitted by the user.
 * - language: The programming language of the submitted code (Python, Java, JavaScript).
 * - testCount: The number of test cases to run.
 */
app.post('/test-function', async (req, res) => {
    const { functionName, activityOrder, userId, questionId, userCode, language, testCount } = req.body;

    if (!functionName || !userCode || !language || !testCount || !userId || !questionId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const testResults = await runTests(functionName, userCode, language, testCount);

        // Emit the test results back to the client
        io.emit('test_results', { userId, questionId, testResults, success: testResults.every(result => result.passed) });

        res.status(200).json({ message: 'Tests executed successfully' });
    } catch (error) {
        console.error('Error executing tests:', error);
        res.status(500).json({ message: 'Error executing tests' });
    }
});

/**
 * runTests
 * 
 * This function executes the user's code against a set of test cases. It supports
 * three programming languages: Python, Java, and JavaScript. The function dynamically
 * creates a temporary file with the user's code and the test inputs, executes the file,
 * and compares the output to the expected result.
 * 
 * @param {string} functionName - The name of the function to be tested.
 * @param {string} userCode - The code submitted by the user.
 * @param {string} language - The programming language of the submitted code (Python, Java, JavaScript).
 * @param {number} testCount - The number of test cases to run.
 * @returns {Array} - An array of test results indicating whether each test passed or failed.
 */
const runTests = async (functionName, userCode, language, testCount) => {
    const testResults = [];
    
    for (let i = 1; i <= testCount; i++) {
        const testInput = generateTestInput(i);
        const expectedOutput = generateExpectedOutput(functionName, testInput);

        const tempFileName = `temp_${uuidv4()}.${getFileExtension(language)}`;
        const tempFilePath = `./temp/${tempFileName}`;

        // Write the user's code to a temporary file
        await fs.promises.writeFile(tempFilePath, userCode + '\n' + generateTestWrapper(functionName, testInput, language));

        try {
            const command = getCommand(language, tempFilePath);
            const output = await executeCommand(command);

            const passed = compareOutput(output, expectedOutput);
            testResults.push({ testCase: i, passed, output });

        } catch (error) {
            testResults.push({ testCase: i, passed: false, output: error.message });
        } finally {
            // Clean up the temporary file
            await fs.promises.unlink(tempFilePath);
        }
    }

    return testResults;
};

/**
 * generateTestInput
 * 
 * Generates the input for a given test case.
 * 
 * @param {number} testCaseNumber - The number of the test case.
 * @returns {string} - The input for the test case.
 */
const generateTestInput = (testCaseNumber) => {
    // Generate input based on the test case number (can be customized)
    return `TestInput${testCaseNumber}`;
};

/**
 * generateExpectedOutput
 * 
 * Generates the expected output for a given test case.
 * 
 * @param {string} functionName - The name of the function being tested.
 * @param {string} testInput - The input for the test case.
 * @returns {string} - The expected output for the test case.
 */
const generateExpectedOutput = (functionName, testInput) => {
    // Generate the expected output based on the function and input (can be customized)
    return `ExpectedOutputFor${testInput}`;
};

/**
 * generateTestWrapper
 * 
 * Generates a test wrapper to invoke the user's function with the test input.
 * 
 * @param {string} functionName - The name of the function being tested.
 * @param {string} testInput - The input for the test case.
 * @param {string} language - The programming language of the submitted code.
 * @returns {string} - The code to wrap around the user's function for testing.
 */
const generateTestWrapper = (functionName, testInput, language) => {
    if (language === 'Python') {
        return `${functionName}(${testInput})`;
    } else if (language === 'Java') {
        return `System.out.println(${functionName}(${testInput}));`;
    } else if (language === 'JavaScript') {
        return `console.log(${functionName}(${testInput}));`;
    }
};

/**
 * getFileExtension
 * 
 * Returns the appropriate file extension for the given programming language.
 * 
 * @param {string} language - The programming language.
 * @returns {string} - The file extension.
 */
const getFileExtension = (language) => {
    if (language === 'Python') return 'py';
    if (language === 'Java') return 'java';
    if (language === 'JavaScript') return 'js';
};

/**
 * getCommand
 * 
 * Returns the command to execute the user's code based on the programming language.
 * 
 * @param {string} language - The programming language.
 * @param {string} filePath - The path to the temporary file containing the user's code.
 * @returns {string} - The command to execute the user's code.
 */
const getCommand = (language, filePath) => {
    if (language === 'Python') return `python3 ${filePath}`;
    if (language === 'Java') return `javac ${filePath} && java ${filePath.replace('.java', '')}`;
    if (language === 'JavaScript') return `node ${filePath}`;
};

/**
 * executeCommand
 * 
 * Executes a shell command and returns the output.
 * 
 * @param {string} command - The command to execute.
 * @returns {Promise<string>} - The output of the command.
 */
const executeCommand = (command) => {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            resolve(stdout || stderr);
        });
    });
};

/**
 * compareOutput
 * 
 * Compares the output from the user's code with the expected output.
 * 
 * @param {string} output - The output from the user's code.
 * @param {string} expectedOutput - The expected output.
 * @returns {boolean} - True if the output matches the expected output, otherwise false.
 */
const compareOutput = (output, expectedOutput) => {
    // Allow some tolerance for floating point comparisons
    const tolerance = 1e-10;
    if (!isNaN(parseFloat(output)) && !isNaN(parseFloat(expectedOutput))) {
        return Math.abs(parseFloat(output) - parseFloat(expectedOutput)) < tolerance;
    }
    return output.trim() === expectedOutput.trim();
};

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
