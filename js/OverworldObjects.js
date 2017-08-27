// Overworld objects, colliders, NPCs etc


var drawColliders = true;

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
marieTartine.position = {
    x: 30,
    y: 100,
};
marieTartine.img = marieTartinePic;
marieTartine.onTrigger = function () {
    if (holdEnter && !pokebox.isAlive && okToInteract) {
        pokebox.subject.addObserver(marieTartine.observer);
        pokebox.beginText("Here, you can see that I made a text specifically for this purpose. This was done in an onTrigger function, as such any NPC can have a custom text to say, as well as other possibilities. There is also a way for an NPC to add itself as an observer so that it can see when the message is over and call a function, like give the player a spell or start a battle (still needs minor tweaks though). For now, I'll just start a battle to demonstrate this!");
    }
}
marieTartine.observer = new Observer();
marieTartine.observer.onNotify = function (entity, event) {
    console.log("Notified Marie-Tartine");
    pokebox.subject.removeObserver(marieTartine.observer);
}
////////////////////////////////////////////////////////////////////////////////////////////////////
var gauntletDoor = new WorldObject();
gauntletDoor.name = "Gauntlet Door";
gauntletDoor.position = {
    x: 150,
    y: 100,
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
mainRoom.objectList = [marieTartine];
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