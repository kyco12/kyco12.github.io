class ReactionParser {
    constructor(str){
        let reaction = str.replaceAll(" ", "");
        reaction = reaction.replaceAll("^", "");
        reaction = reaction.replaceAll("-", "");
        reaction = reaction.replaceAll("+", " ");
        reaction = reaction.replaceAll("=", " = ");

        //modify rxn st there are no leading integers

        let molecules = reaction.split(" ");
        //
        console.log(molecules);
        
        let molarMap = [];
        let rhs = false;

        for (let molecule of molecules){
            if (molecule == "="){
                rhs = true;
                continue;
            }
            molarMap.push(this.getElementsInMolecule(molecule));
            if (rhs){
                let hashMap = molarMap[molarMap.length - 1];
                for (let key in hashMap){
                    hashMap[key] *= -1; //negate everything on rhs
                }
            }
        }
       
        let allElements = this.getAllElements(molarMap);
        
        console.log(molarMap);

    }

    //need to fix so numbers of many digits are parsed
    getElementsInMolecule = function(molecule){
        let elements = [];
        let numElements = 0;
        let molarMap = {}
        for (let i = 0; i < molecule.length; i++){
            let element = molecule[i];

            if (this.isUpper(element) || element == "(" || element == ")"){
                //check if legit element
                elements.push(element); 
                numElements++;
            } else if (this.isLower(element)){
                elements[numElements - 1] += element; //string concatenation
            } else if (this.isNum(element)){
                if (molecule[i - 1] == ")"){
                    let count = elements.length - 1;
                    while (elements[count] != "("){
                        let inParen = elements[count];
                        if (inParen != ")"){
                            if (molarMap[inParen] == undefined){
                                molarMap[inParen] = parseInt(element); 
                            } else {
                                molarMap[inParen] *= parseInt(element);
                            }
                        }
                        count--;
                    }
                } else {
                    molarMap[elements[numElements - 1]] = parseInt(element);
                }
            }
        }
        for (let element of elements){
            if (element != "(" || element != ")"){
                if (molarMap[element] == undefined){
                    molarMap[element] = 1;
                }
            }                
        }
        return molarMap;
    }

    
    getAllElements = function(molarMap){
        let elements = [];

        for (let mol in molarMap){
            for (let key in mol){
                if (!elements.includes(key)){
                    elements.push(key);
                }
            }
        }
        return elements;
    }



    isElement = function(char){
        return char >= "a" && char <= "z" || char >= "A" && char <= "Z";
    }

    isUpper = function(char){
        return char >= "A" && char <= "Z";
    }

    isLower = function(char){
        return char >= "a" && char <= "z";
    }

    isNum = function(char) {
        return char >= "0" && char <= "9";
    }
}



 ///need to deal with = sign and multipliers
        /*
        for (let molecule of molecules){
            let elements = [];
            let numElements = 0;
            
            if (molecule == "="){
                rhs = true;
                continue;
            }
            
            if (!rhs){
                for (let i = 0; i < molecule.length; i++){
                    let element = molecule[i];
                    if (this.isUpper(element) || element == "(" || element == ")"){
                        //check if legit element
                        elements.push(element); 
                        numElements++;
                    } else if (this.isLower(element)){
                        elements[numElements - 1] += element; //string concatenation
                    } else if (this.isNum(element)){
                        if (molecule[i - 1] == ")"){
                            let count = elements.length - 1;
                            while (elements[count] != "("){
                                if (elements[count] != ")"){
                                    molarMap[elements[count]] = parseInt(element); 
                                }
                                count--;
                            }
                        } else {
                            molarMap[elements[numElements - 1]] = parseInt(element);
                        }
                    }
                }
            }

            for (let element of elements){
                if (element != "(" || element != ")"){
                    if (molarMap[element] == undefined){
                        molarMap[element] = 1;
                    }
                }                
            }
            console.log(molarMap);
        }

        */