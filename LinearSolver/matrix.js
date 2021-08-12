

class Matrix{
    
    //array needs to be 2D. for 1D array use [[...]]
    //needn to validate in constructor

    //returns a deep copy of the matrix
    static copy = function(list){
        let copy = [];
    
        for (let r = 0; r < list.length; r++){
            let row = [];
            for (let c = 0; c < list[0].length; c++){
                row.push(list[r][c]);
            }
            copy.push(row);
        }
        return copy;
    }

    static rowSwap = function(inMatrix, row1, row2){

        if (row1 == row2){
            return inMatrix;
        }

        let matrix = this.copy(inMatrix);
        let cols = matrix[0].length;

        for (let i = 0; i < cols; i++){
            let temp = matrix[row1][i];
            matrix[row1][i] = matrix[row2][i]
            matrix[row2][i] = temp;
        }

        return matrix;
    }

    static rowAdd = function(inMatrix, row1, row2){
        let matrix = this.copy(inMatrix);
        let cols = matrix[0].length;

        for (let i = 0; i < cols; i++){
            matrix[row1][i] = matrix[row1][i] + matrix[row2][i]
        }

        return matrix;
    }

    static rowScale = function(inMatrix, scalar, row){
        let matrix = this.copy(inMatrix);
        let cols = matrix[0].length;

        for (let i = 0; i < cols; i++){
            matrix[row][i] = scalar * matrix[row][i]
        }

        return matrix;
    }

    static rowScaleAdd = function(inMatrix, scalar, row1, row2){

        if (row1 == row2){
            return inMatrix;
        }

        let matrix = (inMatrix);
        let cols = matrix[0].length;

        for (let i = 0; i < cols; i++){
            console.log(matrix[row2][i] == null);
            matrix[row1][i] = matrix[row1][i] + scalar * matrix[row2][i]
        }

        return matrix;
    }

    static rref = function(matrix){
        return this.ref_it(matrix);
     
    }

    static ref_rec = function(inMatrix){
        
    }

    static hasLeadingZeros = function(matrix, row, col){
        for (let c = 0; c < col; c++){
            if (matrix[row][c] != 0.0){
                return false;
            }
        }
        return true;
    }

    //I think this is working, but need to test it
    // do something about floating point precision
    static ref_it(inMatrix) {
        let matrix = this.copy(inMatrix);
        let rows = matrix.length;
        let cols = matrix[0].length;

        for (let c = 0; c < cols; c++){

            let pivot = 0;
            let scalar = 1;
            for (let r = c; r < rows; r++){
                if (matrix[r][c] != 0.0) { //need to fix for floating point
                    pivot = r;
                    scalar = matrix[r][c];
                    break;
                }
            }
            matrix = this.rowScale(matrix, 1/scalar, pivot);
            if (pivot != c){ //row swap using c
                //matrix = this.rowSwap(matrix, c, pivot);
            }

            if (c === cols - 1){
                return matrix;
            }

            for (let r = 0; r < matrix.length; r++){
                if (matrix[r][c] != 0.0){
                    scalar = -matrix[r][c];
                    matrix = this.rowScaleAdd(matrix, scalar, r, c);
                }
            }
        }
        return matrix;
    } 

    //untested
    static isConsistent = function(matrix){
        let rref = this.rref(matrix);
        let rows = rref.length;

        for (let r = 0; r < rows; r++){

            let consecutiveZeros = 0; 
            while (rref[r][consecutiveZeros] == 0.0){
                consecutiveZeros++;
            }
            if (c == rref[0].length - 1){
                return false;
            }
        }
        return true;
    }

    //needs optimizations, untested
    static isLinearlyDependant = function(matrix){
        let rref = this.rref(matrix);
        let rows = rref.length;
        let cols = rref[0].length;

        for (let r = 0; r < rows; r++){
            let numZeros = 0;
            for (let c = 0; c < cols; c++){
                if (rref[r][c] == 0.0){
                    numZeros++;
                }
                if (numZeros === cols){
                    return true;
                }
            }
        }
        return false;
    }

    //precondition matrix is at least size row x col ~ need to fix
    static submatrix = function(matrix, row, col){
        let submatrix = [];
        let rows = matrix.length;
        let cols = matrix[0].length;
        for (let r = 0; r < rows; r++){
            let list = [];
            for (let c = 0; c < cols; c++){
                if (c != col && r != row){
                    list.push(matrix[r][c]);
                }
            }
            if (list.length > 0){
                submatrix.push(list);
            }
        }
        return submatrix;
    }

    //square matrix
    static det = function(matrix){
        let rows = matrix.length;
        let cols = matrix[0].length;
        if (rows != cols){
            return
        }
        let n = rows;
        if (n > 1){ 
            for (let r = 0; r < n; r++){
                let submatrix = this.submatrix(matrix, 0, 0);
                return matrix[0][0] * Math.pow(-1, r) * this.det(submatrix);
            }

        } else { //matrix is 1x1
            return matrix[0][0]; 
        }

    }

    static isLinearlyIndependant = function(matrix){
    
    }

    
}