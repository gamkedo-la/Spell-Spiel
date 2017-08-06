
var basicFontSize = 36;

var date;
var lastTime;
var currentTime;
var deltaTime;
var spellTrie;

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

    spellTrie = createTrie();
    for(var spell in spells) {
        spellTrie.insert(spells[spell].text);
    }

    console.log(spellTrie.autoComplete(""));
    console.log(spellTrie.autoComplete("Lig"));

    colorRect(0, 0, scaledCanvas.width, scaledCanvas.height, 'purple'); //Doesn't work with the whole scaled canvas shenanigans...
    colorText('LOADING', scaledCanvas.width / 2, scaledCanvas.height / 2, 'orange'); //Also looks weird now :P

    loadImages();

};

function imageLoadingDoneSoStartGame() {
    console.log("Started");
    var framesPerSecond = 30;
    setInterval(updateAll, 1000 / framesPerSecond);

    setupInput();
}

function updateAll() {

    gameController.update();

}

function moveAll() {


}

function clearScreen() {

    //colorRect(0, 0, scaledCanvas.width, scaledCanvas.height, "orange"); //In update!
    canvasContext.drawImage(gameController.getBackground(), 0, 0);
}
function resetFont(){
    scaledContext.font = "normal " + basicFontSize.toString() + "pt" + " Bookman";
}
