
//Characters
var idlePic = document.createElement("img");
var castingPic = document.createElement("img");
var walkingUpPic = document.createElement("img");
var walkingDownPic = document.createElement("img");
var walkingLeftPic = document.createElement("img");
var walkingRightPic = document.createElement("img");

var batPic = document.createElement("img");
var zombiePic = document.createElement("img");
var lizardPic = document.createElement("img");
var jellyfishPic = document.createElement("img");
var ghostChickenPic = document.createElement("img");
var dummyPic = document.createElement("img");
var eyeMonsterPic = document.createElement("img");

var marieTartinePic = document.createElement("img");
var marinePic = document.createElement("img");
var quitteriePic = document.createElement("img");
var guideNPC1Pic = document.createElement("img");
var noStyleNPCPic = document.createElement("img");
var stylishNPCPic = document.createElement("img");
var libraryNPCPic = document.createElement("img");

//Environments
var fillerPic = document.createElement("img");
var battlePic = document.createElement("img");
var lavaPic = document.createElement("img");

var mainMenuPic = document.createElement("img");
var spellMenuPic = document.createElement("img");
var spellMenu2Pic = document.createElement("img");
var creditsMenuPic = document.createElement("img");
var creditsMenuPic2 = document.createElement("img");

var mainRoomPic = document.createElement("img");
var leftHallwayPic = document.createElement("img");
var rightHallwayPic = document.createElement("img");
var hallwayDownPic = document.createElement("img");
var destroyedRoomPic = document.createElement("img");
var libraryPic = document.createElement("img");
var trainingPic = document.createElement("img");
var lowerWallTransparentPic = document.createElement("img");

//Spell VFX
var fireballSheet = document.createElement("img");
var lightningSheet = document.createElement("img");
var iceSpikePic = document.createElement("img");
var shieldPic = document.createElement("img");
var bitePic = document.createElement("img");
var slashPic = document.createElement("img");
var toxicCloudPic = document.createElement("img");
var lifeDrainPic = document.createElement("img");
var poisonSpitPic = document.createElement("img");
var waterSquirtPic = document.createElement("img");
var eerieLookPic = document.createElement("img");
var buffPic = document.createElement("img");
var stingPic = document.createElement("img");
var dispellPic = document.createElement("img");

//Other
var pokeboxPic = document.createElement("img");
var announceBoxPic = document.createElement("img");
var checkmarkPic = document.createElement("img");
var bubbleBoxPic = document.createElement("img");
var attackBuffPic = document.createElement("img");
var defenseBuffPic = document.createElement("img");
var attackDebuffPic = document.createElement("img");
var defenseDebuffPic = document.createElement("img");

var endPic = document.createElement("img");

var picsToLoad = 0; //set automatically in loadImages()

function countLoadedImagesAndLaunchIfReady(){
    picsToLoad--;
    //console.log(picsToLoad);
    if (picsToLoad == 0){
        imageLoadingDoneSoStartGame();
    }
}

function beginLoadingImage(imgVar, fileName){
    imgVar.onload = countLoadedImagesAndLaunchIfReady();
    imgVar.src = "images/" + fileName;
}


function loadImages(){

    var imageList = [
        { varName: idlePic, theFile: "beamIdle2.png" }, //spritesheet animation
        { varName: castingPic, theFile: "beamCasting.png" }, //spritesheet animation
        { varName: walkingUpPic, theFile: "beamWalkingUp.png" }, //spritesheet animation
        { varName: walkingDownPic, theFile: "beamWalkingDown.png" }, //spritesheet animation
        { varName: walkingLeftPic, theFile: "beamWalkingLeft.png" }, //spritesheet animation
        { varName: walkingRightPic, theFile: "beamWalkingRight.png" }, //spritesheet animation

        { varName: marieTartinePic, theFile: "marieTartine.png" },
        { varName: quitteriePic, theFile: "quitterie.png" },
        { varName: marinePic, theFile: "marine.png" },
        { varName: guideNPC1Pic, theFile: "guideNPC1.png" },
        { varName: noStyleNPCPic, theFile: "noStyleNPC.png" },
        { varName: stylishNPCPic, theFile: "stylishNPC.png" },
        { varName: libraryNPCPic, theFile: "jasonFunderburker.png" },

        { varName: fillerPic, theFile: "pommier3.png" },
        { varName: mainMenuPic, theFile: "mainMenu.png" },
        { varName: spellMenuPic, theFile: "upgradeMenu.png" },
        { varName: spellMenu2Pic, theFile: "upgradeMenu2.png" },
        { varName: creditsMenuPic, theFile: "credits.png" },
        { varName: creditsMenuPic2, theFile: "credits2.png" },
        { varName: battlePic, theFile: "canyon_of_the_castle.png" },
        { varName: lavaPic, theFile: "LavaBackground.png" }, 
        { varName: mainRoomPic, theFile: "mainRoom.png" },
        { varName: leftHallwayPic, theFile: "hallwayLeft.png" },
        { varName: rightHallwayPic, theFile: "hallwayRight.png" },
        { varName: hallwayDownPic, theFile: "hallwayDown.png" },
        { varName: destroyedRoomPic, theFile: "destroyedRoom.png" },
        { varName: libraryPic, theFile: "library.png" },
        { varName: trainingPic, theFile: "dojo.png" },
        { varName: lowerWallTransparentPic, theFile: "lowerWallTransparent.png" },

        { varName: batPic, theFile: "bat.png" },
        { varName: zombiePic, theFile: "zombieIdle.png" }, //spritesheet animation
        { varName: lizardPic, theFile: "lizardIdle.png" }, //spritesheet animation
        { varName: jellyfishPic, theFile: "jellyfishIdle.png" }, //spritesheet animation
        { varName: ghostChickenPic, theFile: "CGSpritesheet.png" }, //spritesheet animation
        { varName: eyeMonsterPic, theFile: "eyeMonster.png" }, //spritesheet animation
        { varName: dummyPic, theFile: "dummy.png" },

        { varName: fireballSheet, theFile: "fireball.png" },
        { varName: iceSpikePic, theFile: "iceSpike.png" },
        { varName: lightningSheet, theFile: "lightning.png" },
        { varName: shieldPic, theFile: "shield.png" },
        { varName: poisonSpitPic, theFile: "poisonSpit.png" },
        { varName: bitePic, theFile: "bite.png" },
        { varName: slashPic, theFile: "slash.png" },
        { varName: toxicCloudPic, theFile: "toxicCloud.png" },
        { varName: lifeDrainPic, theFile: "lifeDrain.png" },
        { varName: waterSquirtPic, theFile: "waterSquirt.png" },
        { varName: eerieLookPic, theFile: "eerieLook.png" },
        { varName: stingPic, theFile: "sting.png" },
        { varName: dispellPic, theFile: "dispell.png" },
        { varName: buffPic, theFile: "buff.png" },

        { varName: pokeboxPic, theFile: "pokeboxBrown.png" },
        { varName: announceBoxPic, theFile: "announceBox.png" },
        { varName: checkmarkPic, theFile: "checkmark.png" },
        { varName: bubbleBoxPic, theFile: "exampleDialogBox.png" },
        { varName: attackBuffPic, theFile: "attackBuff.png" },
        { varName: defenseBuffPic, theFile: "defenseBuff.png" },
        { varName: attackDebuffPic, theFile: "attackDebuff.png" },
        { varName: defenseDebuffPic, theFile: "defenseDebuff.png" },
        { varName: endPic, theFile: "endScreen.png" }
    ]

    picsToLoad = imageList.length; //This method avoids a race condition

    for(var i=0; i<imageList.length; i++){
        beginLoadingImage(imageList[i].varName, imageList[i].theFile);
    }

}
