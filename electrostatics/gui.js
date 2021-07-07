let numBtns = 4

function GUI(_width, _height){
    this.width = _width
    this.height = _height
    this.controls = [] // maybe dont use
    this.animated = false

    //global gui control declarations
    this.add_p_btn = createButton("+")
    this.add_e_btn = createButton("—")
    this.remove_btn = createButton("remove")
    this.clear_btn = createButton("clear")
    this.animate_btn = createButton('animate')
    this.field_sldr = createSlider(30, 100, 100, 3)
    this.vel_input = createInput("velocity")

    //setup btn properties
    this.add_p_btn.style('font-size', '34px');
    this.add_p_btn.style('color', '#000000');
    this.add_p_btn.style('background-color', '#ff0000');

    this.add_e_btn.style('font-size', '30px');
    this.add_e_btn.style('color', '#000000');
    this.add_e_btn.style('background-color', '#0000ff');

    this.remove_btn.style('font-size', '24px');
    this.remove_btn.style('color', '#000000');
    this.remove_btn.style('background-color', '#00ff00');

    this.animate_btn.style('font-size', '24px');
    this.animate_btn.style('color', '#000000');
    this.animate_btn.style('background-color', '#f00000')

    //positions
    this.remove_btn.position(0, 0)
    this.add_e_btn.position(100, 0)
    this.add_p_btn.position(200, 0)
    this.clear_btn.position(300, 0)
    this.animate_btn.position(400, 0)

    //size
    this.remove_btn.size(100, 40)
    this.add_e_btn.size(100, 40)
    this.add_p_btn.size(100, 40)
    this.clear_btn.size(100, 40)
    this.animate_btn.size(100, 40)
    this.vel_input.size(100, 20)

    this.field_sldr.position(500, 10)
    this.vel_input.position(650, 10)

    this.check_input = function(input){
        user_input = input.value().trim().split(',')
        if (user_input.length == 2){
            return {"x": parseFloat(user_input[0]), "y": parseFloat(user_input[1])}
        }
        return {"x": NaN, "y": NaN}
    }
}