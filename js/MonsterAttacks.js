//Make all the enemies' spells here

function Bite() {
    this.name = "Bite";
    this.type = "Attack";
    this.MAX_POWER = 30;

    this.cast = function (target) {
        this.basicCast(target);
        this.playSound();
        this.spawnParticles();
    }
}
Bite.prototype = new Spell();
bite = new Bite();

function PoisonSpit() {
    this.name = "Poison Spit";
    this.type = "Attack";
    this.MAX_POWER = 10;

    this.cast = function (target) {
        this.basicCast(target);
        //target.isPoisoned();
        this.playSound();
        this.spawnParticles();
    }
}

PoisonSpit.prototype = new Spell();
poisonSpit = new PoisonSpit();