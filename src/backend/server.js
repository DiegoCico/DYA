const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const testCases = require('./testCases');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
  res.send({ message: 'Server is running' });
});

app.post('/test-function', async (req, res) => {
  const { functionName, userCode, language, testCount } = req.body;
  const allTestCases = testCases[functionName] || [];
  const selectedTestCases = allTestCases.slice(0, testCount);

  const testResults = await runTests(functionName, userCode, language, selectedTestCases);

  io.emit('test_results', { testResults, success: testResults.every(result => result.passed) });

  res.send({ testResults });
});

const runTests = async (functionName, userCode, language, selectedTestCases) => {
  const tolerance = 1e-10; 

  const results = await Promise.all(selectedTestCases.map(testCase => {
    return new Promise((resolve, reject) => {
      const { inputs, expected } = testCase;
      const uniqueId = uuidv4().replace(/-/g, '_');

      if (language === 'Python') {
        const formattedInputs = inputs.map(input => typeof input === 'string' ? `"${input}"` : input).join(', ');
        const pythonCode = `
${userCode}
print(${functionName}(${formattedInputs}))
        `;
        const pythonFileName = `temp_${uniqueId}.py`;

        fs.writeFileSync(pythonFileName, pythonCode);

        exec(`python3 ${pythonFileName}`, (error, stdout, stderr) => {
          fs.unlinkSync(pythonFileName);
          if (error) {
            resolve({ inputs, expected, actual: stderr, passed: false, message: stderr });
          } else {
            const actual = stdout.trim();
            const actualNum = parseFloat(actual);
            const expectedNum = parseFloat(expected);

            const passed = !isNaN(actualNum) && !isNaN(expectedNum)
              ? Math.abs(actualNum - expectedNum) < tolerance
              : actual === expected;

            resolve({ inputs, expected, actual, passed, message: passed ? 'Test passed' : 'Test failed' });
          }
        });
      } else if (language === 'Java') {
        const formattedInputs = inputs.map(input => JSON.stringify(input)).join(', ');
        const javaClassName = `Temp_${uniqueId}`;
        const javaCode = `
public class ${javaClassName} {
  ${userCode}

  public static void main(String[] args) {
    System.out.println(new ${javaClassName}().${functionName}(${formattedInputs}));
  }
}
        `;
        const javaFileName = `${javaClassName}.java`;

        fs.writeFileSync(javaFileName, javaCode);

        exec(`javac --enable-preview -source 21 ${javaFileName}`, (error, stdout, stderr) => {
          if (error) {
            fs.unlinkSync(javaFileName);
            resolve({ inputs, expected, actual: stderr, passed: false, message: stderr });
          } else {
            exec(`java --enable-preview ${javaClassName}`, (error, stdout, stderr) => {
              fs.unlinkSync(javaFileName);
              fs.unlinkSync(`${javaClassName}.class`);
              if (error) {
                resolve({ inputs, expected, actual: stderr, passed: false, message: stderr });
              } else {
                const actual = stdout.trim();
                const actualNum = parseFloat(actual);
                const expectedNum = parseFloat(expected);

                const passed = !isNaN(actualNum) && !isNaN(expectedNum)
                  ? Math.abs(actualNum - expectedNum) < tolerance
                  : actual === expected;

                resolve({ inputs, expected, actual, passed, message: passed ? 'Test passed' : 'Test failed' });
              }
            });
          }
        });
      } else if (language === 'JavaScript') {
        const formattedInputs = inputs.map(input => JSON.stringify(input)).join(', ');
        const jsCode = `
${userCode}
console.log(${functionName}(${formattedInputs}));
        `;
        const jsFileName = `temp_${uniqueId}.js`;

        fs.writeFileSync(jsFileName, jsCode);

        exec(`node ${jsFileName}`, (error, stdout, stderr) => {
          fs.unlinkSync(jsFileName);
          if (error) {
            resolve({ inputs, expected, actual: stderr, passed: false, message: stderr });
          } else {
            const actual = stdout.trim();
            const actualNum = parseFloat(actual);
            const expectedNum = parseFloat(expected);

            const passed = !isNaN(actualNum) && !isNaN(expectedNum)
              ? Math.abs(actualNum - expectedNum) < tolerance
              : actual === expected;

            resolve({ inputs, expected, actual, passed, message: passed ? 'Test passed' : 'Test failed' });
          }
        });
      } else {
        resolve({ passed: false, message: `Unsupported language ${language}` });
      }
    });
  }));

  return results;
};

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
