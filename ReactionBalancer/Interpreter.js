
let INTEGER = "INTEGER";

let EOF = "EOF";

let PLUS = "PLUS";
let MINUS = "MINUS";



class Token {
    constructor(type, value){
        this.type = type;
        this.value = value;
    }


    toString = function(){
        return `Token(${this.type}, ${this.value})`;
    }

}


class Interpreter {
    constructor(text){
        this.text = text;
        this.pos = 0;
        this.currentToken = null;
    }

    error = function(){
        throw "error parsing";
    }

    getNextToken = function(){
        let text = this.text;
        
        if (this.pos > text.length - 1){
            return new Token(EOF, null);
        }
        let currentChar = text[this.pos];
    
        //".*[a-zA-Z].*" a-Z

        
        if (currentChar.match("^[0-9]$")){
            let token = new Token(INTEGER, parseInt(currentChar));
            this.pos++;
            return token;
        }    
        
        
        if (currentChar === "+"){
            let token = new Token(PLUS, currentChar);
            this.pos++;
            return token;
        }

        if (currentChar === "-"){
            let token = new Token(MINUS, currentChar);
            this.pos++;
            return token;
        }

        this.error();
    }

    eat = function(tokenType){
        if (this.currentToken.type === tokenType){
            this.currentToken = this.getNextToken();
        } else {
            this.error();
        }
    }

    expr = function(){
        this.currentToken = this.getNextToken();
        
        
        let left = this.currentToken;
        this.eat(INTEGER);

        let op = this.currentToken;
        this.eat(PLUS);

        let right = this.currentToken;
        this.eat(INTEGER);

        let result = left.value + right.value;
        return result;
    }

}