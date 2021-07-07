
let k = -9

function Arrow(_base, _dir, _len, _col){
    this.base = _base
    this.dir = _dir
    this.len = _len
    this.col = _col


    this.show = function(){
        push();
        stroke(this.col);
        strokeWeight(3);
        fill(this.col);
        translate(this.base.x, this.base.y);
        let theta = this.dir.heading()
        line(0, 0, this.len*cos(theta), this.len*sin(theta));
        rotate(this.dir.heading());
        let arrowSize = 7;
        translate(this.len - arrowSize, 0);
        triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        pop();
    }

    this.applyForce = function(f){
        this.dir = f.copy()
    }

    this.setLength = function(len){
        this.len = len
    }


    this.getRoot = function(){
        return this.base.copy()
    }

    //returns the direction of the force vector of the field due to a particle
    // need to add color/magnitude stuff later
    this.getForceTo = function(particle){ 
        return particle.pos.copy().sub(this.getRoot())
    }

    //good
    //should return the same as getForceTo if there is 1 particle
    //need to add weight on each added vector proportianal to distance between arrow and particle
    this.superposition = function(particles){
        let forceSum = createVector(0, 0)
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i]
            let r = dist(p.pos.x, p.pos.y, this.base.x, this.base.y)
            if(r > 0){
                forceSum.add(this.getForceTo(p).mult(k * p.charge / (r * r)))
            } 
        }
        return forceSum.copy()
    }

}