// Text wrapping system for Javascript/HTML5 on Canvas

function MessageBox (x, y, width, height, padx, pady, numlines, img, font, fontsize, textcolor) {
    /*
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.padx = padx;
    this.pady = pady;
    */
    if (padx === null)     { padx = 0;}
    if (pady === null)     { pady = 0;}
    if (numlines === null) { numlines = 0;}
    if (width === null)    { width = img.width;}
    if (height === null)   { height = img.height; }
    if (fontsize === null) { fontsize = 10; } //height in pixels
    if (textcolor === null) { textcolor = "black"; }

    var text = "test";
    var remainingWords = [];
    var spliceIndex = 0;
    var standbyForInput = false;
    var delayTillNext = 5;
    this.isAlive = false;
    /*
    getWordHeight = function () {
        scaledContext.font = "normal " + fontsize + "px" + " " + font;
        wordHeight = fontsize;
    }
    var wordHeight = function(){
        
    }
    */
    this.beginText = function (text) {
        this.isAlive = true;
        text = text;
        words = text.split(" ");
    }

    this.update = function () {
        //console.log("Current text: " + text);
        if (this.isAlive) {
            if (standbyForInput) {
                this.drawWords(words);
                delayTillNext--;
                console.log(delayTillNext);
                if (holdEnter && delayTillNext <= 0) {
                    standbyForInput = false;
                    console.log(spliceIndex, words.length);
                    if (spliceIndex === words.length) {
                        this.isAlive = false; //message over!
                    }
                    words.splice(0, spliceIndex);
                    delayTillNext = 5; //frames until the player can skip to following text
                }
            }
            else {
                this.drawWords(words);
            }
        }
    }
    this.drawBox = function () {
        canvasContext.drawImage(img, x, y);
        //console.log("Drawing box");
    }
    this.drawWords = function (text, toSplit) {

        scaledContext.font = "normal " + fontsize + "px" + " " + font;

        var currentx = padx; //start at edge of box + padding
        var currentline = 0;

        var spaceWidth = scaledContext.measureText(" ").width;
        for (i = 0; i < words.length; i++) {
            var wordWidth = scaledContext.measureText(words[i]).width;

            //draw on current line if it fits
            if (currentx + wordWidth < width - padx) {
                colorText(words[i], currentx, y*4 + pady + fontsize * (currentline+1), textcolor);
                currentx = currentx + wordWidth + spaceWidth;
            }
            //if we have lines left, skip to next
            else if (currentline+1 < numlines) {
                currentline++;
                currentx = padx;
                colorText(words[i], currentx, y * 4 + pady + fontsize * (currentline+1), textcolor);
                currentx = currentx + wordWidth + spaceWidth;
            }
            //we have no more space! Gotta press something
            else {
                standbyForInput = true;
                spliceIndex = i; //we're gonna cut "words" when we press a given key
                break;
            }
            if (i === words.length) {
                console.log("Hit");
                standbyForInput = true
                spliceIndex = i;
                break;
            }
        }
    }
    
}
pokebox = new MessageBox(0, 85, 200 * 4, 65 * 4, 5 * 4, 5 * 4, 4, pokeboxPic, "Lucida Console", 10 * 4, "black");