
var basicFontSize = 36;

const ORIG_WORLD_W = 200;
const ORIG_WORLD_H = 150;
const PIXEL_SCALE_UP = 4;

window.onload = function () {
    //Prepping the game canvas. Strategy "borrowed" from the Roman's Adventure source code (ty Oasis Rim and co.)
    canvas = document.createElement("canvas");
    canvasContext = canvas.getContext("2d");
    scaledCanvas = document.getElementById('gameCanvas');
    scaledContext = scaledCanvas.getContext('2d');
    canvas.width = ORIG_WORLD_W;
    canvas.height = ORIG_WORLD_H;
    scaledCanvas.width = PIXEL_SCALE_UP * canvas.width;
    scaledCanvas.height = PIXEL_SCALE_UP * canvas.height;
    //Prevents blur
    canvasContext.mozImageSmoothingEnabled = false;
    canvasContext.imageSmoothingEnabled = false;
    canvasContext.msImageSmoothingEnabled = false;
    canvasContext.imageSmoothingEnabled = false;
    scaledContext.mozImageSmoothingEnabled = false;
    scaledContext.imageSmoothingEnabled = false;
    scaledContext.msImageSmoothingEnabled = false;
    scaledContext.imageSmoothingEnabled = false;

    resetFont();
    canvasContext.textAlign = "left";

    colorRect(0, 0, scaledCanvas.width, scaledCanvas.height, 'purple') //Doesn't work with the whole scaled canvas shenanigans...
    colorText('LOADING IMAGES', scaledCanvas.width / 2, scaledCanvas.height / 2, 'orange')

    loadImages();

}

function imageLoadingDoneSoStartGame() {
    console.log("Started");
    var framesPerSecond = 30;
    setInterval(updateAll, 1000 / framesPerSecond);

    colorRect(0, 0, scaledCanvas.width, scaledCanvas.height, "orange");

    setupInput();
    player.init();
}

function updateAll() {

    //player.handleInput();
    //drawAll();
    gameController.update();
}

function moveAll() {


}

/*function drawAll() {

    clearScreen();
    player.draw();
    bat.draw();
    scaledContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, scaledCanvas.width, scaledCanvas.height); //Draw the mini canvas on the scaled
    drawOnScaled();
    endCheck();
}*/

function drawOnScaled() {
    player.drawScaled(); //UI text for each character
    bat.drawScaled();
    drawSpell(player.currentSpell);
    //Display messages (ie the ones that are timed and kept in a queue)
    for (i = 0; i < msgOnDisplay.length; i++) {
        var toDraw = msgOnDisplay[i];
        if (toDraw instanceof Message) {
            toDraw.fontOn();
            toDraw.framesLeft -= 1;
            if (toDraw.framesLeft <= 0) {
                msgOnDisplay.splice(i, 1); //If over, remove
            }
        }
        toDraw.draw();
        //console.log("Frames left: ", toDraw.framesLeft);
        toDraw.fontOff();
    }
}

function clearScreen() {

    //colorRect(0, 0, scaledCanvas.width, scaledCanvas.height, "orange"); //In update!
    canvasContext.drawImage(gameController.getBackground(), 0, 0);
}
function resetFont(){
    scaledContext.font = "normal " + basicFontSize.toString() + "pt" + " Bookman";
}

function endCheck() {
    if (player.hp == 0 || player.opponent.hp == 0) {
        endBattle();
    }
}

function endBattle() {
    if (player.hp != 0 && player.opponent.hp != 0) { //safety check
        return;
    }
    inBattle = false;
    if (player.hp == 0) {
        scaledContext.textAlign = "center";
        colorText("Game Over!", scaledCanvas.width / 2, 200, "black");
        scaledContext.textAlign = "left";
    }

    else if (player.opponent.hp == 0) {
        scaledContext.textAlign = "center";
        colorText("You won!", scaledCanvas.width / 2, 200, "black");
        //setTimeout(colorText, 2000, "I waited", scaledCanvas.width / 2, 200, "black")
        scaledContext.textAlign = "left";
    }

}