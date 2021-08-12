
class EquationParser {
    // input is a string
    constructor(input) {
        this.hashMap = {};
        let equation = input.replaceAll(" ", "");
        //do some sort of check

        if (!this.validateEquation(equation)){
            return;
        }

        equation = equation.replaceAll("+", " ");
        equation = equation.replaceAll("-", " -");
        equation = equation.replaceAll("*", "");
        equation = equation.replaceAll("=", " = ");

        let groups = equation.split(" ");
        let chunks = this.getChunks(groups);
        console.log(chunks);   
        
        this.createHashMap(chunks);
    }

    getHashMap = function(){
        return this.hashMap;
    }

    //returns list of strings for each term in the equation
    getChunks = function(groups){
        let rhs = false;
        let chunks = [];

        for (let str of groups){
            if (str.trim().length == 0){
                continue;
            }
            
            if (str === "="){
                rhs = true;
            } else {
                if (rhs && str.match(".*[a-zA-Z].*")){ // negates variables on rhs
                    if (str[0] === "-"){
                        str = str.substring(1);
                    } else {
                        str = "-" + str;
                    }
                }
                if (!rhs && !str.match(".*[a-zA-Z].*")){ //negates constants on lhs
                    if (str[0] === "-"){
                        str = str.substring(1);
                    } else {
                        str = "-" + str;
                    }
                }
                chunks.push(str);
            }
        }
        return chunks;
    }

    //returns a graph of each variable to its corresponding coefficient
    createHashMap = function(chunks){        
        for (let str of chunks){
            str = str.trim();
            let coefficent = "";
            let variable = "{const}";
            let positive = true;

            if (str.length == 0){
                continue;
            }
            
            if (str[0] == "-"){
                positive = false;
            }

            for (let char of str){
                if (!char.match(".*[a-zA-Z].*")){
                    coefficent = coefficent + char;
                } else {
                    variable = char;
                }
            }
            
            //deal with implicit coefficients
            if (coefficent.length == 0 && positive){
                coefficent = "1";
            } else if (coefficent.length == 1 && !positive){
                coefficent = "-1";
            }

            if (variable in this.hashMap){
                this.hashMap[variable] = this.hashMap[variable] + parseFloat(coefficent);
            } else {
                this.hashMap[variable] = parseFloat(coefficent);
            }
        }
    }
    

    validateEquation = function(inputString){
        return inputString.includes("=");
    }
}

