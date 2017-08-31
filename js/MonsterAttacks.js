///////////////////////            Monster attack creation            ////////////////////////////

function Bite() {
    this.name = "Bite";
    this.type = "Attack";
    this.particle = biteParty;
    this.power = 50;
    this.untilNext = 100;

    this.cast = function (target) {
        this.basicCast(target);
        screenshake(10, durationInMS(this.particle.duration));
        this.playSound();
        this.spawnParticles(this.particle);
    }
}
Bite.prototype = new Spell();
bite = new Bite();


//For those who don't really bite lol
function Slash() {
    this.name = "Slash";
    this.type = "Attack";
    this.particle = slashParty;
    this.power = 50;
    this.untilNext = 100;

    this.cast = function (target) {
        this.basicCast(target);
        screenshake(10, durationInMS(this.particle.duration));
        //target.isPoisoned();
        this.playSound();
        this.spawnParticles(this.particle);
    }
}
Slash.prototype = new Spell();
slash = new Slash();


function PoisonSpit() {
    this.name = "Poison Spit";
    this.type = "Attack";
    this.particle = poisonSpitParty;
    this.power = 20;
    this.untilNext = 100;

    this.cast = function (target) {
        this.basicCast(target);
        screenshake(10, durationInMS(this.particle.duration));
        //target.isPoisoned();
        this.playSound();
        this.spawnParticles(this.particle);
    }
}
PoisonSpit.prototype = new Spell();
poisonSpit = new PoisonSpit();


function Sting() {
    this.name = "Sting";
    this.type = "Attack";
    this.particle = stingParty;
    this.power = 20;
    this.untilNext = 100;

    this.cast = function (target) {
        this.basicCast(target);
        screenshake(10, durationInMS(this.particle.duration));
        //target.isStung();
        this.playSound();
        this.spawnParticles(this.particle);
    }
}
Sting.prototype = new Spell();
sting = new Sting();

function WaterSquirt() {
    this.name = "Water Squirt";
    this.type = "Attack";
    this.particle = waterSquirtParty;
    this.power = 75;
    this.untilNext = 200;

    this.cast = function (target) {
        this.basicCast(target);
        screenshake(10, durationInMS(this.particle.duration));
        this.playSound();
        this.spawnParticles(this.particle);
    }
}
WaterSquirt.prototype = new Spell();
waterSquirt = new WaterSquirt();


function Block() {
    this.name = "Block";
    this.type = "Shield";
    this.power = 25;
    this.untilNext = 75;

    this.cast = function (target) {
        this.basicCast(target);
        this.playSound();
    }
}
Block.prototype = new Spell();
block = new Block();