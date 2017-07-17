
function drawBitmapWithRotation(useBitmap, atX, atY, withAng) {

	canvasContext.save();
	canvasContext.translate(atX, atY);
	canvasContext.rotate(withAng);
	canvasContext.drawImage(useBitmap, -useBitmap.width/2, -useBitmap.height/2);
	canvasContext.restore();

}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {

	canvasContext.fillStyle = fillColor;
	canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
	canvasContext.fillStyle = 'white';
	canvasContext.beginPath();
	canvasContext.arc(carX, carY, radius, 0, Math.PI*2, true); //Début, fin, horaire ou anti horaire
	canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor) {
	scaledContext.fillStyle = fillColor;
	scaledContext.fillText(showWords, textX, textY);
}