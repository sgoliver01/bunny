export class EggHunt {
    constructor(canvas, keyMap) {
        // save canvas and keyMap as members
        this.canvas = canvas;
        this.keyMap = keyMap;
        
        // save canvas context as member
        this.ctx = canvas.getContext('2d');
        
    }
    
    let square;
    
    init() {
        // set size of canvas
        canvas.width = 240;
        canvas.height = 240;
        
        //compute vertices for the square
        const corner1 = [-10, 0, 10]
        const corner2 = [-10,0, -10]
        const corner3 = [10, 0, -10]
        const corner4 = [10, 0, 10]
        const squarePositionsData = [corner1[0], corner1[1], corner1[2], corner2[0], corner2[1], corner2[2], corner3[0], corner3[1], corner3[2], corner4[0], corner4[1], corner4[2]]
        const squareColorsData = [0,1,0,0,1,0,0,1,0,0,1,0]
        
        this.floor = new TriangleMesh(squarePositionsData, squareColorsData)
        
        
        
    }
    
    mainLoop() {
        
    }
    
    
    update() {
        
        
        
    }
    
    draw() {
       // this.floor.draw()
        
    }
}

class TriangleMesh {
    constructor(positionsData, colorsData) {
        let bunnyRotateY = new vec3.fromValues(0,0,0)
        let bunnyCenter = new vec3.fromValues(0,0,0)
        let bunnyPositionsData = positionsData //convert to typed array
        let bunnyPositionsBuffer = null;
        let bunnyPositionsMemoryID = null;
        let bunnyColorsData = colorsData //convert to typed array
        let bunnyColorsBuffer = null;
        let bunnyColorsMemoryID = null;
        
    }
}
