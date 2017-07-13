
var standingPic = document.createElement("img");
var batPic = document.createElement("img");
var fillerPic = document.createElement("img");
var battlePic = document.createElement("img");
var overworldPic = document.createElement("img");

var picsToLoad = 0; //set automatically in loadImages()

function countLoadedImagesAndLaunchIfReady(){
	picsToLoad--;
	console.log(picsToLoad);
	if (picsToLoad == 0){
		imageLoadingDoneSoStartGame();
	}
}

function beginLoadingImage(imgVar, fileName){
	imgVar.onload = countLoadedImagesAndLaunchIfReady();
	imgVar.src = fileName;
}


function loadImages(){

    var imageList = [
        { varName: standingPic, theFile: "Graphics/standing.png" },
        { varName: fillerPic, theFile: "Graphics/pommier3.png" },
        { varName: battlePic, theFile: "Graphics/bgResized.png" },
        { varName: overworldPic, theFile: "Graphics/study.png" },
        { varName: batPic, theFile: "Graphics/bat.png" }
    ]

    picsToLoad = imageList.length; //This method avoids a race condition

	for(var i=0; i<imageList.length; i++){
	    beginLoadingImage(imageList[i].varName, imageList[i].theFile);
	}

}