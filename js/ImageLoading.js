
//Characters
var idlePic = document.createElement("img");
var castingPic = document.createElement("img");

var batPic = document.createElement("img");
var zombiePic = document.createElement("img");
var lizardPic = document.createElement("img");
var jellyfishPic = document.createElement("img");
var ghostChickenPic = document.createElement("img");

//Environments
var fillerPic = document.createElement("img");
var battlePic = document.createElement("img");
var overworldPic = document.createElement("img");

//Spell VFX
var fireballSheet = document.createElement("img");
var lightningSheet = document.createElement("img");
var biteSheet = document.createElement("img");

var iceSpikePic = document.createElement("img");
var shieldPic = document.createElement("img");
var bitePic = document.createElement("img");
var poisonSpitPic = document.createElement("img");



var picsToLoad = 0; //set automatically in loadImages()

function countLoadedImagesAndLaunchIfReady(){
    picsToLoad--;
    console.log(picsToLoad);
    if (picsToLoad == 0){
        imageLoadingDoneSoStartGame();
    }
}

function beginLoadingImage(imgVar, fileName){
    imgVar.onload = countLoadedImagesAndLaunchIfReady;
    imgVar.src = "images/" + fileName;
}


function loadImages(){

    var imageList = [
        { varName: idlePic, theFile: "beamIdle.png" }, //spritesheet animation
        { varName: castingPic, theFile: "beamCasting.png" }, //spritesheet animation
        { varName: fillerPic, theFile: "pommier3.png" },
        { varName: battlePic, theFile: "canyon_of_the_castle.png" }, // was bgResized.png
        { varName: overworldPic, theFile: "study.png" },

        { varName: batPic, theFile: "bat.png" },
        { varName: zombiePic, theFile: "zombieIdle.png" }, //spritesheet animation
        { varName: lizardPic, theFile: "lizardIdle.png" }, //spritesheet animation
        { varName: jellyfishPic, theFile: "jellyfishIdle.png" }, //spritesheet animation
        { varName: ghostChickenPic, theFile: "CGSpritesheet.png" }, //spritesheet animation

        { varName: fireballSheet, theFile: "fireball.png" },
        { varName: iceSpikePic, theFile: "iceSpike.png" },
        { varName: lightningSheet, theFile: "lightning.png" },
        { varName: shieldPic, theFile: "shield1.png" },
        { varName: poisonSpitPic, theFile: "poisonSpit.png" },
        { varName: bitePic, theFile: "bite.png" }
    ];

    picsToLoad = imageList.length; //This method avoids a race condition

    for(var i=0; i<imageList.length; i++){
        beginLoadingImage(imageList[i].varName, imageList[i].theFile);
    }

}
