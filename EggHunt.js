import { mat4, vec4, vec3 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.3/+esm'

import {bunnyVertices, bunnyNormals} from "./Bunny250t750n.js"
// can download as glMatrix.js for offline use if needed


let gl;
let program;
let square;
let bunny;

export class EggHunt {
    constructor(canvas, keyMap) {
        // save canvas and keyMap as members
        this.canvas = canvas;
        this.keyMap = keyMap;
        // global camera variables
        this.cameraX = 0;
        this.cameraY = .5;
        this.cameraZ = -5;
        // global drawing variables
        
        

        //Step 1: initialize canvas
      //  this.canvas = document.getElementById('demo');
        this.canvas.width = 640;
        this.canvas.height = 480;
        
        // Step 2. initialize webgl context
        gl = this.canvas.getContext('webgl2', {antialias: false} );
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        
    
        // Step 3. one-time compile the basic shader program
        program = this.compileBasicProgram(gl);
        gl.useProgram(program);
        
  
        
        //Step 4: create square data
        const corner1 = [-10, 0, -10]
        const corner2 = [10,0, 10]
        const corner3 = [10, 0, -10]
        const corner4 = [-10, 0, 10]
        
        
//        const squarePositionsData = [corner1[0], corner1[1], corner1[2], corner2[0], corner2[1], corner2[2], corner3[0], corner3[1], corner3[2], corner4[0], corner4[1], corner4[2]]
//        const squareColorsData = [0,1,0,0,1,0,0,1,0,0,1,0]
        
        
        let squarePositionsData = []
        let squareColorsData = []
        
        
        //triangle 1
        squarePositionsData.push(corner1[0], corner1[1], corner1[2],
                                  corner3[0], corner3[1], corner3[2],
                                  corner2[0], corner2[1], corner2[2])
        
        //triangle 2
        squarePositionsData.push(corner1[0], corner1[1], corner1[2],
                                  corner4[0], corner4[1], corner4[2],
                                  corner2[0], corner2[1], corner2[2])
        
        
        squareColorsData.push(0,1,0)
        squareColorsData.push(0,1,0) 
        squareColorsData.push(0,1,0) 
        squareColorsData.push(0,1,0) 
        squareColorsData.push(0,1,0) 
        squareColorsData.push(0,1,0) 
        
        
        // also push normals, have to do one for each vertex, so should be 6 pushes of 3 vals 
        const squareNormals = [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0]


        
        // Step 4b. Ship the data
        
        square = new TriangleMesh(squarePositionsData, squareColorsData, squareNormals);
        square.shipStandardAttributes(gl, program) 
        square.bunnyCenter[2] = 0 
        
//        square.bunnyNormalsBuffer = gl.createBuffer();
//        square.bunnyNormalsMemoryID = gl.getAttribLocation(program, 'aVertexNormal');
//        gl.bindBuffer(gl.ARRAY_BUFFER, square.bunnyNormalsBuffer);
//        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareNormals), gl.STATIC_DRAW);
//        gl.bindBuffer(gl.ARRAY_BUFFER, null);
//        
//        
        
        
        //pass the bunny - first find colors for each vertex
        const bunnyColorsData = []
        for(var i = 0; i < bunnyVertices.length; i+=3) {
            bunnyColorsData.push(1,1,0)
        }
        
      
         bunny = new TriangleMesh(bunnyVertices, bunnyColorsData, bunnyNormals);
         bunny.shipStandardAttributes(gl, program) 
        bunny.bunnyCenter[2] = -10
        
        
      
    
    }
    
    
    
    mainLoop() {
        
        // Compute the FPS
        // First get #milliseconds since previous draw
        const elapsed = performance.now() - this.prevDraw;

        if (elapsed < 1000/60) {
            return;
        }
        // 1000 seconds = elapsed * fps. So fps = 1000/elapsed
        const fps = 1000 / elapsed;
        // Write the FPS in a <p> element.
        document.getElementById('fps').innerHTML = fps;
        
        
        this.update();
        
        
        // Step 5. call draw() repeatedly
//        setInterval(this.draw(), 0);
        this.draw()

        

 
        // Save the value of performance.now() for FPS calculation
        this.prevDraw = performance.now();
        
    }
    
    
    update() {
        
         if (this.keyMap['w']) {
            // move the camera up
          //  this.cameraY += .25;
            bunny.bunnyCenter[0] += .25
             this.cameraX += .25

             
          //  bunny.bunnyCenter[2] += .25
        }
        else if (this.keyMap['s']) {
            // move the camera down
          //  this.cameraY -= .25;
             bunny.bunnyCenter[0] -= .25
        //    bunny.bunnyCenter[2] -= .25
            this.cameraX += .25
        }
        else if (this.keyMap['a']) {
            // rotate bunny 
       
            bunny.bunnyRotate[1] += .25

        }
        else if (this.keyMap['d']) {
            bunny.bunnyRotate[1] += .25
      
        }
        else if (this.keyMap['i']) {
            // moving camera forward
            this.cameraZ -= .25;
        }
        else if (this.keyMap['k']) {
            // moving camera backward
            this.cameraZ += .25;
        }
        
        
        
    }
    
    draw() {
        
//        document.getElementById('cameraPos').innerHTML = `Camera (${this.cameraX},${this.cameraY},${this.cameraZ})`;
    
        // clear canvas, reset buffers, enable depth test
        
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
    
//        // updates (rotating the tent slightly)
//        tent.tentRotateY += 0.01;
    
        // Now draw the tent:
        // Step 1. Prepare perspective and view matrices
        const perspectiveTransform = mat4.create();
        mat4.perspective(
            perspectiveTransform, // where to store the result
            Math.PI/2, // "vertical field of view"
            1, // "aspect ratio"
            0.1, // distance to near plane
            1000 // distance to far plane
        );
    
        // use mat4.lookAt() for the view matrix
        const viewTransform = mat4.create();
        mat4.lookAt(
            viewTransform, // where to store the result
            vec3.fromValues(this.cameraX, this.cameraY, this.cameraZ), // camera position
            vec3.fromValues(bunny.bunnyCenter[0], bunny.bunnyCenter[1], bunny.bunnyCenter[2]), // camera target
            vec3.fromValues(0, 1, 0), // up vector
        );
    
        // Step 2. Prepare the model matrix
     //   const modelTransform = square.getModelTransform()
      //  const bunnyModelTransform = bunny.getModelTransform()
    
        // Step 3. Ship all the transforms
        this.shipTransform(gl, program, perspectiveTransform, viewTransform, square.getModelTransform());
    
        // Step 4. 
        
        square.draw(gl)
          gl.drawArrays(gl.TRIANGLES, 0, square.bunnyPositionsData.length/3);
        
        
        
        
        this.shipTransform(gl, program, perspectiveTransform, viewTransform, bunny.getModelTransform());
        bunny.draw(gl)
            gl.drawArrays(gl.TRIANGLES, 0, bunny.bunnyPositionsData.length/3);
    }
    // need to pass the point, in world coordinates
     // need to pass the normal, after transform, use 0 for w so we don't translate it
    // the camera position is obtained by negating the 4th column of uViewTransform

    compileBasicProgram(gl) {
        
        const shaderProgram = gl.createProgram();
        const vertexShaderCode = `#version 300 es
        precision mediump float;
        in vec3 aVertexNormal;
        in vec3 aVertexPosition;
        in vec3 aVertexColor;
        uniform mat4 uPerspectiveTransform; 
        uniform mat4 uViewTransform;
        uniform mat4 uModelTransform;
        out vec3 color;
        out vec3 pt;
        out vec3 eye;
        out vec3 n;
        void main(void) {
             mat4 inverseModelMatrix = transpose(inverse(uModelTransform));
            

            color = aVertexColor;
            
            pt = vec3(uModelTransform * vec4(aVertexPosition, 1.0)); 
            n = vec3(uModelTransform * vec4(aVertexNormal, 0.0));


            eye = -vec3(uViewTransform * vec4(0.0, 0.0, 0.0, 1.0));


            vec4 homogenized = vec4(aVertexPosition, 1.0);
            gl_Position = uPerspectiveTransform * uViewTransform * uModelTransform * homogenized;
        }
        `;
        const vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShaderObject, vertexShaderCode);
        gl.compileShader(vertexShaderObject);
    
        // good idea to check that it compiled successfully
        if (!gl.getShaderParameter(vertexShaderObject, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(vertexShaderObject));
        }
    
        // next, the fragment shader code
        const fragmentShaderCode = `#version 300 es
        precision mediump float;
        out vec4 FragColor;
        in vec3 color;
        in vec3 n;
        in vec3 pt;
        in vec3 eye;
        void main(void) {
            
            vec3 light1 = vec3(0.0, 1.5, 0.0);
            vec3 t1 = light1 - pt;
            float m1 = dot(t1,n) / (length(n)* length(t1));

            vec3 light2 = vec3(1.0, 1.5, 0.0);
            vec3 t2 = light2 - pt;
            float m2 = dot(t2,n) / (length(n)* length(t2));


            vec3 light3 = vec3(2.0, 1.5, 1.0);
            vec3 t3 = light3 - pt;
            float m3 = dot(t3,n) / (length(n)* length(t3));

            
//            vec3 m1_color = (.2+m1)*color.xyz
//            vec3 m2_color = (.2+m2)*color.xyz
//            vec3 m3_color = (.2+m3)*color.xyz
            vec3 final_color = (.2+m1)*color.xyz + (.2+m2)*color.xyz + (.2+m3)*color.xyz;

            FragColor = vec4(final_color, 1.0);
        }
        `;
    
        // send this fragment shader source code to the GPU
        const fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
    
        // tell GPU to compile it
        gl.compileShader(fragmentShaderObject);
    
        // good idea to check that it compiled successfully
        if (!gl.getShaderParameter(fragmentShaderObject, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(fragmentShaderObject));
        }
    
        // attach each of the shaders to the shader program we created earlier
        gl.attachShader(shaderProgram, vertexShaderObject);
        gl.attachShader(shaderProgram, fragmentShaderObject);
    
        // tell GPU to "link" and "use" our program
        gl.linkProgram(shaderProgram);
        return shaderProgram;
        
        
    }
    
    shipTransform(gl, program, projectionTransform, viewTransform, modelTransform){ 
         gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uPerspectiveTransform'), false, projectionTransform);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uViewTransform'), false, viewTransform);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'uModelTransform'), false, modelTransform);
    
    }
    
}

class TriangleMesh {
    constructor(positionsData, colorsData, normalsData) {
        this.bunnyRotate = vec3.fromValues(0,0,0)
        this.bunnyDirection = vec3.fromValues(0,0,1)
        this.bunnyCenter = vec3.fromValues(0,0,0)
        this.bunnyPositionsData = Float32Array.from(positionsData) //convert to typed array
        this.bunnyPositionsBuffer = null;
        this.bunnyPositionsMemoryID = null;
        this.bunnyColorsData = Float32Array.from(colorsData) //convert to typed array
        this.bunnyColorsBuffer = null;
        this.bunnyColorsMemoryID = null;
        this.bunnyNormalsData = Float32Array.from(normalsData);
        this.bunnyNormalsBuffer = null;
        this.bunnyNormalsMemoryID = null;
        
    }
    
    
    
    
    shipStandardAttributes(gl, program) {
        this.bunnyPositionsBuffer = gl.createBuffer();
        this.bunnyPositionsMemoryID = gl.getAttribLocation(program, 'aVertexPosition');
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bunnyPositionsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bunnyPositionsData), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null); // this unbinds the buffer, prevents bugs

        this.bunnyColorsBuffer = gl.createBuffer();
        this.bunnyColorsMemoryID = gl.getAttribLocation(program, 'aVertexColor');
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bunnyColorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bunnyColorsData), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null); // this unbinds the buffer, prevents bugs
        
        
        this.bunnyNormalsBuffer = gl.createBuffer();
        this.bunnyNormalsMemoryID = gl.getAttribLocation(program, 'aVertexNormal');
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bunnyNormalsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.bunnyNormalsData, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null); // this unbinds the buffer, prevents bugs
        
    }
    
    
    
    getModelTransform() {
            
            const modelTransform = mat4.create();
            mat4.translate(
                modelTransform,
                modelTransform,
                vec3.fromValues(this.bunnyCenter[0], this.bunnyCenter[1], this.bunnyCenter[2])
            );
            mat4.rotateY(
                modelTransform,
                modelTransform,
                this.bunnyRotate[1],
            );
            
            return modelTransform;
            
            
    }
        
    
    
    draw(gl) {
        
        // Bind the position buffer so gl.drawArrays() draws the whole tent
            // these lines tell gl.drawArrays() how to get the data out of the buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bunnyPositionsBuffer);
            gl.vertexAttribPointer(this.bunnyPositionsMemoryID, 3, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray(this.bunnyPositionsMemoryID);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // and the colors too
            gl.bindBuffer(gl.ARRAY_BUFFER, this.bunnyColorsBuffer);
            gl.vertexAttribPointer(this.bunnyColorsMemoryID, 3, gl.FLOAT, false, 0, 0 );
            gl.enableVertexAttribArray(this.bunnyColorsMemoryID);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        
        
        //normals
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bunnyNormalsBuffer);
        gl.vertexAttribPointer(this.bunnyNormalsMemoryID, 3, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray(this.bunnyNormalsMemoryID);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
            
          
        
    }
}