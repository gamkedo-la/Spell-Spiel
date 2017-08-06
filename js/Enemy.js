
function Enemy() {

    this.x = 155;
    this.y = 125;
    this.img = batPic;

    this.attacks = [bite, poisonSpit];

    this.MAX_HP = 200;
    this.hp = this.MAX_HP;

    this.drawBattle = function () {
        colorRect(this.x - (this.img.width/this.imgNumber) / 2, this.y - (37), (this.hp / this.MAX_HP) * 30, 5, "red");
    }

    this.useAttack = function () {
        this.attack = setInterval(function () {
            i = Math.floor(Math.random() * this.attacks.length);
            chosenAttack = this.attacks[i];
            chosenAttack.power = chosenAttack.MAX_POWER;
            chosenAttack.cast(this.opponent);
        }.bind(this), 3000); //Bind so that it takes "this" from the Enemy namespace
    }
    //The whole enemy AI will be more complex than this, the setInterval is just placeholder
}
Enemy.prototype = new Character();

var bat = new Enemy();
bat.name = "Echo Mouse";
bat.img = batPic;

var zombie = new Enemy();
zombie.name = "Green Stroller";
zombie.img = zombiePic;

var jellyfish = new Enemy();
jellyfish.name = "Aerial Jelly";
jellyfish.img = jellyfishPic;
jellyfish.imgNumber = 2;
jellyfish.cycleImage = true;

var ghostChicken = new Enemy();
ghostChicken.name = "Spooky Cacaw";
ghostChicken.img = ghostChickenPic;
ghostChicken.imgNumber = 2;
ghostChicken.cycleImage = true;

var gauntletOrder = [ghostChicken, jellyfish, bat, zombie];
var gauntletProgress = 0;

var allEnemies = [bat, zombie, jellyfish, ghostChicken]; //to use in random battles