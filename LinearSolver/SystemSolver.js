let count = 0;

class SystemSolver {

    constructor(equations){       
        this.systemVariables = this.getAllVariables(equations);
        //might move error stuff to solve
        if (this.systemVariables.length - 1 < equations.length){
            throw "system overconstrained" //do error stuff
        } else if (this.systemVariables.length - 1 > equations.length){
            throw "system underconstrained";
        }

        this.systemVariables.sort();

        let system = []
        for (let eq of equations){
            let row = [];
            let map = eq.getHashMap();
            for (let v of this.systemVariables){
                if (v in map){
                    row.push(map[v]);
                } else {
                    row.push(0.0);
                }
            }
            system.push(row);
        }

        this.system = system;
    }

    getAllVariables = function(equations){
        let vars = [];
        for (let n = 0; n < equations.length; n++){
            let eq = equations[n];
            for (let key of Object.keys(eq.getHashMap())){
                if (!vars.includes(key)){
                    vars.push(key)
                }
            }
        }
        return vars;
    }

    solve = function(){
        let solution = Matrix.rref(this.system);
        console.log(solution);
        let cols = solution[0].length;        
        let map = {};
        for (let i = 0; i < this.systemVariables.length - 1; i++){
            map[this.systemVariables[i]] = solution[i][cols - 1];
        }
       return map;
    }
}