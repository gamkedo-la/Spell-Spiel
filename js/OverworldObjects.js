// Overworld objects, colliders, NPCs etc


var drawColliders = true;
var drawColliders = false;
///////////////////////            NPC and other trigger objects             /////////////////////////
//Base class
function WorldObject() {
    var currentImg = 0;
    this.imgNumber = 1;
    this.name = "NPC";
    this.img = fillerPic;
    this.cycleDuration = 30; //I doubt NPCs will have anims, but just in case

    //Graphics
    this.setGraphics = function (img, imgNumber, cycleDuration) {
        this.img = img;
        this.imgNumber = imgNumber; //# of images in spritesheet
        this.cycleDuration = cycleDuration;
    };

    this.draw = function () { //On canvas
        var spriteWidth = this.img.width / this.imgNumber;
        canvasContext.drawImage(this.img, currentImg * spriteWidth, 0, spriteWidth,
            this.img.height, this.position.x - (this.img.width / this.imgNumber) / 2,
            this.position.y - this.img.height, spriteWidth, this.img.height);
    };

    this.cycleTick = function () {
        cycleCurrent++;
        if (cycleCurrent >= this.cycleDuration) {
            cycleCurrent = 0;
            currentImg++;
        }
        if (currentImg >= this.imgNumber) {
            currentImg = 0;
        }
    };

    this.onTrigger = function () {
        return; //specific to each
    }
    this.onNotify = function () {
        return; //specific to each
    }
}
////////                                                           CREATION                                                                 ////////
var marieTartine = new WorldObject();
marieTartine.name = "Marie Tartine";
marieTartine.currentMessage = 0;
marieTartine.position = {
    x: 30,
    y: 100,
};
marieTartine.img = marieTartinePic;
marieTartine.spellUnlocked = false;

marieTartine.onTrigger = function () {
    if (holdEnter && !pokebox.isAlive && okToInteract) {
        pokebox.subject.addObserver(this.observer);
        if (this.currentMessage == 0) {
            pokebox.beginText("Marie-Tartine: Hi! Ummm... what was I gonna say.... \n \n Oh yeah! The academy has a lot of creatures to take care of around here. If you walk through that door over there, you can fight your next opponent! Battling is easy: just... incantate? Try casting a Pyroblast to get a feel for it!");
            this.currentMessage++;
        }
        else if (this.currentMessage == 1) {
            pokebox.beginText("Marie-Tartine: Hi again! I forgot to mention... ummmmm.... \n \n Oh yeah! You can talk to that guy over there if you want to fight a random enemy. That way you can earn experience and practice casting spells.");
            this.currentMessage++;
        }
        else if (this.currentMessage == 2) {
            pokebox.beginText("Marie-Tartine: You sure are chatty! I'm not really a talkative type myself though... Oh yeah! I can teach you a new spell if you'd like! But first, you have to show me that you have what it takes. Defeat the first 2 enemies, and I'll show you my special incantation! *slight smile*");
            this.currentMessage++;
        }
        else if ((this.currentMessage == 3 && gauntletProgress >= 2 && !this.spellUnlocked)) {
            pokebox.beginText("Marie-Tartine: Wow! You did it! Ok, then I'll show you the spell I've been working on. The words are 'Toxic Cloud'. It poisons any enemy that breathes it. Those are the secret words that I made myself though: don't go stealing them!");
            //unlockSpell(toxicCloud); //todo
            this.spellUnlocked = true;
            this.currentMessage++;
        }
        else if ((this.currentMessage == 3 && gauntletProgress < 2 && !this.spellUnlocked)) {
            pokebox.beginText("Marie-Tartine: Awww... you still have to beat the 2nd enemy... Go on, I believe in you! ");
        }
        else if (this.currentMessage == 4) { pokebox.beginText("Marie-Tartine: I don't have anything else to teach you. Don't give up!"); }
    }
}

marieTartine.observer = new Observer();
marieTartine.observer.onNotify = function (entity, event) {
    //marieTartine.currentMessage++;
    pokebox.subject.removeObserver(marieTartine.observer);
}
////////////////////////////////////////////////////////////////////////////////////////////////////
var gauntletDoor = new WorldObject();
gauntletDoor.name = "Gauntlet Door";
gauntletDoor.position = {
    x: 175,
    y: 45,
};
gauntletDoor.img = {
    width: 50,
    height: 50
};
gauntletDoor.onTrigger = function () {
    if (holdEnter && okToInteract) {
        gameController.startGauntletBattle();
    }
}
//////////////////////////////////                 Blocking the player (terrain)                /////////////////////////////
var upperWall = new WorldObject();
upperWall.position = {
    x: 100,
    y: 45,
};
upperWall.img = {
    width: 200,
    height: 45,
};

var tables = new WorldObject();
tables.position = {
    x: 80,
    y: 60,
};
tables.img = {
    width: 150,
    height: 40,
};
////////////////////              ROOMS              //////////////////////
//Base class
function Room() {
    var currentImg = 0;
    this.img = fillerPic;
    this.imgNumber = 1;
    this.name = "Room";
    this.cycleDuration = 30; //Cycles could have been used to make animated backgrounds (think weird space stuff behind player), but not in this game lol

    //Graphics
    this.setGraphics = function (img, imgNumber, cycleDuration) {
        this.img = img;
        this.imgNumber = imgNumber; //# of images in spritesheet
        this.cycleDuration = cycleDuration;
    };
    
    this.triggerList = []; //to check triggers
    this.objectList = []; //to check collision
    this.toDraw = []; //to draw

    var roomUp = null;
    var roomDown = null;
    var roomLeft = null;
    var roomRight = null;

    this.checkCollisions = function () {
        this.objectList.forEach(function (obj) {
            if (drawColliders) {
                player.collider.draw();
                obj.collider.draw();
            }
            if (player.collider.checkCollision(obj.collider)) {
                player.moveBack();
                //console.log("Hit!");
            }
        })
    }
    this.checkTriggers = function () {
        this.triggerList.forEach(function (obj) {
            if (player.collider.checkTrigger(obj.collider)) {
                //console.log("Triggered");
                obj.onTrigger();
            }
        })
    }
    this.makeColliders = function () {
        if (!player.hasOwnProperty("collider") && player.img.width && player.img.height) {
            player.collider = new Collider(player.position, player.img.width / player.imgNumber, player.img.height);
        }
        //Covers both triggers and triggers+colliders
        var toMake = this.objectList.concat(this.triggerList);
        toMake.forEach(function (obj) {
            if (!obj.hasOwnProperty("collider") && obj.img.width && obj.img.height) {
                obj.collider = new Collider(obj.position, obj.img.width / obj.imgNumber, obj.img.height);
            }
        })
    }
    this.drawObjects = function () {
        this.toDraw.forEach(function (obj) {
            obj.draw();
        })
        player.draw();
    }
}

mainRoom = new Room();
mainRoom.img = overworldPic;
mainRoom.objectList = [marieTartine, upperWall, tables, gauntletDoor];
mainRoom.triggerList = [marieTartine, gauntletDoor];
mainRoom.toDraw = [marieTartine];
overworldState.changeRoom(mainRoom);

function Collider(position,width,height) {
    this.position = position;
    this.width = width;
    this.height = height;

    var padx = 10;
    var pady = 10;

    this.checkTrigger = function (collobj) {

        var myLeft = this.position.x - this.width/2;
        var myRight = this.position.x + this.width/2;
        var myTop = this.position.y - this.height;
        var myDown = this.position.y;

        var otherLeft = collobj.position.x - collobj.width / 2;
        var otherRight = collobj.position.x + collobj.width/2;
        var otherTop = collobj.position.y - collobj.height;
        var otherDown = collobj.position.y;

        return (myLeft >= otherRight || 
            myRight <= otherLeft ||
            myTop >= otherDown ||
            myDown <= otherTop) == false;
    };

    this.checkCollision = function (collobj) {

        var myLeft = this.position.x - this.width/2 + padx;
        var myRight = this.position.x + this.width/2 - padx;
        var myTop = this.position.y - this.height;
        var myDown = this.position.y - pady;

        var otherLeft = collobj.position.x - collobj.width / 2 + padx;
        var otherRight = collobj.position.x + collobj.width/2 - padx;
        var otherTop = collobj.position.y - collobj.height;
        var otherDown = collobj.position.y - pady;

        return (myLeft >= otherRight || 
            myRight <= otherLeft ||
            myTop >= otherDown ||
            myDown <= otherTop) == false;
    };
    this.draw = function () {
        colorRect(this.position.x - this.width / 2, this.position.y - this.height, this.width, this.height, "green");
        colorRect(this.position.x - this.width / 2 + padx, this.position.y - this.height, this.width - 2 * padx, this.height - pady, "black");
        colorCircle(this.position.x, this.position.y, 1, "red");
    }

}