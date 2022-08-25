let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilColorCont = document.querySelectorAll(".pencilColor");
let pencilWidth = document.querySelector(".pencilWidth");
let eraserWidth = document.querySelector(".eraserWidth");
let undo = document.querySelector(".undo");
let redo = document.querySelector(".redo");

let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidth.value;
let eraWidth = eraserWidth.value;

let download = document.querySelector(".download");

let undoRedoTracker = [];
let track = 0;

let mouseDown = false;

//API
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

// mousedown -> start new path
// mousemove -> path fill(graphics)

canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    // send data to server
    socket.emit("beginPath", data);
});

canvas.addEventListener("mousemove", (e) => {
    if (mouseDown) {
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraWidth : penWidth
        }
        socket.emit("drawStroke", data);
    }
});

canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length - 1;
});

undo.addEventListener("click", (e) => {
    if (track >= 0)
        track--;
    // Track Action
    let data = {
        trackValue: track,
        undoRedoTracker
    };
    socket.emit("undoRedoCanvas", data);
});

redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length)
        track++;
    // Track Action
    let data = {
        trackValue: track,
        undoRedoTracker
    };
    socket.emit("undoRedoCanvas", data);
});

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    let url = (0 <= track && track < undoRedoTracker.length) ? undoRedoTracker[track] : undefined;
    let img = new Image();
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

function beginPath(strokeObj) {
    tool.beginPath();
    tool.moveTo(strokeObj.x, strokeObj.y);
}

function drawStroke(strokeObj) {
    tool.strokeStyle = strokeObj.color;
    tool.lineWidth = strokeObj.width;
    tool.lineTo(strokeObj.x, strokeObj.y);
    tool.stroke();
}

pencilColorCont.forEach((colorElement) => {
    colorElement.addEventListener("click", (e) => {
        let color = colorElement.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    });
});

pencilWidth.addEventListener("change", (e) => {
    penWidth = pencilWidth.value;
    tool.lineWidth = penWidth;
});

eraserWidth.addEventListener("change", (e) => {
    eraWidth = eraserWidth.value;
    tool.lineWidth = eraWidth;
});

eraser.addEventListener("click", (e) => {
    if (eraserFlag) {
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraWidth;
    } else {
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
});

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
});

socket.on("beginPath", (data) => {
    // data -> data from server
    beginPath(data);
});

socket.on("drawStroke", (data) => {
    drawStroke(data);
});

socket.on("undoRedoCanvas", (data) => {
    undoRedoCanvas(data);
});