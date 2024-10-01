const fs = require('fs');
const matrixInverse = require('matrix-inverse');

// Helper function to decode value from a specific base
function decodeValue(base, encodedValue) {
  return parseInt(encodedValue, base);
}

// Function to multiply two matrices
function multiplyMatrices(matrixA, matrixB) {
  const result = new Array(matrixA.length).fill(0).map(() => new Array(matrixB[0].length).fill(0));

  for (let i = 0; i < matrixA.length; i++) {
    for (let j = 0; j < matrixB[0].length; j++) {
      for (let k = 0; k < matrixB.length; k++) {
        result[i][j] += matrixA[i][k] * matrixB[k][j];
      }
    }
  }
  return result;
}

// Function to calculate the inverse of a matrix using the adjugate method
function inverseMatrix(matrix) {
  const inverse = matrixInverse(matrix)
  return inverse;
}

// Function to parse the input JSON and process the points
function readAndProcessInput(jsonData) {
  const points = [];
  const { keys, ...otherData } = jsonData;
  const { n, k } = keys;

  Object.keys(otherData).forEach(key => {
    const x = parseInt(key);  
    const { base, value } = otherData[key];
    const y = decodeValue(base, value);
    points.push([x, y]);
  });

  return points;
}

// Main function to solve the system using matrix inversion
function findSecret(jsonFile) {
  fs.readFile(jsonFile, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    const jsonData = JSON.parse(data);

    const points = readAndProcessInput(jsonData);

    const k = points.length;
    // console.log(points)
    // Set up the matrix equation Ax = b
    const matrix = [];
    const result = [];

    for (let i = 0; i < k; i++) {
      const [x, y] = points[i];
      const row = [];
      for (let j = k - 1; j >= 0; j--) {
        row.push(Math.pow(x, j)); 
      }
      matrix.push(row);
      result.push([y]);
    }

    // Calculate the inverse of the matrix
    const inverse = inverseMatrix(matrix);

    // Multiply the inverse of the matrix by the result vector to get the solution
    const solution = multiplyMatrices(inverse, result);
    // console.log(solution);
    // The constant term c is the last element of the solution array
    const constantTerm = solution[solution.length - 1][0];

    console.log(`The secret (constant term c) for ${jsonFile} is:`, constantTerm);
  });
}

// Run the function on the provided JSON file
const jsonFile1 = "testcase1.json"; 
findSecret(jsonFile1);
const jsonFile2 = "testcase2.json";
findSecret(jsonFile2);
