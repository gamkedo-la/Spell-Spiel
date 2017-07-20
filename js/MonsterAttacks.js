//Make all the enemies' spells here

function Bite() {
    this.name = "Bite";
    this.type = "Attack";
    this.ANIM_FRAMES = 30;
    this.MAX_POWER = 30;

    this.cast = function (target) {
        this.basicCast(target);
        screenshake(10, this.ANIM_FRAMES);
        this.playSound();
        this.spawnParticles(PARTICLE_SMOKE,true);
    }
}
Bite.prototype = new Spell();
bite = new Bite();

function PoisonSpit() {
    this.name = "Poison Spit";
    this.type = "Attack";
    this.ANIM_FRAMES = 30;
    this.MAX_POWER = 10;

    this.cast = function (target) {
        this.basicCast(target);
        screenshake(10, this.ANIM_FRAMES);
        //target.isPoisoned();
        this.playSound();
        this.spawnParticles(PARTICLE_POISON,true);
    }
}

PoisonSpit.prototype = new Spell();
poisonSpit = new PoisonSpit();