
//var particles_enabled = true;
var particles = []; // a SpriteList containing all of them

var PARTICLE_FPS = 8/2;
var PARTICLE_FRAME_MS = 1000 / PARTICLE_FPS; // 15 = 60fps - looks fine much slower too
var FAR_AWAY = -999999;

function Particle() {

    this.particleFPS = 1;
    this.particleFrameMs = 1000 / 1;
    this.frameCount = 4;
    this.spriteWidth = 0;
    this.spriteHeight = 0;

    this.spritesheet = fillerPic; //Image file
    //var spritesheetFinishedLoading = false;

    var framesLeft = 0;
    var currentFrame = 0;
    //var frameDelays = ArrayWithZeros(this.frameCount); //Array with delay for each frame
    var currentTimestamp = (new Date()).getTime();
    var nextTimestamp = (new Date()).getTime() + this.particleFrameMs;

    this.startX = 45;
    this.startY = 90;
    var x = 45;
    var y = 90;
    this.destX = 155;
    this.destY = 90;
    this.speedX = (this.destX - this.startX) / (this.frameCount * this.particleFrameMs * 30 / 1000); //30/1000 is game's fps in msecond
    this.speedY = (this.destY - this.startY) / this.frameCount;

    this.isAlive = false;
    this.isMoving = true; //could also just mark destX = x etc.
    
    this.init = function () {
        this.particleFrameMs = 1000 / this.particleFPS;
        x = this.startX;
        y = this.startY;
        this.speedX = (this.destX - this.startX) / (this.frameCount * this.particleFrameMs * 30 / 1000); //30/1000 is game's fps in msecond
        this.speedY = (this.destY - this.startY) / this.frameCount;
        nextTimestamp = (new Date()).getTime() + this.particleFrameMs;
    }

    this.party = function () {
        //if (!isAlive) { return; }
        //if (!spritesheetFinishedLoading) { return; }
        //if (!frameDelays) frameDelays = ArrayWithZeros(this.frameCount); // deal with undefined
       
        var p, pnum, pcount;
        for (pnum = 0, pcount = particles.length; pnum < pcount; pnum++) {
            p = particles[pnum];
            if (p && p.isAlive) {
                break;
            }
        }

        this.isAlive = true;
        nextTimestamp = (new Date()).getTime() + this.particleFrameMs;
        particles.push(this);
        console.log("Joined the party!");
        console.log(particles);
        
    }
    
    this.update = function() {

        // get the current time
        currentTimestamp = (new Date()).getTime();

        // animate the particles
        if (this.isAlive) {

             // add delays functionality here if desired
        {
            //p.anim_last_tick = particle_timestamp; // not actually used OPTI

            // moving particles
            if (this.isMoving) {
                console.log("We're movin");
                x += this.speedX;
                y += this.speedY;
                if (x >= this.destX) { x = this.destX; }
            }

            if (currentFrame >= this.frameCount) {
                this.isAlive = false;
                x = this.startX;
                y = this.startY;
                currentFrame = 0;
            }
            else {

                if (currentTimestamp >= nextTimestamp) {
                    nextTimestamp = currentTimestamp + this.particleFrameMs;
                    currentFrame++; // TODO: ping pong anims?
                    }

                }
            }
        }

    }

    this.draw = function (cameraX, cameraY) {
        
        if (!cameraX) cameraX = 0;
        if (!cameraY) cameraY = 0;
        if (this.isAlive) // and visible in screen bbox
        {
            //console.log(currentFrame);
            if (window.canvasContext) // sanity check
            {
                console.log("We're drawing");
                canvasContext.drawImage(this.spritesheet,
                currentFrame * this.spriteWidth, 0,
                this.spriteWidth, this.spriteHeight,
                x - cameraX + (-1 * Math.round(this.spriteWidth / 2)), y - cameraY + (-1 * Math.round(this.spriteHeight / 2)),
                this.spriteWidth, this.spriteHeight);
                
            }
        }
    }
}
function updateParticles() {
    for (i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    for (i = particles.length -1; i >=0 ; i--){
        if (particles[i].isAlive == false){
            particles.splice(i,1);
            console.log("Particle expired \n", "Particles remaining: " + particles.length);
        }
    }
}
function drawParticles() {
    //console.log("Drawing particles now");
    for (i = 0; i < particles.length; i++) {
        particles[i].draw();
    }
}

fireballParty = new Particle();
fireballParty.frameCount = 4;
fireballParty.particleFPS = 4;
fireballParty.spritesheet = fireballSheet;
fireballParty.spriteWidth = 20;
fireballParty.spriteHeight = 10;
fireballParty.init();

lightningParty = new Particle();
lightningParty.frameCount = 6;
lightningParty.particleFPS = 6;
lightningParty.isMoving = false;
lightningParty.spritesheet = lightningSheet;
lightningParty.spriteWidth = 384 / 6;
lightningParty.spriteHeight = 110;
lightningParty.startX = 155;
lightningParty.init();

iceSpikeParty = new Particle();
iceSpikeParty.frameCount = 1;
iceSpikeParty.particleFPS = 1;
iceSpikeParty.isMoving = true;
iceSpikeParty.spritesheet = iceSpikePic;
iceSpikeParty.spriteWidth = 40;
iceSpikeParty.spriteHeight = 20;
iceSpikeParty.init();