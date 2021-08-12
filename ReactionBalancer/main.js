

function main(){
    console.log("hello");
    let rxn = new ReactionParser("Na(O2H)3 + CuCl2 = FeI2 + H2(SO4)2");
}

main();

function isDigit(char) {
    return char >= "0" && char <= "9";
}

function isAlpha(char) {
    return char >= "a" && char <= "z" || char >= "A" && char <= "Z";
}


//need to fix so I can have multiple digit subscripts. check for delimiter +, <->, or front of string
//also include ability to add -,+ for charged molecules/elements (OH)-

//Remove character event
document.getElementById("input_field").onkeydown = function(event){
    let outputField = document.getElementById("output_field");
    if (event.key === "Backspace"){
        outputField.innerHTML = removeChar(outputField.innerHTML);
        return;
    }
}


document.getElementById("input_field").onkeypress = function(event){
    //console.log(event.target); //information about object
    let inputField = document.getElementById("input_field");
    let outputField = document.getElementById("output_field");
    let currentValue = inputField.value.trim();
    
    console.log("current: " + currentValue);

    if (currentValue.length <= 0){
        outputField.innerHTML += event.key;
        return;
    }


    let penultChar = currentValue[currentValue.length - 1]

    if (isDigit(event.key)){
        if (isAlpha(penultChar) || penultChar == ")"){
            outputField.innerHTML += event.key.sub(); 
        } else {
            outputField.innerHTML += event.key;
        }
    } else if (isAlpha(event.key) || event.key === ")" || event.key === "(" || event.key == " " || event.key == "+"){
        //need to check if chemical Abbrev is legit by looking it up in a database
        outputField.innerHTML += event.key;
    } 
    console.log(outputField.innerHTML);
    
};

function removeChar(html){
    let lastChar = html[html.length - 1];

    if (lastChar == ">"){ //<sub>###</sub>
        let count = 0;
        while (count < 2){
            if (lastChar == "<"){
                count++;
            }
            html = html.substring(0, html.length - 1);
            lastChar = html[html.length - 1];
        }
        return html;
    } else {
        return html.substring(0, html.length - 1);
    }
}


document.getElementById("balance_btn").addEventListener("click", function(){
    let input = document.getElementById("input_field").value;
    console.log(input);
    try {
        let interpreter = new Interpreter(input);
        let result = interpreter.expr();
        console.log(result);
    } catch (err){
        console.log(err);
    }
}, false);


