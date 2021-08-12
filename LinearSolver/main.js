
let inputFields = [];


function main(){

    //let list = [[1, 2, 3], [4, 0, -2], [7, 0, 9]];
    //console.log(Matrix.rref(list));
    addInputField(inputFields); //theres always at least 1 input field on the screen
}

//change later to get data from all inputFields
function solveLinearSystem(inputFields){
    if (inputFields.length == 0){
        return;
    }

    let system = [];
    for (inputField of inputFields){
        let userInput = inputField.value.trim();
        if (userInput.length != 0){
            system.push(new EquationParser(userInput));
        }
    }

    let solution = new SystemSolver(system);

    let textArea = document.getElementById("console");
    textArea.value = "";
    let map = solution.solve(system);

    for (let key in map){
        textArea.value = textArea.value + key + " = " + map[key] + "\n";
    }

}



function addInputField(inputFields){
    let inputField = document.createElement("input");
    inputField.setAttribute("type", "text");    
    inputFields.push(inputField)
    document.body.appendChild(inputFields[inputFields.length - 1]);
    inputField.className = "input_field";
    let rect = inputField.getBoundingClientRect();
    console.log(rect);
    let xPos = 20 - rect.left;
    let yPos = 30 * (inputFields.length);
    positionElement(inputField, xPos, yPos);
}

function positionElement(element, left, top){
    let transform = `translate(${left}px, ${top}px)`;
    element.style = "border:3px solid #000000";
    element.style.transform = transform;
    // element.size is length of element. .width and .height are only for images
}

function deleteInputField(inputFields){
    if (inputFields.length > 1){
        inputFields.pop().remove();
    }
}

function clearAllInputFields(inputFields){
    for (let inputField of inputFields){
        inputField.value = "";
    }
}

//dynamically create html elements as needed
document.getElementById("add_btn").addEventListener("click", function(){
    addInputField(inputFields);
}, false);

//dynamically delete html elements as needed
document.getElementById("delete_btn").addEventListener("click", function(){
    deleteInputField(inputFields);
}, false);

document.getElementById("clear_btn").addEventListener("click", function(){
    clearAllInputFields(inputFields);
}, false);

document.getElementById("solve_btn").addEventListener("click", function(){
    solveLinearSystem(inputFields);
}, false);

main()