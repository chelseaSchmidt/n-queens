// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      //get the row at the input rowIndex
      var currentRow = this.get(rowIndex);
      //reduce the array to its sum
      var currentRowSum = currentRow.reduce(function(sum, chessSquare) {
        return sum + chessSquare;
      }, 0);
      //if the sum is greater than 1
      if (currentRowSum > 1) {
        //return true
        return true;
      } else {
        //else return false
        return false;
      }
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      //make grid  variable
      var grid = this.rows();
      //for var i row in the board
      for (var i = 0; i < grid.length; i++) {
        var row = grid[i];
        //if we call the has row conflict function on current row
        if (this.hasRowConflictAt(i)) {
          //if true return out early of the loop and return true;
          return true;
        }
      }
      //return false
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      //get entire grid from this instance
      let grid = this.rows();
      //declare sum variable
      let sum = 0;
      //for each inner array of this grid...
      for (let row of grid) {
        //add the current row at column index value to sum
        sum += row[colIndex];
        //if sum variable is greater than 1
        if (sum > 1) {
          //return true
          return true;
        }
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      //create a column counter variable
      let colIndex = 0;
      //while counter is less than n...
      while (colIndex < this.get('n')) {
        //if invocation of hasColConflictAt on this instance, passing in counter index, returns true
        if (this.hasColConflictAt(colIndex)) {
          //return true
          return true;
        }
        //increment counter
        colIndex++;
      }
      return false;
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    // J : Checking to see if there is there are any conflicts (sum of diagonal is greater than 1) at passed in given column index of passed in first row. Sum of diagonal: value at row 1 at given index; value at starting row + 1 at given index; etc. through column index n - 1
    // I : number value corresponding to a column index at a given row
    // O : boolean
    // C : same as others
    // E : within bounds 0 - n;
    // E : sum up the values starting at row 1 at given column index; each subsequent row at given index + 1; continue to end of columns. If sum greater than 1, return true
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow, rowIndex = 0) {
      //make sum variable
      let sum = 0;
      //set necessary distance to n - long variable
      let endRow = this.get('n') - 1 - majorDiagonalColumnIndexAtFirstRow;
      //get grid
      let grid = this.rows();
      //for each row of grid, until we hit necessary distance... (i is row position, col position is long variable)
      while (rowIndex <= endRow) {
        //add the value at given column index to sum
        sum += grid[rowIndex][majorDiagonalColumnIndexAtFirstRow];
        //if sum is greater than 1,
        if (sum > 1) {
          //return true
          return true;
        }
        //increment long col variable
        majorDiagonalColumnIndexAtFirstRow++;
        //increment row towards end
        rowIndex++;
      }
      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      //specification:
      //I: nothing
      //O: boolean
      //C: ... linear
      //E: same, stay within bounds or empty grid
      //explanation: we will check the instance of the board for each row we will check each column position until the ending row. if any of the row checks return true; end the loop and return true. otherwise we get to the end and there are no conflicts.

      //get grid assign variable
      let grid = this.rows();
      //for each row in the grid
      for (var i = 0; i < grid.length; i++) {
        //if the call to hasmajorconflictdiagnonalAt on current row index, 0 - is true;
        for (var j = 0; j <grid.length; j++) {
          if (this.hasMajorDiagonalConflictAt(j, i)) {
            //return true;
            return true;
          }
        }
      }
      return false; // fixme
    },

    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
