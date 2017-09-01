
var particles = []; //array containing particles to display

var FAR_AWAY = -999999; //to hide particles

function Particle() {

    this.particleFPS = 1;
    this.particleFrameMs = 1000 / 1;
    this.frameCount = 4;
    this.spriteWidth = 0;
    this.spriteHeight = 0;

    this.spritesheet = fillerPic; //Image file

    var framesLeft = 0;
    var currentFrame = 0;
    this.duration = 0;
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
        this.duration = this.frameCount * this.particleFrameMs; //In milliseconds
        x = this.startX;
        y = this.startY;
        if (!this.isMoving) {
            this.destX = this.startX;
            this.destY = this.startY;
        }
        this.speedX = (this.destX - this.startX) / (this.duration * 30 / 1000); //30 frames per second
        this.speedY = (this.destY - this.startY) / (this.frameCount * this.particleFrameMs * 30 / 1000);
        nextTimestamp = (new Date()).getTime() + this.particleFrameMs;
    };

    this.party = function () {

        this.isAlive = true;
        nextTimestamp = (new Date()).getTime() + this.particleFrameMs;
        particle = this;
        particles.push(particle);
        
    }
    
    this.update = function() {

        // get the current time
        currentTimestamp = (new Date()).getTime();

        // animate the particles
        if (this.isAlive) {

            // add delays functionality here if desired
            // moving particles

            x += this.speedX;
            y += this.speedY;
            if (y >= this.destY + 1) { y = this.destY; }
            if (this.startX <= this.destX) { if (x >= this.destX) { x = this.destX; } } //Major hack. Couldn't figure out why it would overshoot at higher fps, so froze it and it actually makes it seamless...
            else if (this.startX > this.destX) { if (x <= this.destX) { x = this.destX; } } //My god the hacking!

            if (currentFrame >= this.frameCount) {
                this.isAlive = false;
                x = this.startX;
                y = this.startY;
                currentFrame = 0;
            }
            else if (currentTimestamp >= nextTimestamp) {
                    nextTimestamp = currentTimestamp + this.particleFrameMs;
                    currentFrame++;
            }
        }

    };

    this.draw = function (cameraX, cameraY) {

        if (!cameraX) cameraX = 0;
        if (!cameraY) cameraY = 0;
        if (this.isAlive) // and visible in screen bbox
        {
            if (window.canvasContext) // sanity check
            {
                canvasContext.drawImage(this.spritesheet,
                currentFrame * this.spriteWidth, 0,
                this.spriteWidth, this.spriteHeight,
                x - cameraX + (-1 * Math.round(this.spriteWidth / 2)), y - cameraY + (-1 * Math.round(this.spriteHeight / 2)),
                this.spriteWidth, this.spriteHeight);

            }
        }
    };
    this.reset = function () {
        x = this.startX;
        currentFrame = 0;
    }
}
function updateParticles() {
    for (i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    for (i = particles.length -1; i >=0 ; i--){
        if (particles[i].isAlive === false) {
            particles[i].reset();
            particles.splice(i, 1);
            console.log("Particle expired \n", "Particles remaining: " + particles.length);
        }
    }
}
function resetAllParticles() {
    for (i = particles.length - 1; i >= 0 ; i--) {
        particles[i].isAlive = false;
        particles[i].reset();
        particles.splice(i, 1);
        console.log("Particle expired \n", "Particles remaining: " + particles.length);
        }
}

function drawParticles() {
    for (i = 0; i < particles.length; i++) {
        particles[i].draw();
    }
}

function durationInMS(partyDuration) {
    trueDuration = partyDuration * 30 / 1000;
    return trueDuration;
}

//////////////////////////              Player spells              //////////////////////////
fireballParty = new Particle();
fireballParty.frameCount = 4;
fireballParty.particleFPS = 12;
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
iceSpikeParty.particleFPS = 4;
iceSpikeParty.isMoving = true;
iceSpikeParty.spritesheet = iceSpikePic;
iceSpikeParty.spriteWidth = 40;
iceSpikeParty.spriteHeight = 20;
iceSpikeParty.init();

toxicCloudParty = new Particle();
toxicCloudParty.frameCount = 4;
toxicCloudParty.particleFPS = 1;
toxicCloudParty.isMoving = true;
toxicCloudParty.spritesheet = toxicCloudPic;
toxicCloudParty.spriteWidth = 64;
toxicCloudParty.spriteHeight = 64;
toxicCloudParty.startX = 40;
toxicCloudParty.destX = 155;
toxicCloudParty.init();

lifeDrainParty = new Particle();
lifeDrainParty.frameCount = 10;
lifeDrainParty.particleFPS = 10;
lifeDrainParty.isMoving = true;
lifeDrainParty.spritesheet = lifeDrainPic;
lifeDrainParty.spriteWidth = 32;
lifeDrainParty.spriteHeight = 32;
lifeDrainParty.startX = 155;
lifeDrainParty.destX = 40;
lifeDrainParty.init();

dispellParty = new Particle();
dispellParty.frameCount = 28;
dispellParty.particleFPS = 28;
dispellParty.isMoving = false;
dispellParty.spritesheet = dispellPic;
dispellParty.spriteWidth = 32;
dispellParty.spriteHeight = 32;
dispellParty.startX = 155;
dispellParty.startY = 110;
dispellParty.init();

//////////////////////////              Monster Attacks              //////////////////////////

biteParty = new Particle();
biteParty.frameCount = 4;
biteParty.particleFPS = 8;
biteParty.isMoving = false;
biteParty.spritesheet = bitePic;
biteParty.spriteWidth = 64;
biteParty.spriteHeight = 64;
biteParty.init();

slashParty = new Particle();
slashParty.frameCount = 9;
slashParty.particleFPS = 18;
slashParty.isMoving = false;
slashParty.spritesheet = slashPic;
slashParty.spriteWidth = 64;
slashParty.spriteHeight = 64;
slashParty.init();

stingParty = new Particle();
stingParty.frameCount = 4;
stingParty.particleFPS = 12;
stingParty.isMoving = false;
stingParty.spritesheet = stingPic;
stingParty.spriteWidth = 32;
stingParty.spriteHeight = 32;
stingParty.init();

poisonSpitParty = new Particle();
poisonSpitParty.frameCount = 10;
poisonSpitParty.particleFPS = 16;
poisonSpitParty.isMoving = true;
poisonSpitParty.spritesheet = poisonSpitPic;
poisonSpitParty.spriteWidth = 20;
poisonSpitParty.spriteHeight = 20;
poisonSpitParty.startX = 155;
poisonSpitParty.destX = 40;
poisonSpitParty.init();

waterSquirtParty = new Particle();
waterSquirtParty.frameCount = 10;
waterSquirtParty.particleFPS = 16;
waterSquirtParty.isMoving = true;
waterSquirtParty.spritesheet = waterSquirtPic;
waterSquirtParty.spriteWidth = 20;
waterSquirtParty.spriteHeight = 20;
waterSquirtParty.startX = 155;
waterSquirtParty.destX = 40;
waterSquirtParty.init();

///////////////////////           All of this is experimental, not in the game            //////////////////////////////////
createParticle = function (party) {

    party.prototype = new Particle();
    
    if (party.start == "self") {
        party.startX = 40;
        party.startY = 90;
    }
    else if (party.start == "opponent") {
        party.startX = 155;
        party.startY = 90;
    }
    else if (party.start.isArray() && typeof party.start[0] === "number") {
        if (party.start.length == 2) {
            party.startX = party.start[0];
            party.startY = party.start[1];
        }
        else {
            console.log("Error: 'start' array must have two numbers for x,y");
            party.startX = FAR_AWAY;
            party.startY = FAR_AWAY;
        }
    }

    if (party.end === "self") {
        party.destX = 40;
        party.destY = 90;
    }
    else if (party.end == "opponent") {
        party.destX = 155;
        party.destY = 90;
    }
    else if (party.end.isArray() && typeof party.end[0] === "number") {
        if (party.end.length == 2) {
            party.destX = party.end[0];
            party.destY = party.end[1];
        }
        else {
            console.log("Error: 'end' array must have two numbers for x,y");
            party.destX = FAR_AWAY;
            party.destY = FAR_AWAY;
        }
    }
    party.spritesheet = window[party.spritesheet.slice(0, -4) + "Sheet"];

    return party;
}

var partyList = `{
    "fireballParty" : {
        "name" : "Fireball",
        "spritesheet": "fireball.png",
        "number_images": 4,
        "speed": "medium",
        "start": "self",
        "end": "opponent"
        }
}`
var parties = JSON.parse(partyList);
parties.fireballParty = createParticle(parties.fireballParty);

