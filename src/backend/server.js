const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const testCases = require('./testCases');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Use CORS middleware
app.use(cors());
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
  res.send({ message: 'Server is running' });
});

app.post('/test-function', async (req, res) => {
  const { functionName, userCode, language } = req.body;

  // Run the code and get the test results
  const testResults = await runTests(functionName, userCode, language);

  // Emit the test results to the client
  io.emit('test_results', { testResults, success: testResults.every(result => result.passed) });

  res.send({ message: 'Tests are being processed' });
});

const runTests = async (functionName, userCode, language) => {
  if (!testCases[functionName]) {
    return [{ passed: false, message: `No test cases defined for function ${functionName}` }];
  }

  const results = await Promise.all(testCases[functionName].map(testCase => {
    return new Promise((resolve, reject) => {
      const { inputs, expected } = testCase;

      if (language === 'Python') {
        const pythonCode = `
${userCode}
print(${functionName}(${inputs.join(', ')}))
        `;

        exec(`python3 -c "${pythonCode}"`, (error, stdout, stderr) => {
          if (error) {
            resolve({ inputs, expected, actual: stderr, passed: false, message: stderr });
          } else {
            const actual = stdout.trim();
            const passed = actual == expected;
            resolve({ inputs, expected, actual, passed, message: passed ? 'Test passed' : 'Test failed' });
          }
        });
      } else if (language === 'Java') {
        const javaCode = `
public class Temp {
  ${userCode}

  public static void main(String[] args) {
    System.out.println(${functionName}(${inputs.join(', ')}));
  }
}
        `;

        const javaFileName = 'Temp.java';

        fs.writeFileSync(javaFileName, javaCode);

        exec(`javac ${javaFileName}`, (error, stdout, stderr) => {
          if (error) {
            resolve({ inputs, expected, actual: stderr, passed: false, message: stderr });
          } else {
            exec(`java Temp`, (error, stdout, stderr) => {
              if (error) {
                resolve({ inputs, expected, actual: stderr, passed: false, message: stderr });
              } else {
                const actual = stdout.trim();
                const passed = actual == expected;
                resolve({ inputs, expected, actual, passed, message: passed ? 'Test passed' : 'Test failed' });
              }
            });
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
