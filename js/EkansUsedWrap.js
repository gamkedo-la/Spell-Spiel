// Text wrapping system for Javascript/HTML5 on Canvas
//Made by R�my "OmegaLarmor" "RayTeX" Lapointe for Gamkedo Club projects! :)



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

    var x = x;
    var y = y;
    var width = options.width;
    var height = options.height;
    var padx = options.padx;
    var pady = options.pady;
    var numlines = options.numlines;
    var font = options.font;
    var fontsize = options.fontsize;
    var textcolor = options.textcolor;
    this.type = "Message Box";
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

    this.subject = new Subject(); //optional, if using the Observer pattern to notify entities that the message is over

    this.beginText = function (newText) {
        this.isAlive = true;
        text = newText;
        words = text.split(" ");
    }
    this.getText = function(){
        //console.log("Text:" + words);
    }
    this.update = function () {
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
                        this.afterMessage(); //does whatever we said would happen once done
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
    }
    this.drawWords = function () {
        scaledContext.font = "normal " + fontsize + "px" + " " + font;
        currentx = padx + x*4; //start at edge of box + padding
        currentline = 1;

        var spaceWidth = scaledContext.measureText(" ").width;

        for (i = 0; i < words.length; i++) {

            var wordWidth = scaledContext.measureText(words[i]).width;

            //catches the end of the message
            if (i === words.length - 1) {
                messageDone = true;
                standbyForInput = true;
            }

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
                stopDrawing(i); //we're gonna cut "words" at "i" when we press a given key
                break;
            }

        }
    }

    //To make for each box/thing or whatever
    this.afterMessage = function () {
        return;
    }

    var newLine = function () {
        currentx = padx + x*4;
        currentline++;
    }
    var stopDrawing = function (i) {
        standbyForInput = true;
        spliceIndex = i;
    }
    this.changeFont = function(newFont){
        font = newFont; //WOW!!!!
        console.log(font);
    }
    
}

function drawMessagesIfAlive() {
    messageBoxes.forEach(function (box) {
        if (box.isAlive && box.img) { box.drawBox(); }
    })
}
function updateMessages() {
    messageBoxes.forEach(function (box) {
        if (box.isAlive) { box.update(); }
    })
}
///////////////////           In Spell Spiel           ////////////////////////
messageObserver = new Observer();
messageObserver.onNotify = function (entity, event) {
    console.log("Notified");
    if (entity.type === "Message Box" && event.startBattle) {
        console.log("So uh I heard you talked to me or sumthin...");
        console.log("Gonna start a battle now with " + event.enemy.name);
        gameController.startBattle(event.enemy);
    }
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
pokebox.subject.addObserver(messageObserver);
pokebox.afterMessage = function () {
    pokebox.subject.notify(pokebox, {startBattle : true, enemy : ghostChicken}) //does this affect the global namespace? :/
}

bubbleboxOptions = {
    width: 140*4,
    height: 50 * 4,
    padx: 10,
    pady: 10,
    numlines: 4,
    textcolor: "white",
    font: "Comic Sans MS",
    fontsize: 30,
    img: bubbleBoxPic
}
bubblebox = new MessageBox(75, 65, bubbleboxOptions);
bubblebox.subject.addObserver(messageObserver);

var messageBoxes = [pokebox, bubblebox];
