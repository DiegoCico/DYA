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

// Use CORS middleware
app.use(cors());
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
  res.send({ message: 'Server is running' });
});

app.post('/run-code', (req, res) => {
  const { userCode, language } = req.body;
  const uniqueId = uuidv4().replace(/-/g, '_');

  if (language === 'Java') {
    const javaFileName = `Temp_${uniqueId}.java`;
    const javaClassName = `Temp_${uniqueId}`;
    const javaCode = `
public class ${javaClassName} {
  ${userCode}
  public static void main(String[] args) {
    // Example main method call, you may need to adjust this based on userCode
    System.out.println(${javaClassName}.mod(2, 3)); // Replace with actual method call
  }
}
`;
    fs.writeFileSync(javaFileName, javaCode);

    exec(`javac --enable-preview -source 21 ${javaFileName}`, (error, stdout, stderr) => {
      if (error) {
        fs.unlinkSync(javaFileName);
        return res.json({ error: stderr });
      } else {
        exec(`java --enable-preview ${javaClassName}`, (error, stdout, stderr) => {
          fs.unlinkSync(javaFileName);
          fs.unlinkSync(`${javaClassName}.class`);
          if (error) {
            return res.json({ error: stderr });
          } else {
            return res.json({ output: stdout });
          }
        });
      }
    });
  } else {
    return res.json({ error: `Unsupported language ${language}` });
  }
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
      const uniqueId = uuidv4().replace(/-/g, '_');

      if (language === 'Python') {
        const pythonCode = `
${userCode}
print(${functionName}(${inputs.join(', ')}))
        `;
        const pythonFileName = `temp_${uniqueId}.py`;

        fs.writeFileSync(pythonFileName, pythonCode);

        exec(`python3 ${pythonFileName}`, (error, stdout, stderr) => {
          fs.unlinkSync(pythonFileName);
          if (error) {
            resolve({ inputs, expected, actual: stderr, passed: false, message: stderr });
          } else {
            const actual = stdout.trim();
            const passed = actual == expected;
            resolve({ inputs, expected, actual, passed, message: passed ? 'Test passed' : 'Test failed' });
          }
        });
      } else if (language === 'Java') {
        const javaClassName = `Temp_${uniqueId}`;
        const javaCode = `
public class ${javaClassName} {
  ${userCode}

  public static void main(String[] args) {
    System.out.println(new ${javaClassName}().${functionName}(${inputs.map(input => JSON.stringify(input)).join(', ')}));
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
