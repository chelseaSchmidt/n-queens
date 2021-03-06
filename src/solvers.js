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
  let solution = new Board({n: n});
  //set up a out of bounds storage object or array
  let outOfBoundsCol = [];
  //set up a storage for inbounds columns as an array of valid column indices (1 to n-1)
  let inBoundsCol = _.range(1, solution.get('n'));
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
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution.rows()));
  return solution.rows();
};

window.countNRooksSolutions = function(n) {
  //set up variables for closure function to access
  var solutionCount = 0;
  let validColumns = _.range(0, n);
  var board = new Board({'n': n});

  //call function to mutate solutionCount
  solutionCount = findSolutions(0, validColumns);

  //definition of recursive function that will mutate solutionCount
  function findSolutions(rowIndex, validCols) {
    let solutions = 0;
    if (rowIndex === n) {
      return 1;
    } else
    if (validCols.length === 0) {
      return 0;
    } else {
    for (let i = 0; i < validCols.length; i++) {
    // validCols.forEach(function(colIndex, i, collection) {
      let colIndex = validCols[i];
      board.togglePiece(rowIndex, colIndex);
      let invalidIndex = validCols.indexOf(colIndex);
      let newValidCols = validCols.slice();
      newValidCols.splice(invalidIndex, 1); //mutates original array, deletes used up value
      solutions += findSolutions(rowIndex + 1, newValidCols);
    // });
    }
    }
    return solutions;
  }

  //once recursive calls complete, return overall solutionCount
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  if (n === 0) {
    return [];
  }
  if (n === 1) {
    return [[1]];
  }
  let validColumns = _.range(0, n);

  let solutions = tryCombinations(new Board({n: n}), 0, validColumns);

  solutions = solutions.map(solution => solution.rows());

  let solution = solutions[0];

  if (solutions.length === 0) {
    solution = new Board({n: n}).rows();
  }

  function tryCombinations(board, rowIndex, validCols) {
    let solutions = [];

    if (validCols.length === 0) {
      if (rowIndex === n) {
        if (!board.hasAnyQueensConflicts()) {
          solutions.push(board);
        }
      }
    } else {
      if (solutions.length !== 1) {
        for (let colIndex of validCols) {
          if (solutions.length !== 1) {

            //reset board as needed from last failed permutation
            let currentRow = board.get(rowIndex);
            for (let i = 0; i < currentRow.length; i++) {
              if (currentRow[i] === 1) {
                board.togglePiece(rowIndex, i);
              }
            }

            //set a piece at current R:C
            board.togglePiece(rowIndex, colIndex);

            //get copy of valid columns and remove column just placed
            let invalidIndex = validCols.indexOf(colIndex);
            let newValidCols = validCols.slice();
            newValidCols.splice(invalidIndex, 1);

            //concat recurse on incremented row, new valid columns, and current board
            solutions = solutions.concat(tryCombinations(board, rowIndex + 1, newValidCols));
          }
        }
      }
    }
    //return solutions array
    return solutions;
  }

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  if (n === 0) {
    return 1;
  }
  //set up variables for closure function to access
  var solutionCount = 0;
  let validColumns = _.range(0, n);
  var board = new Board({'n': n});

  //call function to mutate solutionCount
  solutionCount = findSolutions(0, validColumns, board);

  //definition of recursive function that will mutate solutionCount
  function findSolutions(rowIndex, validCols, board) {
    let solutions = 0;
    if (rowIndex === n) {
      if (board.hasAnyQueensConflicts()) {
        return 0;
      } else {
        let numPieces = _.reduce(board.rows(), function(memo, row) {
          return memo + _.reduce(row, function(memo, col) {
            return memo + col;
          }, 0);
        }, 0);
        if (numPieces < n) {
          return 0;
        }
        return 1;
      }
    } else if (validCols.length === 0) {
      return 0;
    } else {

      for (let i = 0; i < validCols.length; i++) {

        //reset board
        if (validCols.length > 0) {
          let currentRow = board.get(rowIndex);
          for (let i = 0; i < currentRow.length; i++) {
            if (currentRow[i] === 1) {
              board.togglePiece(rowIndex, i);
            }
          }
        }

        //toggle pieces
        let colIndex = validCols[i];
        board.togglePiece(rowIndex, colIndex);
        let invalidIndex = validCols.indexOf(colIndex);
        let newValidCols = validCols.slice();
        newValidCols.splice(invalidIndex, 1); //mutates original array, deletes used up value
        solutions += findSolutions(rowIndex + 1, newValidCols, board);
      }
    }

    return solutions;
  }

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
