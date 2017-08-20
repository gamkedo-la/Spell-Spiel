
function Enemy() {

    this.x = 155;
    this.y = 125;
    this.img = batPic;

    this.allAttacks = [bite, poisonSpit, block, slash];
    this.weakAttacks = [bite, slash];
    this.mediumAttacks = [slash];
    this.strongAttacks = [noSpell];
    this.weakShields = [block];

    this.maxHP = 200;
    this.hp = this.maxHP;

    this.chosenOne = noSpell; //the attack that will be used, as determined by AI

    this.untilNextAttack = 100; //frames

    this.drawBattle = function () {
        colorRect(this.x - (this.img.width/this.imgNumber) / 2, this.y - (37), 30, 5, "black");
        colorRect(this.x - (this.img.width/this.imgNumber) / 2, this.y - (37), (this.hp / this.maxHP) * 30, 5, "red");
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
            this.untilNextAttack += 200;
            console.log("Attack: " + this.chosenOne.name);
        }
        //console.log("Until next: " + this.untilNextAttack);
    }

    this.chooseAttack = function () {
        var random = Math.random();
        var index = 0;
        if (player.hp < player.maxHP * 0.2) {
            index = Math.floor(Math.random() * this.weakAttacks.length);
            this.chosenOne = this.weakAttacks[index];
        }
        else if (player.hp > player.maxHP * 0.8) {
            index = Math.floor(Math.random() * this.strongAttacks.length);
            this.chosenOne = this.mediumAttacks[index];
        }
        else if (this.hp < this.maxHP * 0.5) {
            index = Math.floor(Math.random() * this.weakShields.length);
            this.chosenOne = this.weakShields[index];
        }
        else {
            var index = Math.floor(Math.random() * this.allAttacks.length);
            this.chosenOne = this.allAttacks[index];
        }
    }
}
Enemy.prototype = new Character();

var bat = new Enemy();
bat.name = "Echo Mouse";
bat.img = batPic;

var zombie = new Enemy();
zombie.name = "Green Stroller";
zombie.img = zombiePic;
zombie.mediumAttacks = [slash];
zombie.imgNumber = 2;
zombie.cycleImage = true;

var lizard = new Enemy();
lizard.name = "Rad Reptilian";
lizard.img = lizardPic;
lizard.imgNumber = 2;
lizard.cycleImage = true;

var jellyfish = new Enemy();
jellyfish.name = "Aerial Jelly";
jellyfish.img = jellyfishPic;
jellyfish.imgNumber = 2;
jellyfish.cycleImage = true;
jellyfish.allAttacks = [poisonSpit, waterSquirt, bite, block];
jellyfish.weakAttacks = [poisonSpit];
jellyfish.mediumAttacks = [bite];
jellyfish.strongAttacks = [waterSquirt];

var ghostChicken = new Enemy();
ghostChicken.name = "Spooky Cacaw";
ghostChicken.img = ghostChickenPic;
ghostChicken.imgNumber = 2;
ghostChicken.cycleImage = true;

var gauntletOrder = [lizard, ghostChicken, jellyfish, bat, zombie]; //order changed: original order [lizard, ghostChicken, jellyfish, bat, zombie]
var gauntletProgress = 0;

var allEnemies = [lizard, bat, zombie, jellyfish, ghostChicken]; //to use in random battles