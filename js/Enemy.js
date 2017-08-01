
function Enemy() {

    this.x = 155;
    this.y = 125;
    this.img = batPic;

    this.attacks = [bite, poisonSpit];

    this.MAX_HP = 10;
    this.hp = this.MAX_HP;

    this.drawBattle = function () {
        colorRect(this.x - this.img.width / 2, this.y - (37), (this.hp / this.MAX_HP) * 30, 5, "red");
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
bat.name = "Bat";
bat.opponent = player; //Eventually, enemies will be assigned when entering the battle state, after being created!

var zombie = new Enemy();
zombie.name = "Zombie";
zombie.opponent = player;
zombie.img = zombiePic;
player.opponent = zombie;
//player.opponent = bat;


var gauntletOrder = [bat, zombie];
var gauntletProgress = 0;

var allEnemies = [bat, zombie]; //to use in random battles