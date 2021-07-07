
let particles = []
let field
let gui

let WW = window.innerWidth - 10
let WH = window.innerHeight - 10

function setup() {
    createCanvas(WW, WH)

    field = new Field(WW, WH, 100)
    gui = new GUI(WW, WH)
    initGUI(gui) 
}

function draw() {
    background(230)
    field.show()
    field.update(particles)
    
    for (let i = 0; i < particles.length; i++){
        let p = particles[i]
        p.show() 
        if (gui.animated){
            p.update(particles)
        }
    }

   
    if (millis() % 1000 < 100){
        // console.log(gui.vel_input.value())
        
    }

    displayMotion(particles)
    moveObjects(particles)
}



function displayMotion(particles){
    for (let i = 0; i < particles.length; i++){
        let p = particles[i]
        if (p.clicked){
            //textFont(BOLDITALIC)
            let mass = 1
            if (p.charge > 0){
                mass = 9.1 * pow(10, -31)
            } else {
                mass = 1.67 * pow(10, -27)
            }

            textSize(14)
            let force = superposition(p, particles)
            let accel = force.mult(1 / mass)
            text("Velocity: <" + round(p.vel.x, 2) + ", " + round(p.vel.y, 2) + ">", WW-175, WH-80)
            text("Position: <" + round(p.pos.x) + ", " + round(p.pos.y) + ">", WW-175, WH-50)
            
            text("Acceleration: <" + accel.x + ", " + accel.y + ">", 10, WH-80)
            text("Force: <" + force.x + ", " + force.y + ">", 10, WH-50)
        }
    }
}


function getForceTo(p1, p2){
    force = createVector(0, 0)
    let k = 8.99 * pow(10, 9)
    let e = 1.602 * pow(10, -19)
    let r = dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y)
    if (r > 0){
        force = p1.pos.copy().sub(p2.pos.copy())
        force.setMag(k * p1.charge * p2.charge * e * e / (r * r))
    }
    return force.copy()
}


function superposition(origin, particles){
    let forceSum = createVector(0, 0)
    for (let i = 0; i < particles.length; i++){
        let p = particles[i]
        if (p != origin){
            forceSum.add(getForceTo(origin, p))
        }
    }
    return forceSum
}


function mouseClicked(){
    for (let i = 0; i < particles.length; i++){
        let p = particles[i]
        p.onClicked()
    }
}


/*
Function that handles the clicking and dragging of particles on the canvas
*/
function moveObjects(particles){
    for (let i = 0; i < particles.length; i++){
        let p = particles[i] 
        if (p.select){
            p.moveAt(mouseX, mouseY)
        }
    }
}



/*
Mouse pressed event for particles
*/
function mousePressed(){
    for (let i = 0; i < particles.length; i++){
        particles[i].pressed()
    }
}

/*
mouse released event for particles
*/
function mouseReleased(){
    for (let i = 0; i < particles.length; i++){
        particles[i].released()
    }
}



//need to create a random function that takes into account button locations
/*
This function initializes the event handlers and init state of 
each control in the gui object
*/
function initGUI(gui){

    //button event handlers
    gui.add_p_btn.mousePressed( function(event){
        let particlePos = createVector(random(50, WW - 50), random(50, WH - 50))
        let particleVel = createVector(0, 0)
        particles.push(new Particle(1, particlePos, particleVel, 30, 'white', 1))
    })
    
    gui.add_e_btn.mousePressed( function(event){
        let particlePos = createVector(random(50, WW - 50), random(50, WH - 50))
        let particleVel = createVector(0, 0)
        particles.push(new Particle(-1, particlePos, particleVel, 30, 'white', 1))
    })
    
    gui.remove_btn.mousePressed( function(event){
        if (particles.length > 0){
            particles.pop()
        }
    })
    
    gui.clear_btn.mousePressed( function(event){
        particles = []
    })


    gui.field_sldr.mouseMoved( function(event){
        field.setDensity(gui.field_sldr.value())
    })

    gui.animate_btn.mousePressed(function(event){
        if (gui.animated){
            gui.animated = false
            gui.animate_btn.style('background-color', '#f00000')
        } else {
            gui.animated = true
            gui.animate_btn.style('background-color', '#00f000')
        }
    })

    gui.vel_input.input(function(event) {
        new_vel = gui.check_input(gui.vel_input)
        console.log(new_vel)
        if (new_vel['x'] != NaN && new_vel['y'] != NaN){
            particles.forEach(p => {
                if (p.clicked){
                    p.vel = createVector(new_vel['x'], new_vel['y'])
                }
            })
        }
    })

}



