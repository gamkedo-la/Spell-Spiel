//Make all the enemies' spells here

function Bite() {
    this.name = "Bite";
    this.type = "Attack";
    this.particle = biteParty;
    this.power = 50;

    this.cast = function (target) {
        this.basicCast(target);
        screenshake(10, this.particle.duration * 30 / 1000);
        this.playSound();
        this.spawnParticles(this.particle);
    }
}
Bite.prototype = new Spell();
bite = new Bite();

function PoisonSpit() {
    this.name = "Poison Spit";
    this.type = "Attack";
    this.particle = poisonSpitParty;
    this.power = 15;

    this.cast = function (target) {
        this.basicCast(target);
        screenshake(10, this.particle.duration *30/1000);
        //target.isPoisoned();
        this.playSound();
        this.spawnParticles(this.particle);
    }
}
PoisonSpit.prototype = new Spell();
poisonSpit = new PoisonSpit();

function Block() {
    this.name = "Block";
    this.type = "Shield";
    this.power = 25;
    this.cast = function (target) {
        this.basicCast(target);
        this.playSound();
    }
}
Block.prototype = new Spell();
block = new Block();