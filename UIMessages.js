// UI. This will mostly include everything relating text on screen, which has to be drawn directly on the scaled canvas

var msgTime;
var msgOnDisplay = [];

function Message() {
    this.text = "";
    this.x = 0;
    this.y = 0;
    this.DURATION = 100;
    this.active = false;
    this.framesLeft = this.DURATION;
    this.box = 1;
    this.color = "black";

    //ToDo for outside combat, with dialog boxes
    this.boxFit = function () {
        return;
    }

    this.draw = function () {
        colorText(this.text, this.x, this.y, this.color);
        if (this.box != undefined) {
            colorRect(100, 100, 100 / PIXEL_SCALE_UP, 100 / PIXEL_SCALE_UP, "white");
            colorRect(this.x / PIXEL_SCALE_UP, this.y / PIXEL_SCALE_UP, 100 / PIXEL_SCALE_UP, 100 / PIXEL_SCALE_UP, "white");
        }
    }
    this.fontOn = function () {
        scaledContext.font = "normal " + basicFontSize.toString() + "pt" + " Bookman"; //Would be different in a message
    }
    this.fontOff = function (){
        scaledContext.font = "normal " + basicFontSize.toString() + "pt" + " Bookman";
    }

}

var msgNeutralGood = [
    "Take that!",
    "Eat this!",
    "I put some time into this one!",
    "Been practicin' that one."
];
var msgNeutralBad = [
    "Oops",
    "So close...",
    "Let's try that again...",
    "Still needs practice...",
    "Can't seem to nail that part..."
];

//Fire
var msgFireGood = [
    "Incineration!",
    "Feel the living flames!",
    "Be glad this is just cartoon violence!",
    "Sorry, but you gotta burn!"
];
var msgFireBad = [
    "When you play with fire...",
    "Looks like I got burned..."
];

//Lightning
var msgLightningGood = [
    "Pew pew!",
    "Try blocking that!",
    "Player used Thunder!",
    "Charge!",
    "Get those electrons movin!",
    "I'm shocked I landed this..."
];
var msgLightningBad = [
    "I knew I'd catch a shock myself...",
    "Too fast for me it seems..."
];

//Ice
var msgIceGood = [
    "Enough!",
    "Chill...",
    "Every joke has already been told",
    "I suspect you'll like this!",
    "I see you're getting icy!",
    "Someone help me"
];
var msgIceBad = [
    "My heart has melted",
    "(Gotta keep my cool...)",
    "(Stone cold face)",
    "Walking on thin ice..."
];

function battleMsg(msg, msgArray) {
    msg.framesLeft = msg.DURATION;
    msg.text = msgArray[Math.floor(Math.random() * msgArray.length)]; //Pick one at random
    //Push if not in array
    if (msgOnDisplay.indexOf(msg) == -1) {
        msgOnDisplay.push(msg);
    }
    console.log(msgOnDisplay.indexOf(msg));
    console.log(msgOnDisplay.length);
}

/*var testMsg = new Message();
testMsg.text = "Test";
testMsg.DURATION = 300;
testMsg.x = 300;
testMsg.y = 300;
battleMsg(testMsg, msgNeutralGood, 300);
*/
var playerBattleMsg = new Message();
playerBattleMsg.fontOn = function () {
    scaledContext.font = "normal 26pt Bookman";
}
