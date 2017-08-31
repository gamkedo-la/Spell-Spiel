
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
    this.chosenOne; //the attack that will be used, as determined by AI

    this.untilNextAttack = 100; //frames
    var startingTimer = 100; //before the first enemy attack
    var lastTimer = startingTimer;

    this.drawBattle = function () {
        colorRect(this.position.x - (this.img.width/this.imgNumber) / 2, this.position.y - (37), 30, 5, "black");
        colorRect(this.position.x - (this.img.width / this.imgNumber) / 2, this.position.y - (37), (this.hp / this.maxHP) * 30, 5, "red");
        if (typeof this.chosenOne !== "undefined") { colorRect(this.position.x - (this.img.width / this.imgNumber) / 2, this.position.y, (this.untilNextAttack / lastTimer) * 30, 5, "green"); }
    }

    this.updateAttack = function () {
        if (typeof this.chosenOne === "undefined") { this.chooseAttack();}
        this.untilNextAttack--;
        console.log(this.untilNextAttack);
        if (this.untilNextAttack < 0) {
            this.untilNextAttack = 0; //safety
        }
        if (this.untilNextAttack === 0) {
            //if (typeof this.chosenOne === "undefined") { this.chooseAttack();} //in case no attack was chosen previously
            if (this.chosenOne.type === "Attack") { this.chosenOne.cast(this.opponent); }
            else if (this.chosenOne.type === "Shield" || "Buff") { this.chosenOne.cast(this); }
            this.untilNextAttack += this.chosenOne.untilNext;
            this.chooseAttack(); //pick the next one
            console.log("Attack: " + this.chosenOne.name);

        }
    }

    this.chooseAttack = function () {
        var random = Math.random();
        var index = 0;
        if (typeof this.chosenOne !== "undefined") { lastTimer = this.chosenOne.untilNext; }
        if (player.hp < player.maxHP * 0.2 && this.weakAttacks.length != 0) {
            index = Math.floor(Math.random() * this.weakAttacks.length);
            this.chosenOne = this.weakAttacks[index];
        }
        else if (player.hp > player.maxHP * 0.8 && this.strongAttacks.length != 0) {
            index = Math.floor(Math.random() * this.strongAttacks.length);
            this.chosenOne = this.strongAttacks[index];
        }
        else if (this.hp < this.maxHP * 0.5 && this.weakShields.length != 0 && this.shieldHP===0) {
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
    }
}
Enemy.prototype = new Character();

/////////////////////////////              Enemy creation                 ////////////////////////////////////

//First enemy in gauntlet
var bat = new Enemy();
bat.name = "Echo Mouse";
bat.img = batPic;
bat.maxHP = 300;
bat.expGiven = 10;
bat.weakAttacks = [poisonSpit];
bat.mediumAttacks = [bite];
bat.strongAttacks = [];
bat.weakShields = [];
bat.combineAllAttacks();

//2nd enemy in gauntlet
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

//3rd enemy in gauntlet
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

//4th enemy in gauntlet
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

//5th enemy in gauntlet
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

//6th enemy in gauntlet
var eyeMonster = new Enemy();
eyeMonster.name = "Wiggly Cornea";
eyeMonster.imgNumber = 8;
eyeMonster.cycleImage = true;
eyeMonster.img = eyeMonsterPic;
eyeMonster.cycleDuration = 5;
eyeMonster.weakAttacks = [sting];
eyeMonster.mediumAttacks = [];
eyeMonster.strongAttacks = [waterSquirt];
eyeMonster.weakShields = [];
eyeMonster.combineAllAttacks();

//var gauntletOrder = [jellyfish, lizard, ghostChicken, jellyfish, bat, zombie]; //order changed: original order [lizard, ghostChicken, jellyfish, bat, zombie]
var gauntletOrder = [eyeMonster, bat, jellyfish, ghostChicken, zombie, lizard]; //order changed: original order [lizard, ghostChicken, jellyfish, bat, zombie]
var gauntletProgress = 0;

var allEnemies = [lizard, bat, zombie, jellyfish, ghostChicken]; //to use in random battles