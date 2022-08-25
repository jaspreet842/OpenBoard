let toolsCont = document.querySelector(".toolsCont");

let optionsCont = document.querySelector(".optionsCont");
let optionsFlag = true;

let pencil = document.querySelector(".pencil")
let pencilToolCont = document.querySelector(".pencilToolCont");
let pencilFlag = false;

let eraser = document.querySelector(".eraser")
let eraserToolCont = document.querySelector(".eraserToolCont");
let eraserFlag = false;

let sticky = document.querySelector(".sticky");

let upload = document.querySelector(".upload");

optionsCont.addEventListener("click", (e) => {
    // true -> to show the tools
    // false -> to hide tools
    optionsFlag = !optionsFlag;

    if (optionsFlag)
        openTools();
    else
        closeTools();
});
function openTools() {
    let iconElem = optionsCont.children[0];
    iconElem.classList.add("fa-bars");
    iconElem.classList.remove("fa-times");
    toolsCont.style.display = "flex";
}
function closeTools() {
    let iconElem = optionsCont.children[0];
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-times");
    toolsCont.style.display = "none";
    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
}

pencil.addEventListener("click", (e) => {
    // true -> show pencil tools
    // false -> hide pencil tools
    pencilFlag = !pencilFlag;
    if (pencilFlag) {
        pencilToolCont.style.display = "block";
    } else {
        pencilToolCont.style.display = "none";
    }
});

eraser.addEventListener("click", (e) => {
    // true -> show eraser tools
    // false -> hide eraser tools
    eraserFlag = !eraserFlag;
    if (eraserFlag) {
        eraserToolCont.style.display = "flex";
    } else {
        eraserToolCont.style.display = "none";
    }
});

upload.addEventListener("click", (e) => {
    // This Opens the file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTML = `
        <div class="headerCont">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="noteCont">
            <img src="${url}"/>
        </div>
        `;
        createSticky(stickyTemplateHTML);
    });
});


sticky.addEventListener("click", (e) => {
    let stickyTemplateHTML = `
    <div class="headerCont">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
        <div class="noteCont">
        <textarea spellcheck = "false"></textarea>
    </div>
    `;
    createSticky(stickyTemplateHTML);
});

function createSticky(stickyTemplateHTML) {
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "stickyCont");
    stickyCont.innerHTML = stickyTemplateHTML;
    document.body.appendChild(stickyCont);

    let minimize = stickyCont.querySelector(".minimize");
    let remove = stickyCont.querySelector(".remove");
    noteActions(minimize, remove, stickyCont);

    stickyCont.onmousedown = function (event) {
        dragAndDrop(stickyCont, event);
    };

    stickyCont.ondragstart = function () {
        return false;
    };
}

function noteActions(minimize, remove, stickyCont) {
    remove.addEventListener("click", (e) => {
        stickyCont.remove();
    });
    minimize.addEventListener("click", (e) => {
        let noteCont = stickyCont.querySelector(".noteCont");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if (display === "none") {
            noteCont.style.display = "block";
        } else {
            noteCont.style.display = "none";
        }
    });
}

function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the element at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the element on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the element, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}