
//var particles_enabled = true;
var particles = []; // a SpriteList containing all of them

var PARTICLE_FPS = 8/2;
var PARTICLE_FRAME_MS = 1000 / PARTICLE_FPS; // 15 = 60fps - looks fine much slower too
var FAR_AWAY = -999999;

function Particle() {

    var frameCount;
    var spriteWidth;
    var spriteHeight;

    var spritesheet; //Image file
    //var spritesheetFinishedLoading = false;

    var framesLeft = 0;
    var currentFrame = 0;
    var frameDelays = ArrayWithZeros(this.frameCount); //Array with delay for each frame
    var currentTimestamp = (new Date()).getTime();
    var nextTimestamp = (new Date()).getTime() + PARTICLE_FRAME_MS;

    var x = 45;
    var y = 90;
    var xVelocity = 0;
    var yVelocity = 0;

    this.isAlive = false;

    this.party = function () {
        //if (!isAlive) { return; }
        //if (!spritesheetFinishedLoading) { return; }
        if (!frameDelays) frameDelays = ArrayWithZeros(this.frameCount); // deal with undefined


        /*
        var p, pnum, pcount;
        for (pnum = 0, pcount = particles.length; pnum < pcount; pnum++) {
            p = particles[pnum];
            if (p && isAlive) {
                break;
            }
        }*/
        this.isAlive = true;
        nextTimestamp = (new Date()).getTime() + PARTICLE_FRAME_MS;
        particles.push(this);
        console.log("Joined the party");
        console.log(particles);
        

        /*
        // we need a new particle!
        if (!p || !p.inactive) {
            //console.log('No inactive particles. Adding particle #' + pcount);
            var particle = { x: FAR_AWAY, y: FAR_AWAY, inactive: true };
            // remember this new particle in our system and reuse
            particles.push(particle);
            p = particle;
        }*/
    }

    this.update = function() {

        //if (!particles_enabled) return;

        // get the current time
        currentTimestamp = (new Date()).getTime();
        console.log(currentTimestamp, nextTimestamp);
        console.log(currentFrame);

        //activeParticleCount = 0;

        // animate the particles
        if (this.isAlive) {

            //activeParticleCount++;

            if (frameDelays[currentFrame] > 0) {
                //log('delaying particle: ' + p.delayFrames)
                frameDelays[currentFrame]--;
            }
            else // no more delay for this sprite:
            {
                //p.anim_last_tick = particle_timestamp; // not actually used OPTI

                // moving particles
                /*if (p.moving) {
                    p.x += p.speedX;
                    p.y += p.speedY;
                }*/

                if (currentFrame >= this.frameCount) {
                    //console.log('particle anim ended');
                    //x = y = FAR_AWAY; // throw offscreen DOESNTTTTTTTTTTTT ACTUALLLLYY WORKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK
                    this.isAlive = false;
                    currentFrame = 0;
                }
                else {

                    if (currentTimestamp >= nextTimestamp) {
                        console.log("Gonna boost the frames now");
                        nextTimestamp = currentTimestamp + PARTICLE_FRAME_MS;
                        currentFrame++; // TODO: ping pong anims?
                        }

                    }
                }
            }
/*
    if ((active_particle_count > 0)
		&& (prev_active_particle_count != active_particle_count)) {
        // console.log('Active particles: ' + active_particle_count);
        prev_active_particle_count = active_particle_count;
        }
*/
    }
    /*
    this.clear = function() { //TODO
        console.log('clearParticles');
        particles.forEach(function (p) {
            p.x = p.y = FAR_AWAY; // throw offscreen
            p.inactive = true;
        });
    }*/

    this.draw = function (cameraX, cameraY) {
        //console.log('draw_particles');
        if (!cameraX) cameraX = 0;
        if (!cameraY) cameraY = 0;
                if (this.isAlive) // and visible in screen bbox
                {
                    //console.log(currentFrame);
                    if (window.canvasContext) // sanity check
                    {
                        console.log(currentFrame);
                        canvasContext.drawImage(this.spritesheet,
                        currentFrame * this.spriteWidth, 0,
                        this.spriteWidth, this.spriteHeight,
                        x - cameraX + (-1 * Math.round(this.spriteWidth / 2)), y - cameraY + (-1 * Math.round(this.spriteHeight / 2)),
                        this.spriteWidth, this.spriteHeight);
                    }
                }
            }
}

//var activeParticleCount = 0; // how many we updated last frame

//var prev_active_particle_count = 0;

/*
function init_particles() {
    console.log('init_particles...');
    spritesheet_image = new Image();
    spritesheet_image.src = 'images/particles.png';
    spritesheet_image.onload = function () {
        console.log('particles.png loaded.');
        spritesheet_image_finished_loading = true;
    }
    spritesheet_image.onerror = function () {
        console.log('Failed to download particles.png.');
    }
}

init_particles(); // immediately
*/

function clearParticles() {
    console.log('clearParticles');
    particles.forEach(function (p) {
        p.x = p.y = FAR_AWAY; // throw offscreen
        p.isAlive = false;
    });
}

function updateParticles() {
    for (i = 0; i < particles.length; i++) {
        particles[i].update();
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
fireballParty.spritesheet = fireballSheet;
fireballParty.spriteWidth = 20;
fireballParty.spriteHeight = 10;
