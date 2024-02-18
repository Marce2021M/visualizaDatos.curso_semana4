// ----------------------------------------------------------------------------
// Visualización de datos avanzada (ITAM - Primavera 2024)
// J. Ezequiel Soto S.
// ----------------------------------------------------------------------------
// Este código es un ejemplo de la visualización de curvas de Bézier con
// control de los puntos de control. Se utiliza la librería vector2d.js para
// manejar los puntos y vectores en el espacio 2D.
// ----------------------------------------------------------------------------

// Get the canvas element
var canvas = document.getElementById("myCanvas");

// Set the canvas size to full screen
let w = window.innerWidth;
let h = window.innerHeight;
canvas.width = w;
canvas.height = h;

// Get the drawing context
var ctx = canvas.getContext("2d");

//Fill the canvas with dark gray:
ctx.fillStyle = "#222";
ctx.fillRect(0, 0, w, h);

ctx.scale(1,-1);
ctx.translate(w/2,-h/2);

// Get the transformation matrix from the canvas and its inverse:
let matrix = ctx.getTransform();
let imatrix = matrix.inverse();

// -----------------------------------------------------------------------
// Basic definitions:
// -----------------------------------------------------------------------

// Create the control points
let P = [ new Point(-w/4, 0),
          new Point(0, 1.5*h/4),
          new Point(0, -1.5*h/4),
          new Point(w/4, 0)];
// Auxiliary points
let Q = []; let R = []; let S = [];

// Get the initial values from the controls / define them
let curve = document.getElementById("selector").value;
let showPoints = document.getElementById("showControl").checked;
let t = 0;
let rad = 10;

// Create a vector to store the mouse position
let mouse = new Vector2D();

// Initial call to the main function
redraw(curve, t);

// -----------------------------------------------------------------------
// Experiment with lerp:
// -----------------------------------------------------------------------

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function invlerp(a, b, v) {
    return (v - a) / (b - a);
}

// -----------------------------------------------------------------------
// Interaction with the controls
// -----------------------------------------------------------------------

// Create a listener for the value of the selector with id "selector"
document.getElementById("selector").addEventListener("change", function() {
    // Get the value of the selected option
    curve = this.value;
    redraw(curve,t);
});

// Create a listener for the value of the checkbox with id "showPoints"
document.getElementById("showControl").addEventListener("change", function() {
    // Get the value of the selected option
    showPoints = this.checked;
    redraw(curve,t);
});

// Create a listener for the value of the slider with id "param"
document.getElementById("param").addEventListener("input", function() {
    // Get the value of the selected option
    t = this.value;
    // Update the screen with the number (2 decimals):
    document.getElementById("t").innerHTML = Number(t).toFixed(2);
    redraw(curve, t);
});

// -----------------------------------------------------------------------
// Interaction with the mouse
// -----------------------------------------------------------------------

let isDragging = false;
let pointIndex = -1;

// Create a listener for the mouse actions
canvas.addEventListener('mousedown', e => {
    if (e.buttons == 1) {
        isDragging = true;
    }
  });
canvas.addEventListener('mouseup', e => {
    isDragging = false;
});

// Create a listener for the mouse position ans define interaction
canvas.addEventListener("mousemove", function(event) {
    // Change the value in the "mouse" variable:
    mouse = new Vector2D(event.clientX, event.clientY);
    // Apply the transformation to the mouse position
    let mouseT = mouse.transform(imatrix);
    
    // Redraw the scene
    redraw(curve, t);
    canvas.style.cursor = "default";
    // Check if the mouse is close to a point:
    for (let i = 0; i < P.length; i++){
        if (P[i].distance(mouseT) < rad){
            P[i].draw(ctx, 1.5*rad, "#F00");
            // Change the mouse cursor
            canvas.style.cursor = "pointer";
            // Select the point
            pointIndex = i;
        } else if (!isDragging) {
            pointIndex = -1;
        }
    }
    // If a point is selected and dragged, move it!
    if (isDragging && pointIndex != -1){
        P[pointIndex].pos(mouseT);
        P[pointIndex].draw(ctx, 1.5*rad, "#F00");
    }
});

// -----------------------------------------------------------------------
// Main functions to draw the shapes
// -----------------------------------------------------------------------

// Compute the construction points for the curve
function compute(t){
    Q = []; R = []; S = [];
    for (let i = 0; i < 3; i++){
        Q.push(P[i].lerp(P[i + 1], t));
    }
    for (let i = 0; i < 2; i++){
        R.push(Q[i].lerp(Q[i + 1], t));
    }
    for (let i = 0; i < 1; i++){
        S.push(R[i].lerp(R[i + 1], t));
    }
}

// Draw the selected shape
function redraw(curve, t){
    compute(t);

    // Clear the canvas
    ctx.clearRect(-w/2, -h/2, w, h);
    // Fill the canvas with dark gray
    ctx.fillStyle = "#222";
    ctx.fillRect(-w/2, -h/2, w, h);

    // Draw the construction points
    let Pack = [P, Q, R, S];
    let colors = ["#FFF", "#BD9CC2", "#E04EA0", "#FF0000"];
    if (showPoints){
        // Transparency and dashed lines:
        ctx.globalAlpha = 0.5;
        ctx.setLineDash([10, 10]);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#999";

        // Read these two loops carefully:
        for (let k = 0; k < 4; k++){
            ctx.beginPath();
            ctx.moveTo(Pack[k][0].x, Pack[k][0].y);
            for (let i = 0; i < curve - (k+1); i++){
                ctx.lineTo(Pack[k][i + 1].x, Pack[k][i + 1].y);
            }
            ctx.stroke();
            ctx.closePath();
        }
        for (let k = 1; k < 4; k++){
            for (let i = 0; i < curve - k; i++){
                Pack[k][i].draw(ctx, 0.7*rad, colors[k]);
            }
        }
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);
    } else {
        Pack[curve-1][0].draw(ctx, 0.7*rad, colors[3]);
    }

    // Draw the curve
    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(P[0].x, P[0].y);
    switch (curve) {
        case "2":
            ctx.lineTo(P[1].x, P[1].y);
            break;
        case "3":
            ctx.quadraticCurveTo(P[1].x, P[1].y, P[2].x, P[2].y);
            break;
        case "4":
            ctx.bezierCurveTo(P[1].x, P[1].y, P[2].x, P[2].y, P[3].x, P[3].y);
            break;
    }
    ctx.stroke();
    ctx.closePath();

    // Draw the control points
    for (let i = 0; i < curve; i++){
        if (i == 0 || i == curve - 1){
            P[i].draw(ctx, rad, "#909");
        } else {
            P[i].draw(ctx, rad, "#666");
        }
    }

}


