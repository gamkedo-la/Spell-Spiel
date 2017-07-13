
function Monster() {

    this.x = 155;
    this.y = 125;
    this.img = batPic;

    this.attacks = [bite, poisonSpit];

    this.MAX_HP = 200;
    this.hp = this.MAX_HP;

    this.useAttack = setInterval(function () {
        i = Math.floor(Math.random() * this.attacks.length);
        chosenAttack = this.attacks[i];
        //console.log(this.name + " used " + chosenAttack.name);
        //console.log(chosenAttack.power);
        //console.log(chosenAttack.getPower());
        chosenAttack.power = chosenAttack.MAX_POWER;
        chosenAttack.cast(this.opponent);
    }.bind(this), 3000); //Bind so that it takes "this" from the Monster namespace

}
Monster.prototype = new Character();
var enemyDefs = [
   { "name": "dragon", "hp": "100" },
   {}
];
var bat = new Monster();
bat.name = "Bat";
bat.opponent = player;
player.opponent = bat;