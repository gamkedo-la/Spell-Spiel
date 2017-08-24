// UI. This will mostly include everything relating text on screen, which has to be drawn directly on the scaled canvas

var msgTime;
var msgOnDisplay = [];

function Message() {
    this.text = "";
    this.x = 32 * PIXEL_SCALE_UP; //Should be outside the main class if we want other messages
    this.y = 145 * PIXEL_SCALE_UP;
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

        if (this.box != undefined) { //Text wrapping still needs to be implemented
            colorRect(100, 100, 100 / PIXEL_SCALE_UP, 100 / PIXEL_SCALE_UP, "white");
            colorRect(this.x / PIXEL_SCALE_UP, this.y / PIXEL_SCALE_UP, 100 / PIXEL_SCALE_UP, 100 / PIXEL_SCALE_UP, "white");
        }
    }
    this.fontOn = function () {
        scaledContext.font = "normal " + basicFontSize.toString() + "pt" + " Bookman"; //To change with whatever font desired
    }
    this.fontOff = function (){
        scaledContext.font = "normal " + basicFontSize.toString() + "pt" + " Bookman";
    }

}

//If someone knows a better way to create these kinds of things outside of hard code, do share!
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

var msgPoisonGood = [
    "Now you're coughing and wheezing!",

];
var msgPoisonBad = [
    "Who came up with toxic cloud anyway?",

];

function displayBattleMsg(msg, msgArray) {
    msg.framesLeft = msg.DURATION;
    msg.text = msgArray[Math.floor(Math.random() * msgArray.length)]; //Pick one at random
    //Push if not in array
    if (msgOnDisplay.indexOf(msg) == -1) {
        msgOnDisplay.push(msg);
    }
}

/*var testMsg = new Message();
testMsg.text = "Test";
testMsg.DURATION = 300;
testMsg.x = 300;
testMsg.y = 300;
displayBattleMsg(testMsg, msgNeutralGood, 300);
*/

var playerBattleMsg = new Message();
playerBattleMsg.x = 40 * PIXEL_SCALE_UP - 800 / 16;
playerBattleMsg.y = 125 * PIXEL_SCALE_UP - 600 / 17;
playerBattleMsg.x = 40 * 4;
playerBattleMsg.y = 125 * 4;
playerBattleMsg.fontOn = function () {
    scaledContext.font = "normal 26pt Bookman";
}
