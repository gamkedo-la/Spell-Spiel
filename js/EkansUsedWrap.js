// Text wrapping system for Javascript/HTML5 on Canvas
//Made by Rémy "OmegaLarmor" "RayTeX" Lapointe for Gamkedo Club projects! :)



////////////////        OPTIONS          //////////////////////

/*The options include:

width/height : Given as argument since there is no dynamic fitting based on box img (pixels)
padx/pady : In pixels, defaults to 5
numlines : Number of lines that have to be fit in the box. Currently this doesn't happen automatically, therefore be careful to set your fontsize appropriately!
fontsize : In pixels, defaults to 10
textcolor : Self-explanatory.

Current limitations:
No message queue
No multiple choice
Left align only
No bold, italic, font changing mid-text
No actual typing effect yet!
*/


function MessageBox (x, y, options) {

    //////////////////           Initialization           //////////

    var width = options.width;
    var height = options.height;
    var padx = options.padx;
    var pady = options.pady;
    var numlines = options.numlines;
    var font = options.font;
    var fontsize = options.fontsize;
    var textcolor = options.textcolor;
    this.img = options.img;

    if (!options.width) {
        if (this.img) { width = this.img.width; }
        else { width = 100; }
    }
    if (!options.height) {
        if (this.img) { height = this.img.height; }
        else { height = 100; }
    }
    if (!options.padx)     { padx = 5;}
    if (!options.pady) { pady = 5; }
    if (!options.numlines) { numlines = 2; }

    if (!options.fontsize) { fontsize = 10; } //height in pixels
    if (!options.textcolor) { textcolor = "black"; }
    //this.messageQueue = []; //contains strings

    var text = "";
    var remainingWords = [];
    var spliceIndex = 0;
    var standbyForInput = false;
    var messageDone = false;
    //var playerInput = holdEnter;
    var delayTillNext = 0; //frames of waiting that prevent the player from multi skipping when hitting the button
    var delayBoost = 5;
    this.isAlive = false;
    var currentx;
    var currentline;
    var words;

    this.beginText = function (text) {
        this.isAlive = true;
        text = text;
        words = text.split(" ");
        console.log(words);
    }
    this.getText = function(){
        console.log("Text:" + words);
    }
    this.update = function () {
        //console.log("Current text: " + text);
        if (this.isAlive) {
            if (standbyForInput) {
                this.drawWords();
                this.getText();
                delayTillNext--;
                if (holdEnter && delayTillNext <= 0) {
                    standbyForInput = false;
                    //our message is over, if we had an event system we would declare it there and call the appropriate function :P
                    if (messageDone) {
                        messageDone = false;
                        this.isAlive = false;
                    }
                    words.splice(0, spliceIndex);
                    delayTillNext = delayBoost; //frames until the player can skip to following text
                }
            }
            else {
                this.drawWords();
            }
        }
    }
    this.drawBox = function () {
        canvasContext.drawImage(this.img, x, y);
        //console.log("Drawing box");
    }
    this.drawWords = function () {
        scaledContext.font = "normal " + fontsize + "px" + " " + font;
        currentx = padx; //start at edge of box + padding
        currentline = 1;

        var spaceWidth = scaledContext.measureText(" ").width;

        for (i = 0; i < words.length; i++) {

            var wordWidth = scaledContext.measureText(words[i]).width;

            //draw on current line if it fits
            if (currentx + wordWidth < width - padx) {
                if (words[i] === "\n") {
                    if (currentline < numlines) {
                        newLine();
                    }
                    else if (currentline === numlines) {
                        stopDrawing(i+1); //+1 to cut the line skip
                        break;
                    }
                }//for line skips, \n needs to be surrounded by spaces :O
                else if (words[i] != "\n") {
                    colorText(words[i], currentx, y * 4 + pady + fontsize * (currentline), textcolor);
                    currentx = currentx + wordWidth + spaceWidth;
                    //catches the end of the message
                    if (i === words.length - 1) {
                        messageDone = true;
                        standbyForInput = true;
                    }
                }
            }
            //if we have no space but lines left, skip to next
            else if (currentline < numlines) {
                newLine();
                colorText(words[i], currentx, y * 4 + pady + fontsize * (currentline), textcolor);
                currentx = currentx + wordWidth + spaceWidth;
            }
                //we have no more space! Gotta press something
            else {
                standbyForInput = true;
                spliceIndex = i; //we're gonna cut "words" when we press a given key
                break;
            }
        }
    }
    var newLine = function () {
        currentx = padx;
        currentline++;
    }
    var stopDrawing = function (i) {
        standbyForInput = true;
        spliceIndex = i;
    }
    
}

function drawMessages() {
    messageBoxes.forEach(function (box) {
        if (box.isAlive && box.img) { box.drawBox(); }
    })
}
function updateMessages() {
    messageBoxes.forEach(function (box) {
        if (box.isAlive) { box.update(); }
    })
}

pokeboxOptions = {
    width: 800,
    height: 65 * 4,
    padx: 20,
    pady: 20,
    numlines: 5,
    textcolor: "orange",
    font: "Consolas",
    fontsize: 40,
    img: pokeboxPic
}
pokebox = new MessageBox(0, 85, pokeboxOptions);

bubbleboxOptions = {
    width: 200,
    height: 40 * 4,
    padx: 10,
    pady: 10,
    numlines: 3,
    textcolor: "white",
    font: "Comic Sans MS",
    fontsize: 30,
    //img: pokeboxPic
}
bubblebox = new MessageBox(150, 85, bubbleboxOptions);

var messageBoxes = [pokebox, bubblebox];
