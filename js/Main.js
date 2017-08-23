
var basicFontSize = 36;

var date;
var lastTime;
var currentTime;
var deltaTime;
var spellTrie;

var pauseState = false;
var bufferFrames = 5;

const ORIG_WORLD_W = 200;
const ORIG_WORLD_H = 150;
const PIXEL_SCALE_UP = 4;

window.onload = function () {
    
	// FIXME: it is impolite to trigger sound right away...
	// maybe we should wait until one user click, like start game button
	
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

    //console.log(spellTrie.autoComplete(""));
    //console.log(spellTrie.autoComplete("Lig"));

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
    if (!pauseState) {
        gameController.update();
        }
    bufferFrames--;
    if (holdP && bufferFrames <= 0) {
        pauseState = !pauseState;
        bufferFrames = 5;
        if (pauseState) {
            console.log(pauseState);
            scaledContext.textAlign = "center";
            colorText("P A U S E D", scaledCanvas.width / 2, 200, "blue");
            scaledContext.textAlign = "left";
        }
    }
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

function drawBothBattle() {
    player.draw();
    player.drawBattle();
    player.opponent.draw();
    player.opponent.drawBattle();
}
function setOpponentsBoth(enemy) {
    player.opponent = enemy;
    enemy.opponent = player;
}

function updateDamage() {
    //Update on player and enemy
    //console.log(player.delayedDamage[0][0]);
    player.delayedDamage.forEach(function (element, index) {
        element[0]--; // -1 frame
        if (element[0] <= 0) {
            player.dealDamage(element[1]);
            player.delayedDamage.splice(index, 1);
        }
    })
    player.opponent.delayedDamage.forEach(function (element, index) {
        element[0]--; // -1 frame
        if (element[0] <= 0) {
            player.opponent.dealDamage(element[1]);
            player.opponent.delayedDamage.splice(index, 1);
        }
    })     
}

function spellTimeLapse() {
    date = new Date();
    lastTime = currentTime;
    currentTime = date.getTime();
    deltaTime = currentTime - lastTime;
    player.currentSpell.timeElapsed += deltaTime;
}