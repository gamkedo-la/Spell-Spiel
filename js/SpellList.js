var spellList = `{
    "Pyroblast": {
        "name": "Pyroblast",
        "text": "Pyroblast",
        "type": "Attack", "max_power": 50,
        "anim_frames": 30,
        "particles": ["fireball"]
    },
    "Lightning": {
        "name": "Lightning",
        "text": "Lightning strike of doom",
        "type": "Attack",
        "max_power": 200,
        "anim_frames": 30,
        "particles": ["iceball"]
    },
    "Blizzard": {
        "name": "Blizzard",
        "text": "Blizzard",
        "type": "Attack",
        "max_power": 50,
        "anim_frames": 30,
        "particles": ["iceball"]
    },
    "Shield1": {
        "name": "Shield1",
        "text": "Protect",
        "type": "Shield",
        "max_power": 250,
        "particles": ["fireball"]
    }
}`;

var spells = JSON.parse(spellList);

console.log("Type: " + typeof parties.fireballParty.spritesheet);
//console.log(spells[0].name);