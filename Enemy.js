
function Enemy() {

    this.x = 155;
    this.y = 125;
    this.img = batPic;

    this.attacks = [bite, poisonSpit];

    this.MAX_HP = 200;
    this.hp = this.MAX_HP;

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
var enemyDefs = [
   { "name": "dragon", "hp": "100" },
   {}
];
var bat = new Enemy();
bat.name = "Bat";
bat.opponent = player; //Eventually, enemies will be assigned when entering the battle state, after being created!
player.opponent = bat;