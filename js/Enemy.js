
function Enemy() {

    this.position.x = 155;
    this.position.y = 125;
    this.img = fillerPic;

    this.allAttacks = [];
    this.weakAttacks = [];
    this.mediumAttacks = [];
    this.strongAttacks = [];

    this.weakShields = [];
    this.mediumShields = [];
    this.strongShields = [];

    this.weakBuffs = [];
    this.mediumBuffs = [];
    this.strongBuffs = [];

    this.weakDebuffs = [];
    this.mediumDebuffs = [];
    this.strongDebuffs = [];

    this.maxHP = 200;
    this.hp = this.maxHP;
    this.expGiven = 0;
    this.chosenOne; //the attack that will be used, as determined by AI

    this.untilAttack = 200; //frames
    //this.untilAttack = 10; //frames
    var lastAttack;
    this.goodChoiceMade = false; //good choice == not randomized because I didn't have the attack I wanted

    this.drawBattle = function () {
        colorRect((this.position.x - 4 - (this.img.width / this.imgNumber) / 2), (this.position.y - this.img.height - 52), 61, 49, "#e0ffff");
        colorRect((this.position.x - 3 - (this.img.width / this.imgNumber) / 2), (this.position.y - this.img.height - 51), 59, 47, "#4d004d");
        colorRect(this.position.x - (this.img.width / this.imgNumber) / 2, this.position.y - (47), 30, 5, "black");
        colorRect(this.position.x - (this.img.width / this.imgNumber) / 2, this.position.y - (47), (this.hp / this.maxHP) * 30, 5, "red");
        if (typeof this.chosenOne !== "undefined") { colorRect(this.position.x - (this.img.width / this.imgNumber) / 2, this.position.y - (42), (this.untilAttack / this.chosenOne.castTime) * 30, 5, "teal"); }

        if (this.attackMultiplier > 1) {
            canvasContext.drawImage(attackBuffPic, (this.position.x - 2 - (this.img.width / this.imgNumber) / 2), (this.position.y - this.img.height - 50));
        }
        if (this.attackMultiplier < 1) {
            canvasContext.drawImage(attackDebuffPic, (this.position.x - 2 - (this.img.width / this.imgNumber) / 2), (this.position.y - this.img.height - 50));
        }
        if (this.defenseMultiplier > 1) {
            canvasContext.drawImage(defenseBuffPic, (this.position.x + 8  - (this.img.width / this.imgNumber) / 2), (this.position.y - this.img.height - 50));
        }
        if (this.defenseMultiplier < 1) {
            canvasContext.drawImage(defenseDebuffPic, (this.position.x + 8 - (this.img.width / this.imgNumber) / 2), (this.position.y - this.img.height - 50));
        }
    }

    this.updateAttack = function () {
        if (typeof this.chosenOne === "undefined") { this.chooseAttack();}
        this.untilAttack--;
        if (this.untilAttack < 0) {
            this.untilAttack = 0; //safety
        }
        if (this.untilAttack === 0) {
            if (this.chosenOne.selfcast === true) { this.chosenOne.cast(this); }
            else { this.chosenOne.cast(this.opponent); }
            this.chooseAttack(); //pick the next one
            this.untilAttack = this.chosenOne.castTime;
        }
    }

    this.chooseAttack = function () {
        var random = Math.random();
        var index = 0;
        this.goodChoiceMade = false;
        //if (typeof this.chosenOne !== "undefined") { lastTimer = this.chosenOne.castTime; } //for the countdown bar


            //The player's low! Gonna use weak attacks to finish him!
        if (player.hp < player.maxHP * 0.2 && player.shieldHP === 0) {
            this.chosenOne = this.pickRandom("Weak", "Attack");
        }
            //I'm low! Gonna use a shield!
        else if (this.hp < this.maxHP * 0.5 && this.shieldHP === 0) {
            this.chosenOne = this.pickRandom("Strong", "Shield");
        }
            //The player is using a shield! No point in attacking; gonna buff
        else if (player.shieldHP >= player.maxHP * 0.1) {
            console.log("!!!");
            this.chosenOne = this.pickRandom("Medium", "Buff");
        }
            //I have high HP, I can cast a strong attack safely
        else if (this.hp >= this.maxHP * 0.8) {
            this.chosenOne = this.pickRandom("Strong", "Attack");
        }
            //The player's health is high. Strong buffs/debuffs are worth investing in right now
        else if (player.hp > player.maxHP * 0.8) {
            if (this.attackMultiplier <= 1 && this.defenseMultiplier <= 1) {
                this.chosenOne = this.pickRandom("Strong", "Buff");
            }
            else if (player.attackMultiplier >= 1 && player.defenseMultiplier >= 1) {
                this.chosenOne = this.pickRandom("Strong", "Debuff");
            }
        }

            //screw it, I'll pick a random attack
        else {
            console.log("Chose random");
            this.chosenOne = this.pickRandom();
        }
    }
    this.pickRandom = function (strength, type) {
        var index;
        var random = Math.random();
        var toPick;
        switch (strength) {

            case "Strong":
                switch (type) {
                    case "Attack":
                        toPick = this.strongAttacks;
                        break;
                    case "Shield":
                        toPick = this.strongShields;
                        break;
                    case "Buff":
                        toPick = this.strongBuffs;
                        break;
                    case "Debuff":
                        toPick = this.strongDebuffs;
                        break;
                }
                if (toPick.length === 0) {
                    strength = "Medium";
                }
                else { break; }

            case "Medium":
                switch (type) {
                    case "Attack":
                        toPick = this.mediumAttacks;
                    case "Shield":
                        toPick = this.mediumShields;
                        break;
                    case "Buff":
                        toPick = this.mediumBuffs;
                        break;
                    case "Debuff":
                        toPick = this.mediumDebuffs;
                        break;
                }
                if (toPick.length === 0) { strength = "Weak"; }
                else { break; }

            case "Weak":
                switch (type) {
                    case "Attack":
                        toPick = this.weakAttacks;
                        break;
                    case "Shield":
                        toPick = this.weakShields;
                        break;
                    case "Buff":
                        toPick = this.weakBuffs;
                        break;
                    case "Debuff":
                        toPick = this.weakDebuffs;
                        break;
                }
                if (toPick.length === 0) { toPick = this.allAttacks; }
        }
        if (typeof toPick === "undefined") { toPick = this.allAttacks; } //if no such attack, pick a random
        else { this.goodChoiceMade = true; } //we've succesfully picked something not random (intentional randoms (not providing any arguments) is considered good)
        index = Math.floor(Math.random() * toPick.length);
        return toPick[index];
    }
    this.castFailed = function () {
        this.chooseAttack();
        this.untilAttack = this.chosenOne.castTime; 
    }
    this.combineAllAttacks = function () {
        this.allAttacks = this.weakAttacks.concat(this.mediumAttacks, this.strongAttacks, this.weakShields, this.mediumShields, this.strongShields, this.weakBuffs, this.mediumBuffs, this.strongBuffs, this.weakDebuffs, this.mediumDebuffs, this.strongDebuffs);
    }
}
Enemy.prototype = new Character();

castFailed = function (enemy) {
    if (typeof enemy.chosenOne === "undefined") {
        console.log("Accessed");
        enemy.chooseAttack();
        enemy.untilAttack = enemy.chosenOne.castTime;
    }
}

/////////////////////////////              Enemy creation                 ////////////////////////////////////

//First enemy in gauntlet
var bat = new Enemy();
bat.name = "Echo Mouse";
bat.img = batPic;
bat.maxHP = 300;
bat.expGiven = 10;
bat.imgNumber = 2;
bat.cycleImage = true;
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
eyeMonster.maxHP = 350;
eyeMonster.expGiven = 100;
eyeMonster.cycleImage = true;
eyeMonster.img = eyeMonsterPic;
eyeMonster.cycleDuration = 5;
//eyeMonster.weakAttacks = [sting];
eyeMonster.mediumAttacks = [slash];
//eyeMonster.strongAttacks = [waterSquirt];
//eyeMonster.weakShields = [block];
//eyeMonster.mediumDebuffs = [eerieLook];
eyeMonster.combineAllAttacks();

//var gauntletOrder = [jellyfish, lizard, ghostChicken, jellyfish, bat, zombie]; //order changed: original order [lizard, ghostChicken, jellyfish, bat, zombie]
var gauntletOrder = [bat, jellyfish, eyeMonster, ghostChicken, zombie, lizard]; //order changed: original order [lizard, ghostChicken, jellyfish, bat, zombie]
var gauntletProgress = 0;

var allEnemies = [lizard, bat, zombie, jellyfish, ghostChicken, eyeMonster]; //to use in random battles