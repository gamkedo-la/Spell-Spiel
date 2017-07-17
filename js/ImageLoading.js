
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
	imgVar.src = "images/" + fileName;
}


function loadImages(){

    var imageList = [
        { varName: standingPic, theFile: "standing.png" },
        { varName: fillerPic, theFile: "pommier3.png" },
        { varName: battlePic, theFile: "bgResized.png" },
        { varName: overworldPic, theFile: "study.png" },
        { varName: batPic, theFile: "bat.png" }
    ]

    picsToLoad = imageList.length; //This method avoids a race condition

	for(var i=0; i<imageList.length; i++){
	    beginLoadingImage(imageList[i].varName, imageList[i].theFile);
	}

}