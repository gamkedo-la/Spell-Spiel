///////////////////////            Monster attack creation            ////////////////////////////

function Bite() {
    this.name = "Bite";
    this.type = "Attack";
    this.particle = biteParty;
    this.power = 50;
    this.castTime = 100;
    this.selfcast = false;

    this.cast = function (target) {
        this.basicCast(target, player.opponent.attackMultiplier);
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
    this.castTime = 100;
    this.selfcast = false;

    this.cast = function (target) {
        this.basicCast(target, player.opponent.attackMultiplier);
        screenshake(10, durationInMS(this.particle.duration));
        Sound.play("slash");
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
    this.castTime = 100;
    this.selfcast = false;

    this.cast = function (target) {
        this.basicCast(target, player.opponent.attackMultiplier);
        screenshake(10, durationInMS(this.particle.duration));
        //target.makePoisoned(3, 5);
        target.delayedEffect.push([(durationInMS(this.particle.duration)), "poisonByEnemy"]);
        Sound.play("waterSquirt", false, 0.3);
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
    this.castTime = 100;
    this.selfcast = false;

    this.cast = function (target) {
        this.basicCast(target, player.opponent.attackMultiplier);
        screenshake(10, durationInMS(this.particle.duration));
        this.spawnParticles(this.particle);
    }
}
Sting.prototype = new Spell();
sting = new Sting();

function Peck() {
    this.name = "Peck";
    this.type = "Attack";
    this.particle = stingParty;
    this.power = 35;
    this.castTime = 115;
    this.selfcast = false;

    this.cast = function (target) {
        this.basicCast(target, player.opponent.attackMultiplier);
        screenshake(10, durationInMS(this.particle.duration));
        this.spawnParticles(this.particle);
    }
}
Peck.prototype = new Spell();
peck = new Peck();

function WaterSquirt() {
    this.name = "Water Squirt";
    this.type = "Attack";
    this.particle = waterSquirtParty;
    this.power = 75;
    this.castTime = 200;
    this.selfcast = false;

    this.cast = function (target) {
        this.basicCast(target, player.opponent.attackMultiplier);
        screenshake(10, durationInMS(this.particle.duration));
        Sound.play("waterSquirt", false, 0.3);
        this.spawnParticles(this.particle);
    }
}
WaterSquirt.prototype = new Spell();
waterSquirt = new WaterSquirt();


function Block() {
    this.name = "Block";
    this.type = "Shield";
    this.power = 25;
    this.selfcast = true;
    this.castTime = 75;

    this.cast = function (target) {
        this.basicCast(target);
        this.playSound();
    }
}
Block.prototype = new Spell();
block = new Block();

function EerieLook() {
    this.name = "Eerie Look";
    this.type = "Debuff";
    this.power = 0;
    this.castTime = 95;
    this.particle = eerieLookParty;
    this.selfcast = false;

    this.cast = function (target) {
        this.basicCast(target,1,0, "Buff Defense 0.6");
        this.particle.party();
        this.playSound();
    }
}
EerieLook.prototype = new Spell();
eerieLook = new EerieLook();

function GetAngry() {
    this.name = "Get angry!";
    this.type = "Buff";
    this.power = 0;
    this.castTime = 95;
    this.particle = rageBuffParty;
    this.selfcast = true;

    this.cast = function (target) {
        this.basicCast(target, 1, 0, "Buff Attack 1.2");
        this.particle.party();
        this.playSound();
    }
}
GetAngry.prototype = new Spell();
getAngry = new GetAngry();
