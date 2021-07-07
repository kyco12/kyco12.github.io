

function Field(_width, _height, _density){
    this.width = _width
    this.height = _height
    this.density = floor(_density)
    this.field = []

    this.show = function(){
        for (let i = 0; i < this.field.length; i++){
            this.field[i].show()
        }
    }

    this.update = function(particles){
        this.field = []
        for(let w = 0; w < width; w = w + this.density){
            for (let h = 0; h < height; h = h + this.density){
                let root = createVector(w, h)
                let direction = createVector(w + this.density, h + this.density)
                this.field.push(new Arrow(root, direction, 20, 'black'))
            }
        }
        
        this.field.forEach(arrow => {
            let force = arrow.superposition(particles)
            let newColor = color('black')
            if (particles.length > 0){
                newColor.setAlpha(10 + force.mag() * 1000)
            } else {
                newColor.setAlpha(0)
            }
            arrow.col = newColor
            arrow.applyForce(force)
        });
    }

    this.setDensity = function(density){
        this.density = density
    }
}