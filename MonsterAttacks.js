// Using the Subclass Sandbox pattern

function Attack() {
    this.name = "";

    this.MAX_POWER = 0;

    this.cast = function (target) {
        return; //To override in subclasses
    }

    this.basicCast = function (target) { //Deal damage based on power
        //console.log(this.getPower());
        target.hp -= this.power;
        if (target.hp <= 0) {
            target.hp = 0;
        }
    }

    //These functions have yet to be made. Will be linked to sound/graphics components in place of subclasses
    this.playSound = function () {
        return;
    }
    this.spawnParticles = function () {
        return;
    }
}

function Bite() {
    this.name = "Bite";
    this.MAX_POWER = 30;

    this.cast = function (target) {
        this.basicCast(target);
        this.playSound();
        this.spawnParticles();
    }
}
Bite.prototype = new Attack();
bite = new Bite();

function PoisonSpit() {
    this.name = "Poison Spit";
    this.MAX_POWER = 10;

    this.cast = function (target) {
        this.basicCast(target);
        target.isPoisoned();
        this.playSound();
        this.spawnParticles();
    }
}
PoisonSpit.prototype = new Attack();
poisonSpit = new PoisonSpit();