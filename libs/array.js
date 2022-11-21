const getColFromTwoDimensionArray = (matrix, col) => {
  let column = [];
  for (let i = 0; i < matrix.length; i++){
     column.push(matrix[i][col]);
  }
  return column;
}

module.exports = {
  getColFromTwoDimensionArray
}