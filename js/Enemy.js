
function Enemy() {

    this.position.x = 155;
    this.position.y = 125;
    this.img = batPic;

    this.allAttacks = [];
    this.weakAttacks = [];
    this.mediumAttacks = [];
    this.strongAttacks = [];
    this.weakShields = [];

    this.maxHP = 200;
    this.hp = this.maxHP;
    this.expGiven = 0;
    this.chosenOne = noSpell; //the attack that will be used, as determined by AI

    this.untilNextAttack = 100; //frames

    this.drawBattle = function () {
        colorRect(this.position.x - (this.img.width/this.imgNumber) / 2, this.position.y - (37), 30, 5, "black");
        colorRect(this.position.x - (this.img.width/this.imgNumber) / 2, this.position.y - (37), (this.hp / this.maxHP) * 30, 5, "red");
    }

    /*
    this.useAttack = function () {
        this.attack = setInterval(function () {
            i = Math.floor(Math.random() * this.attacks.length);
            chosenAttack = this.attacks[i];
            chosenAttack.power = chosenAttack.maxPower;
            chosenAttack.cast(this.opponent);
        }.bind(this), 3000); //Bind so that it takes "this" from the Enemy namespace
    }*/

    this.updateAttack = function () {
        this.untilNextAttack--;
        if (this.untilNextAttack < 0) {
            this.untilNextAttack = 0; //safety
        }
        if (this.untilNextAttack === 0) {
            this.chooseAttack();
            if (this.chosenOne.type === "Attack") { this.chosenOne.cast(this.opponent); }
            else if (this.chosenOne.type === "Shield" || "Buff") { this.chosenOne.cast(this); }
            this.untilNextAttack += this.chosenOne.untilNext;
            console.log("Attack: " + this.chosenOne.name);
        }
    }

    this.chooseAttack = function () {
        var random = Math.random();
        var index = 0;
        if (player.hp < player.maxHP * 0.2 && this.weakAttacks.length != 0) {
            index = Math.floor(Math.random() * this.weakAttacks.length);
            this.chosenOne = this.weakAttacks[index];
        }
        else if (player.hp > player.maxHP * 0.8 && this.strongAttacks.length != 0) {
            index = Math.floor(Math.random() * this.strongAttacks.length);
            this.chosenOne = this.strongAttacks[index];
        }
        else if (this.hp < this.maxHP * 0.5 && this.weakShields.length != 0) {
            index = Math.floor(Math.random() * this.weakShields.length);
            this.chosenOne = this.weakShields[index];
        }
        //screw it, I'll pick a random attack
        else {
            console.log("Chose random");
            var index = Math.floor(Math.random() * this.allAttacks.length);
            this.chosenOne = this.allAttacks[index];
        }
    }
    this.combineAllAttacks = function () {
        this.allAttacks = this.weakAttacks.concat(this.mediumAttacks, this.strongAttacks, this.weakShields);
        console.log(this.allAttacks);
    }
}
Enemy.prototype = new Character();

/////////////////////////////              Enemy creation                 ////////////////////////////////////

var bat = new Enemy();
bat.name = "Echo Mouse";
bat.img = batPic;
bat.maxHP = 500;
bat.expGiven = 10;
bat.weakAttacks = [poisonSpit];
bat.mediumAttacks = [bite];
bat.strongAttacks = [];
bat.weakShields = [];
bat.combineAllAttacks();


var zombie = new Enemy();
zombie.name = "Green Stroller";
zombie.img = zombiePic;
zombie.maxHP = 750;
zombie.expGiven = 17
zombie.imgNumber = 2;
zombie.cycleImage = true;
zombie.weakAttacks = [];
zombie.mediumAttacks = [bite];
zombie.strongAttacks = [];
zombie.weakShields = [block];
zombie.combineAllAttacks();

var lizard = new Enemy();
lizard.name = "Rad Reptilian";
lizard.expGiven = 23;
lizard.img = lizardPic;
lizard.imgNumber = 2;
lizard.cycleImage = true;
lizard.weakAttacks = [];
lizard.mediumAttacks = [slash];
lizard.strongAttacks = [];
lizard.weakShields = [block];
lizard.combineAllAttacks();

var jellyfish = new Enemy();
jellyfish.name = "Aerial Jelly";
jellyfish.img = jellyfishPic;
jellyfish.maxHP = 10;
jellyfish.imgNumber = 2;
jellyfish.cycleImage = true;
jellyfish.weakAttacks = [sting];
jellyfish.mediumAttacks = [];
jellyfish.strongAttacks = [waterSquirt];
jellyfish.weakShields = [];
jellyfish.combineAllAttacks();

var ghostChicken = new Enemy();
ghostChicken.name = "Spooky Cacaw";
ghostChicken.imgNumber = 2;
ghostChicken.cycleImage = true;
ghostChicken.img = ghostChickenPic;
ghostChicken.weakAttacks = [sting];
ghostChicken.mediumAttacks = [];
ghostChicken.strongAttacks = [waterSquirt];
ghostChicken.weakShields = [];
ghostChicken.combineAllAttacks();

var gauntletOrder = [jellyfish, lizard, ghostChicken, jellyfish, bat, zombie]; //order changed: original order [lizard, ghostChicken, jellyfish, bat, zombie]
var gauntletProgress = 0;

var allEnemies = [lizard, bat, zombie, jellyfish, ghostChicken]; //to use in random battles