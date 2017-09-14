// Overworld objects, colliders, NPCs etc


var drawColliders = true;
var drawColliders = false;
///////////////////////            NPC and other trigger objects             /////////////////////////
//Base class
function WorldObject() {
    var currentImg = 0;
    this.imgNumber = 1;
    this.name = "World Object";
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
marieTartine.name = "Marie-Tartine";
marieTartine.currentMessage = 0;
marieTartine.position = {
    x: 30,
    y: 90,
};
marieTartine.img = marieTartinePic;
marieTartine.spellUnlocked = false;

marieTartine.onTrigger = function () {
    if (holdEnter && !messageActive && okToInteract) {
        pokebox.subject.addObserver(this.observer);
        if (this.currentMessage == 0) {
            pokebox.beginText(this.name + ": " + "Hi! Ummm... what was I gonna say.... \b Oh yeah! The Academy has a lot of creatures to take care of around here. If you walk through that door over there, you can fight your next opponent! \b Battling is easy: just... incantate? Try casting a Pyroblast to get a feel for it!");
            this.currentMessage++;
        }
        else if (this.currentMessage == 1) {
            pokebox.beginText(this.name + ": " + "Hi again! I forgot to mention... ummmmm.... \b Oh yeah! You can talk to that guy over there if you want to fight a random enemy. That way you can earn experience and practice casting spells.");
            this.currentMessage++;
        }
        else if (this.currentMessage == 2) {
            pokebox.beginText(this.name + ": " + "You sure are chatty! I'm not really a talkative type myself though... \b Oh yeah! I can teach you a new spell if you'd like! But first, you have to show me that you have what it takes. Defeat the first 2 enemies, and I'll show you my special incantation! *slight smile*");
            this.currentMessage++;
        }
        else if ((this.currentMessage == 3 && gauntletProgress >= 2 && !this.spellUnlocked)) {
            pokebox.beginText(this.name + ": " + "Wow! You did it! Ok, then I'll show you the spell I've been working on. The words are 'Toxic Cloud'. It poisons any enemy that breathes it. Those are the secret words that I made myself though: don't go stealing them!");
            toxicCloud.isUnlocked = true;
            this.spellUnlocked = true;
            this.currentMessage++;
        }
        else if ((this.currentMessage == 3 && gauntletProgress < 2 && !this.spellUnlocked)) {
            pokebox.beginText(this.name + ": " + "Awww... you still have to beat the 2nd enemy... Go on, I believe in you! ");
        }
        else if (this.currentMessage == 4) { pokebox.beginText("Marie-Tartine: I don't have anything else to teach you. Don't give up!"); }
    }
}

marieTartine.observer = new Observer();
marieTartine.observer.onNotify = function (entity, event) {
    //marieTartine.currentMessage++;
    pokebox.subject.removeObserver(marieTartine.observer);
}
////////////////////////////////////////////////////////////////////////////////////////////////
var guideNPC1 = new WorldObject();
guideNPC1.name = "Ekktor";
guideNPC1.currentMessage = 0;
guideNPC1.position = {
    x: 150,
    y: 90,
};
guideNPC1.img = guideNPC1Pic;
guideNPC1.onTrigger = function () {
    if (holdEnter && !messageActive && okToInteract) {
        if (this.currentMessage == 0) {
            pokebox.beginText(this.name + ": " + "In battle, it's important to keep focusing on your spellcast. If you don't complete your incantation fast enough, it'll fail! Not only that, when you do cast your spell, you'll have less time for the next cast. You have to mix it up and let your spells recharge! \b If you want to practice, pretty sure the Academy has a training room somewhere around here...");
            this.currentMessage++;
        }
        else { pokebox.beginText(this.name + ": " + "It's not about how much time you have, it's about how you use it!"); }
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
var noStyleNPC = new WorldObject();
noStyleNPC.name = "Keven";
noStyleNPC.currentMessage = 0;
noStyleNPC.position = {
    x: 180,
    y: 90,
};
var completedTraining = true;
noStyleNPC.img = noStyleNPCPic;
noStyleNPC.onTrigger = function () {
    if (holdEnter && !messageActive && okToInteract) {
        if (this.currentMessage === 0) {
            pokebox.beginText(this.name + ": "+ "People tell me I don't have style, but I don't really pay them much attention. I've become so happy since I stopped listening and just wear and do what I like. I can teach you my secret technique for this, but first you have to defeat an enemy in the training facility.");
            this.currentMessage++;
        }
        else if (this.currentMessage === 1 && completedTraining) {
            pokebox.beginText(this.name + ": " + "Hey, you did it! Here are the secret words I use to protect myself from mean comments. It's 'DNDC: Don't know don't care'. Might be useful against mean attacks as well.");
            this.currentMessage++;
        }
        else if (this.currentMessage === 1 && !completedTraining) {
            pokebox.beginText(this.name + ": " + "Come on! Just go for a quick training, it won't take long!");
        }
        else if (this.currentMessage === 2) {
            pokebox.beginText(this.name + ": " + "What do you mean it's spelled wrong? Whatever...");
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////
var randomBattleNPC = new WorldObject();
randomBattleNPC.name = "Robby";
randomBattleNPC.currentMessage = 0;
randomBattleNPC.position = {
    x: 120,
    y: 100,
};
randomBattleNPC.img = stylishNPCPic;
randomBattleNPC.onTrigger = function () {
    if (holdEnter && !messageActive && okToInteract) {
        if (this.currentMessage === 0) {
            pokebox.beginText(this.name + ": " + "Hey, Beam, my man! Don't worry bro, our club's got everything under control here. You go man the front door. \b Though if you want, we've been keepin' a few monsters on the side for ya. You know, if you wanna practice a lil' bit. Anyway, if you wanna try your hand at it, you just gimme the word.");
            this.currentMessage++;
        }
        else if (this.currentMessage >= 1) {
            pokebox.subject.addObserver(randomBattleNPC.observer);
            pokebox.beginText(this.name + ": " + "You wanna fight one of our spare targets? Come over here, we got a good one for ya!");
        }
    }
}
randomBattleNPC.observer = new Observer();
randomBattleNPC.observer.onNotify = function (entity, event) {
    gameController.startRandomBattle();
    pokebox.subject.removeObserver(randomBattleNPC.observer);
}
////////////////////////////////////////////////////////////////////////////////////////////////////
var marine = new WorldObject();
marine.name = "Marine";
marine.currentMessage = 0;
marine.position = {
    x: 60,
    y: 90,
};
marine.img = marinePic;
marine.onTrigger = function () {
    if (holdEnter && !messageActive && okToInteract) {
        if (this.currentMessage === 0) {
            pokebox.beginText(this.name + ": " + "Hummmm..... Should I start my long homework due in a week, or my short homework due tomorrow?");
            this.currentMessage++;
        }
        else if (this.currentMessage === 1) {
            pokebox.subject.addObserver(marine.observer);
            pokebox.beginText(this.name + ": " + "Hummmm.... Should I continue resisting changing my shirt color just cause it fits with my name? \b ... \b I mean, I can't change my name....");
            this.currentMessage++;
        }
        else if (this.currentMessage === 2) {
            pokebox.subject.addObserver(marine.observer);
            pokebox.beginText(this.name + ": " + "Hummmm.... Should I consider talking to others instead of constantly thinking to myself all the time?");
        }
    }
}
marine.observer = new Observer();
marine.observer.onNotify = function (entity, event) {
    //gameController.startRandomBattle();
    pokebox.subject.removeObserver(marine.observer);
}
////////////////////////////////////////////////////////////////////////////////////////////////////
var quitterie = new WorldObject();
quitterie.name = "Quitterie";
quitterie.currentMessage = 0;
quitterie.position = {
    x: 90,
    y: 80,
};
quitterie.img = quitteriePic;
quitterie.onTrigger = function () {
    if (holdEnter && !messageActive && okToInteract) {
        if (this.currentMessage === 0) {
            pokebox.beginText(this.name + ": " + "Hi Beam! You're in luck, everyone's outside fighting monsters, so the training dummy's free! I've been hogging it a lot these days; why don't you give it a try?");
            this.currentMessage++;
        }
        else if (this.currentMessage === 1) {
            pokebox.subject.addObserver(quitterie.observer);
            pokebox.beginText(this.name + ": " + "Here, have a shot at the dummy!");
        }
    }
}
quitterie.observer = new Observer();
quitterie.observer.onNotify = function (entity, event) {
    gameController.startBattle(dummy);
    pokebox.subject.removeObserver(quitterie.observer);
}
////////////////////////////////////////////////////////////////////////////////////////////////////
var libraryNPC = new WorldObject();
libraryNPC.name = "Funder";
libraryNPC.currentMessage = 0;
libraryNPC.position = {
    x: 80,
    y: 70,
};
libraryNPC.img = libraryNPCPic;
libraryNPC.onTrigger = function () {
    if (holdEnter && !messageActive && okToInteract) {
        if (this.currentMessage === 0) {
            pokebox.beginText(this.name + ": " + "Again, monsters around school! It's a shame I have too many studies to go and help out! (hehe...) \b Besides, Robby and his gang would probably take all the glory anyway, no point in going. \b ... \b What? You say you're gonna fight them too? That's insane! \b I mean... now I really want to go...");
            this.currentMessage++;
        }
        else if (this.currentMessage == 1) {
            pokebox.subject.addObserver(libraryNPC.observer);
            pokebox.beginText(this.name + ": " + "Listen, if you're helping with school defense, I might as well show you what I've been working on around here. \b Have a look at that! It's a super powerful lightning spell, and the incantation is pretty long too. I'll show you, but first I need you to do me a favor. There's this... avian invader. A sort of Spectral Fowl. It haunts me every night, and it... disrupts my studies. Defeat it, and I'll show you that lightning I was talking to you about.");
            this.currentMessage++;
        }
        else if ((this.currentMessage == 2 && gauntletProgress >= 2 && !this.spellUnlocked)) {
            pokebox.beginText(this.name + ": " + "YOU DID IT! \b I mean... nice going! I can feel the ethereal pecking ceasing. The words for my super spell are 'XxX Lightning Smite Eternal XxX'. Look, I didn't come up with them. Don't judge, the author's probably a genius... \b Aaaaanyway, good luck!");
            //unlockSpell(toxicCloud); //todo
            this.spellUnlocked = true;
            lightning.isUnlocked = true;
            this.currentMessage++;
        }
        else if ((this.currentMessage == 2 && gauntletProgress < 4 && !this.spellUnlocked)) {
            pokebox.beginText(this.name + ": " + " Make the pecking stop, I beg of you!!! ");
        }
        else if (this.currentMessage == 3) {
            pokebox.beginText("Thanks agin my dear friend!");
        }
    }
}
libraryNPC.observer = new Observer();
libraryNPC.observer.onNotify = function (entity, event) {
    //gameController.startRandomBattle();
    pokebox.subject.removeObserver(libraryNPC.observer);
}
////////////////////////////////////////////////////////////////////////////////////////////////////
var gauntletDoor = new WorldObject();
gauntletDoor.name = "Gauntlet Door";
gauntletDoor.position = {
    x: 100,
    y: 65,
};
gauntletDoor.img = {
    width: 40,
    height: 60
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
    y: 65,
};
upperWall.img = {
    width: 240,
    height: 45,
};

var sideWallRight = new WorldObject();
sideWallRight.position = {
    x: 195,
    y: 160,
};
sideWallRight.img = {
    width: 40,
    height: 165,
};

var sideWallLeft = new WorldObject();
sideWallLeft.position = {
    x: 0,
    y: 160,
};
sideWallLeft.img = {
    width: 50,
    height: 165,
};

var lowerWallTransparent = new WorldObject();
lowerWallTransparent.position = {
    x: 100,
    y: 160,
};
lowerWallTransparent.img = lowerWallTransparentPic;
//lowerWallTransparent.img.width = 240;

////////////////////              ROOMS              //////////////////////
//Base class
function Room() {
    var currentImg = 0;
    this.img = fillerPic;
    this.imgNumber = 1;
    this.name = "Room";
    this.cycleDuration = 30; //Cycles could have been used to make animated backgrounds (think weird space stuff behind player), but not in this game lol
    
    this.spawnPoints = {
        center: { x: 100, y:100},
        left  : { x: 0,   y: 100 },
        right : { x: 200, y: 100 },
        up:     { x: 100, y: 0 },
        down:   { x: 100, y: 200}
    }
    //Graphics
    this.setGraphics = function (img, imgNumber, cycleDuration) {
        this.img = img;
        this.imgNumber = imgNumber; //# of images in spritesheet
        this.cycleDuration = cycleDuration;
    };
    
    this.triggerList = []; //to check triggers
    this.objectList = []; //to check collision
    this.toDraw = []; //to draw
    this.toDrawOnTop = []; //player appears behind. only supports one or the other (place things so that player is either alwasys in front of always behind)

    var roomUp = null;
    var roomDown = null;
    var roomLeft = null;
    var roomRight = null;

    this.checkCollisions = function () {
        if (this.objectList) {
            for (i = 0; i < this.objectList.length; i++) {
                if (drawColliders) {
                    player.collider.draw();
                    this.objectList[i].collider.draw();
                }
                if (player.collider.checkCollision(this.objectList[i].collider)) {
                    player.moveBack();
                    //console.log("Hit!");
                }
            }
        }
    }
    this.checkTriggers = function () {
        var closestObject;
        var toCompare = [];
        var objectsChecked = [];
        this.triggerList.forEach(function (obj) {
            if (player.collider.checkTrigger(obj.collider)) {
                toCompare.push(distance(player.position, obj.position));
                objectsChecked.push(obj);
                //console.log(toCompare);
                //obj.onTrigger();
            }
        })
        if (toCompare.length != 0) {
            closestObject = objectsChecked[toCompare.indexOf(ArraySmallest(toCompare))];
            closestObject.onTrigger();
        }
    }
    this.makeColliders = function () {
        if (!player.hasOwnProperty("collider") && player.img.width && player.img.height) {
            console.log(player.position);
            player.collider = new Collider(player.position, player.img.width / player.imgNumber, player.img.height);
            console.log(player.collider.position);
        }
        //Covers both triggers and triggers+colliders
        var toMake = this.objectList.concat(this.triggerList);
        toMake.forEach(function (obj) {
            if (!obj.hasOwnProperty("collider") && obj.img.width && obj.img.height) {
                console.log("Made collider");
                obj.collider = new Collider(obj.position, obj.img.width / obj.imgNumber, obj.img.height);
            }
        })
    }
    this.drawObjects = function () {
        this.toDraw.forEach(function (obj) {
            obj.draw();
        })
        player.draw();
        this.toDrawOnTop.forEach(function (obj) {
            obj.draw();
        })
    }
}

mainRoom = new Room();
mainRoom.name = "Main room";
mainRoom.img = mainRoomPic;
mainRoom.objectList = [marieTartine, upperWall, guideNPC1, noStyleNPC, gauntletDoor];
mainRoom.triggerList = [marieTartine, guideNPC1, noStyleNPC, gauntletDoor];
mainRoom.toDraw = [marieTartine, guideNPC1, noStyleNPC];

hallwayRoomLeft = new Room();
hallwayRoomLeft.name = "Hallway";
hallwayRoomLeft.img = hallwayPic;
hallwayRoomLeft.objectList = [upperWall, lowerWallTransparent, marine];
hallwayRoomLeft.triggerList = [marine];
hallwayRoomLeft.toDraw = [marine];
hallwayRoomLeft.toDrawOnTop = [lowerWallTransparent];

libraryRoom = new Room();
libraryRoom.name = "Library";
libraryRoom.img = libraryPic;
libraryRoom.objectList = [upperWall, lowerWallTransparent, libraryNPC, sideWallRight];
libraryRoom.triggerList = [libraryNPC];
libraryRoom.toDraw = [libraryNPC];
libraryRoom.toDrawOnTop = [lowerWallTransparent];

trainingRoom = new Room();
trainingRoom.name = "Training Room";
trainingRoom.img = trainingPic;
trainingRoom.objectList = [upperWall, lowerWallTransparent, sideWallLeft, quitterie];
trainingRoom.triggerList = [quitterie];
trainingRoom.toDraw = [quitterie];
trainingRoom.toDrawOnTop = [lowerWallTransparent];

hallwayRightRoom = new Room();
hallwayRightRoom.name = "Hallway Right";
hallwayRightRoom.img = hallwayPic;
hallwayRightRoom.objectList = [upperWall, lowerWallTransparent];
hallwayRightRoom.triggerList = [];
hallwayRightRoom.toDrawOnTop = [lowerWallTransparent];

hallwayDownRoom = new Room();
hallwayDownRoom.name = "Hallway Down";
hallwayDownRoom.img = hallwayDownPic;
hallwayDownRoom.objectList = [lowerWallTransparent, sideWallLeft];
hallwayDownRoom.triggerList = [];
hallwayDownRoom.toDrawOnTop = [lowerWallTransparent];

destroyedRoom = new Room();
destroyedRoom.name = "Destroyed Room";
destroyedRoom.img = destroyedRoomPic;
destroyedRoom.objectList = [randomBattleNPC, upperWall];
destroyedRoom.triggerList = [randomBattleNPC];
destroyedRoom.toDraw = [randomBattleNPC];
destroyedRoom.toDrawOnTop = [];

//This is so not the best way to do this but DNDC: don't know don't care!
mainRoom.leftRoom = hallwayRoomLeft;
mainRoom.rightRoom = hallwayRightRoom;
mainRoom.downRoom = hallwayDownRoom;
hallwayRoomLeft.rightRoom = mainRoom;
hallwayRoomLeft.leftRoom = trainingRoom;
trainingRoom.rightRoom = hallwayRoomLeft;
hallwayRightRoom.leftRoom = mainRoom;
hallwayRightRoom.rightRoom = destroyedRoom;
hallwayDownRoom.upRoom = mainRoom;
hallwayDownRoom.rightRoom = libraryRoom;
libraryRoom.leftRoom = hallwayDownRoom;
destroyedRoom.leftRoom = hallwayRightRoom;

overworldState.changeRoom(mainRoom);

function Collider(position,width,height) {
    this.position = position;
    this.width = width;
    this.height = height;

    var padx = 10;
    var pady = 15;

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