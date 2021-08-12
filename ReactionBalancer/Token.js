class Token {
    constructor(type, value){
        this.type = type;
        this.value = value;
    }


    toString = function(){
        return `Token(${this.type}, ${this.value})`;
    }

}