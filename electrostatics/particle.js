

function Particle(_charge, _pos, _vel, _r, _col, _mass){    
    this.charge = _charge
    this.pos = _pos
    this.vel = _vel
    this.r = _r
    this.col = _col
    this.mass = _mass
    this.select = false
    this.clicked = false

    this.show = function(){
        push()
        if (this.clicked){
            stroke('orange')
        } else {
            stroke('black')
        }

        strokeWeight(3)
        if (this.charge < 0){
            fill('blue')
            ellipse(this.pos.x, this.pos.y, this.r, this.r)
            translate(this.pos.x, this.pos.y)
            strokeWeight(5)
            stroke('black')
            line(-this.r/4, 0, this.r/4, 0)
        } else {
            fill('red')
            ellipse(this.pos.x, this.pos.y, this.r, this.r)
            translate(this.pos.x, this.pos.y)
            strokeWeight(5)
            stroke('black')
            line(-this.r/4, 0, this.r/4, 0)
            line(0, -this.r/4, 0, this.r/4)
        }
        pop()
    }

    this.isTouching = function(particles){ //also need to check if elements are opposite in charge
        for (let i = 0; i < particles.length; i++){
            let p = particles[i]
            if (p !== this){ //checks reference
                let d = dist(p.pos.x, p.pos.y, this.pos.x, this.pos.y)
                if (d < this.r && this.charge * p.charge < 0){
                    return true
                }
            }
        }
        return false
    }

    
    //need to add parameter particles array
    this.update = function(particles){
        if (particles.length > 0){
            if (!this.isTouching(particles)){
                this.updateVel(this.superposition(particles))
                this.updatePos(particles)
            } else{
                this.vel = createVector(0, 0)
                this.updatePos(particles)
            }  
        }
    }

    //tweak for attraction vs repulsion
    this.getForceTo = function(p){
        let k = 300 //if k is too high the frames won't keep up in between 20000 - 40000
        let r = dist(p.pos.x, p.pos.y, this.pos.x, this.pos.y)
        if (r > 0){
            let force = this.pos.copy().sub(p.pos.copy())
            force.setMag(k * this.charge * p.charge / (r * r)) 
            return force.copy()
        }
        return createVector(0, 0)
    }

    this.superposition = function(particles){
        let forceSum = createVector(0, 0)
        for (let i = 0; i < particles.length; i++){
            forceSum.add(this.getForceTo(particles[i]))
        }
        return forceSum.copy()
    }


    this.updatePos = function(){
        this.pos.x += this.vel.x
        this.pos.y += this.vel.y
    }

    this.updateVel = function(f){
        this.vel.x += f.x / this.mass
        this.vel.y += f.y / this.mass
    }


    //GUI controls
    this.mouseInRange = function(){
        return dist(mouseX, mouseY, this.pos.x, this.pos.y) < this.r / 2
    }

    this.moveAt = function(x, y){
        this.pos.x = x
        this.pos.y = y
    }

    this.onClicked = function(){
        if (this.mouseInRange()){
            this.clicked = true
        } else {
            if (mouseX < 400 || mouseX > 800 || mouseY > 50){
                this.clicked = false
            } 
        }
    }
    


    this.pressed = function(){
        if (this.mouseInRange()){
            this.select = true
        }
    }


    this.released = function(){
        this.select = false
    }
}