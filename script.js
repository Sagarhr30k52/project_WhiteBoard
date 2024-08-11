// let pencilElm = document.querySelector("#pencil");
// let eraserElm = document.querySelector("#eraser");
// let stickyElm = document.querySelector("#sticky");
// let downloadElm = document.querySelector("#download");
// let redoElm = document.querySelector("#redo");
// let undoElm = document.querySelector("#undo");
// let uploadElm = document.querySelector("#upload");

// pencilElm.addEventListener("click", function TellPencil() {
// console.log("pencil"); })

// eraserElm.addEventListener("click", function Telleraser() {
// console.log("eraser"); })

// stickyElm.addEventListener("click", function Tellsticky() {
// console.log("sticky"); })

// uploadElm.addEventListener("click", function Tellupload() {
// console.log("upload"); })

// downloadElm.addEventListener("click", function Telldownload() {
//     console.log("download"); })

// redoElm.addEventListener("click", function Tellredo() {
//     console.log("redo"); })

// undoElm.addEventListener("click", function Tellundo() {


//         console.log("undo"); })

let canvas = document.querySelector("#board");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// draw something to canvas
let tool = canvas.getContext("2d");

let toolArr = document.querySelectorAll(".tool");
let currentTool = "pencil";

for(let i=0; i<toolArr.length; i++)
{
    toolArr[i].addEventListener("click", function (e){
        const toolName = toolArr[i].id;

        if(toolName == "pencil")
        {
            currentTool = "pencil";
            tool.strokeStyle = "black";
        }
        else if(toolName == "eraser")
        {
            currentTool = "eraser";
            tool.strokeStyle = "white";
            tool.lineWidth = 5;
        }
        else if(toolName == "sticky")
        {
            currentTool = "sticky";
            createsticky();
        }
        else if(toolName == "upload")
        {
            currentTool = "upload";
            console.log("up");
            // currentTool = "upload";
            uploadFile();
        }
        else if(toolName == "download")
        {
            currentTool = "download";
            console.log("dow");
            downloadFile();
        }
        else if(toolName == "undo")

        {
            console.log("un");
            undoFN();
        }
        else if(toolName == "redo")
        {
            console.log("redo");
            currentTool="redo";
            redoFN();
        }
        else if(toolName == "clearAll")
        {
            currentTool = "clearAll";
            console.log("clear");
            clearing();
        }
    })
}

// start drawing 
// tool.beginPath();

// starting pt
// tool.moveTo(10,10);

// ending pt
// tool.lineTo(40,40);

// applychanges
// tool.stroke();

let toolbar = document.querySelector("#toolbar");

let undoStack = [];
let redoStack = [];
//*****   drawing  ******* */
let isDrawing = false;
canvas.addEventListener("mousedown", function (e){
    let sidx = e.clientX;
    let sidy = e.clientY;

    // start drawinng
    tool.beginPath();
    // go to starting pt
    let ToolbarHeight = getYdelta();
    tool.moveTo(sidx, sidy - ToolbarHeight);
    isDrawing = true;

    let pointDesc = {
        x: sidx,
        y:sidy - ToolbarHeight,
        desc: "md"
    }
    undoStack.push(pointDesc);
})

canvas.addEventListener("mousemove", function (e) {
    if (isDrawing == false)
    {
        return;
    }
    let eidx = e.clientX;
    let eidy = e.clientY;

    // draw line to the ending pt
    let ToolbarHeight = getYdelta();
    tool.lineTo(eidx, eidy-ToolbarHeight);

    tool.stroke();
    
    let pointDesc = {
        x: eidx,
        y:eidy - ToolbarHeight,
        desc: "mm"
    }
    undoStack.push(pointDesc);
})
canvas.addEventListener("mouseup", function(e){
    isDrawing =false;
})

function getYdelta()
{
    let heightoftoolbar = toolbar.getBoundingClientRect().height;
    return heightoftoolbar;
}

function creatOuterShell()
{
    let stickydiv = document.createElement("div");
let navdiv = document.createElement("div");
let closediv = document.createElement("div");
let minimizediv = document.createElement("div");


/*add the syles to the div */
stickydiv.setAttribute("class", "sticky-pad");
navdiv.setAttribute("class", "nav");
closediv.setAttribute("class", "close");
minimizediv.setAttribute("class", "minimize");

minimizediv.innerHTML ="min";
closediv.innerHTML ="x";

//make them in a structure 
stickydiv.appendChild(navdiv);
// stickydiv.appendChild(textArea);
navdiv.appendChild(minimizediv);
navdiv.appendChild(closediv);

document.body.appendChild(stickydiv);

let isminimized =false;
closediv.addEventListener("click", function(){
stickydiv.remove();
})
minimizediv.addEventListener("click", function(){
    textArea.style.display = isminimized==true ? "block" : "none";
    isminimized =!isminimized;
})

let initialX,initialY;
let isStickyDown = false;

// navebar -> mousedown , mouse mve, mouse up

navdiv.addEventListener("mousedown", function(e){
    initialX = e.clientX;
    initialY = e.clientY;
    isStickyDown = true;
})

navdiv.addEventListener("mousemove", function(e){
    if(isStickyDown == true)
    {
        let finalx = e.clientX;
        let finaly = e.clientY;

        // distance
        let dx = finalx-initialX;
        let dy = finaly-initialY;

        // move sticky
        // orignal top left
        let{ top, left } = stickydiv.getBoundingClientRect()
        // stickey.style.top = 10+"px";

        stickydiv.style.top = top+ dy + "px";
        stickydiv.style.left = left + dx + "px";
        initialX = finalx;
        initialY= finaly;
    }
})

navdiv.addEventListener("mouseup", function(e){
    isStickyDown = false;
})
return stickydiv;

}
function createsticky() {
    //     <div class="sticky-pad">
    //     <div class="nav">
    //         <div class="close">X</div>
    //         <div class="minimize">min</div>
    //     </div>
    //     <textarea name="" id="" class="text-area"></textarea>
    // </div>

// 
let stickydiv = creatOuterShell();
let textArea = document.createElement("textarea");
textArea.setAttribute("class","text-area");

stickydiv.appendChild(textArea);


}

let inputTag = document.querySelector(".input-tag");
function uploadFile()
{
    // input tag to take input
    // click on img so the input tag is clicked
    inputTag.click();
    // rad the file and ad it to canvas
    inputTag.addEventListener("change", function(e){
        // console.log("file", inputTag.files);
        let data = inputTag.files[0];

        let img = document.createElement("img");

        // src -> url
        let url = URL.createObjectURL(data);
        // console.log("url ", url);
        img.src = url;
        img.setAttribute("class", "upload-img");
        
        let stickydiv = creatOuterShell();
        stickydiv.appendChild(img);
    })
    // add ui
    
}

function downloadFile() {
    // ancher butto
    // href = canvas ka url
    // ancher pe click
    // ancher remove;
    console.log("donlow");
    let a = document.createElement("a");
    a.download = "file.jpeg";
    let url = canvas.toDataURL("image/jpeg;base64");
    a.href = url;
    a.click();
    a.remove();
}
function clearing()
{
    tool.clearRect(0,0, canvas.width, canvas.height);
}

function redraw()
{
    for(let i=0; i< undoStack.length; i++)
        {
            let {x, y, desc} = undoStack[i];
            if(desc =="md"){
                tool.beginPath();
                tool.moveTo(x, y);
            }
            else if( desc == "mm")
            {
                tool.lineTo(x,y);
                tool.stroke();
            }
        }
}
function undoFN()
{
    if (undoStack.length > 0)
        {
        tool.clearRect(0,0, canvas.width, canvas.height);
        redoStack.push(undoStack.pop());
        redraw();
    }
}

function redoFN()
{
    if(redoStack.length > 0)
    {
        // clear all
        tool.clearRect(0,0, canvas.width, canvas.height);
        undoStack.push(redoStack.pop());
        redraw();
    }
}