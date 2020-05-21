/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other


//j: given n find a single valid arrangement of n rooks on a nXn chessboard, and return that chessboard stringified -- which is an instancnce of Board
  //for each value in the board a 0 represents a not occupied space, a 1 represents a rook
//i: N, determines number of rooks and deimensions of board
//o: return a board instance
//s: creating an ew instance no side effects
//c: perhaps quadratic - nested loops
//e: if n is passed in invalid numbers, or 0, or n is too high, or junk char
//exp: use n to instantiate a board - modify that board and test to find a working solution, if a solution - meaning all rooks have been placed with no conflicts - return the modified board

window.findNRooksSolution = function(n) {
  let solution = new Board({n: n}); //Bug here: solution should be a matrix, not a board instance!
  //set up a out of bounds storage object or array
  let outOfBoundsCol = [];
  //set up a storage for inbounds columns as an array of valid column indices (1 to n-1)
  let inBoundsCol = _.range(1, solution.get('n') - 1);
  //place a rook at row zero column 0;
  solution.togglePiece(0, 0);
  //get grid with this rows method
  let grid = solution.rows();
  //starting at row index 1 for each remaining row...
  for (var row = 1; row < grid.length; row++) {
    //set up a min inbound array var
    let minInboundsIndex;
    //for each inbounds array
    for (var index = 0; index < inBoundsCol.length; index++) {
      //if the index of current inbounds value is -1 in outboudnds array
      if (outOfBoundsCol.indexOf(inBoundsCol[index]) === -1) {
              //set minInbounds value to current inbounds value
          minInboundsIndex = inBoundsCol[index];
        //break ouf the search for the min valid column index
        break;
      }
    }
    //toggle the value of current index at mininbounds column index to 1
    solution.togglePiece(row, minInboundsIndex);
    //update out of bounds storage with current column index
    outOfBoundsCol.push(minInboundsIndex);
  }
  console.log(solution);
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
