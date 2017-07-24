var particles;

 

function Particle() {

    var FRAME_COUNT;
    var SPRITE_WIDTH;
    var SPRITE_HEIGHT;

    var spritesheet; //Image file

    var framesLeft = 0;
    var posX = 0;
    var posY = 0;
    var xVelocity = 0;
    var yVelocity = 0;

    var isAlive = false;


    /*
    framesLeft = 0;
    posX = 0;
    posY = 0;
    xVelocity = 0;
    yVelocity = 0;
    */

    /*
    this.init = function (pFramesLeft, pPosX, pPosY, pXVelocity, pYVelocity) {
    framesLeft = pFramesLeft;
    posX = pPosX;
    posY = pPosY;
    xVelocity = pXVelocity;
    yVelocity = pYVelocity;
    }*/

    this.init = function () {

    }

    this.animate = function () {
        if (isAlive()) {
            posX += xVelocity;
            posY += yVelocity;
            framesLeft--;
 
            // Draw the object to the screen
 
            return false;
 
        }
        return true;
    }
}