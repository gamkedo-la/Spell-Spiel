
const KEY_LEFT_ARROW = 37;
const KEY_RIGHT_ARROW = 39;
const KEY_UP_ARROW = 38;
const KEY_DOWN_ARROW = 40;

var holdLeft = false;
var holdRight = false;
var holdUp = false;
var holdDown = false;


var mouseX = 0;
var mouseY = 0;


var pressedKey = false;

var keyPressed = function (evt) {
    console.log("Detecting characters");
    evt.preventDefault(); // without this, arrow keys scroll the browser!
    keyPressed.data.push(evt.charCode);
    pressedKey = true;
}

function keyDown(evt) {
    setKeyHoldState(evt.keyCode, true);
    console.log(holdLeft);
    console.log("Detecting arrows");
    evt.preventDefault();
}

function keyUp(evt) {
    setKeyHoldState(evt.keyCode, false);
}

function resetKeypress() {
    keyPressed.data = [];
    pressedKey = false;
}

function setupInput(){
	
    keyPressed.data = [];

	//scaledCanvas.addEventListener('mousemove', updateMousePos);
    //document.addEventListener("keypress", keyPressed); //keypress == only character keys!
    //document.addEventListener("keydown", keyDown);
	document.addEventListener("keyup", keyUp);
}

function updateMousePos(evt) {
	var rect = scaledCanvas.getBoundingClientRect();
	var root = document.documentElement;

	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;
}

function setKeyHoldState(thisKey, setTo) {
    if (thisKey === KEY_LEFT_ARROW) {
        holdLeft = setTo;
    }
    if (thisKey === KEY_RIGHT_ARROW) {
        holdRight = setTo;
    }
    if (thisKey === KEY_UP_ARROW) {
        holdUp = setTo;
    }
    if (thisKey === KEY_DOWN_ARROW) {
        holdDown = setTo;
    }
}