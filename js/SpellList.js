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
        "text": "XxX Lightning Smite Eternal XxX",
        "type": "Attack",
        "max_power": 200,
        "anim_frames": 30,
        "particles": ["iceball"]
    },
    "IceSpike": {
        "name": "Ice Spike",
        "text": "Ice Spike",
        "type": "Attack",
        "max_power": 50,
        "anim_frames": 30,
        "particles": ["iceball"]
    },
    "ToxicCloud": {
        "name": "Toxic Cloud",
        "text": "Toxic Cloud",
        "type": "Attack",
        "max_power": 30,
        "anim_frames": 30,
        "particles": ["fireball"]
    },
    "LifeDrain": {
        "name": "Life Drain",
        "text": "Life Drain",
        "type": "Attack",
        "max_power": 50,
        "anim_frames": 30,
        "particles": ["fireball"]
    },
    "Shield1": {
        "name": "Shield1",
        "text": "Protect",
        "type": "Shield",
        "max_power": 250,
        "particles": ["fireball"]
},
    "Dispell": {
        "name": "Dispell",
        "text": "Dispell",
        "type": "Special",
        "max_power": 0,
        "particles": ["dispell"]
},
    "Antagonize": {
        "name": "Antagonize",
        "text": "Silently antagonize",
        "type": "Buff",
        "max_power": 0,
        "particles": ["dispell"]
},
    "DNDC": {
        "name": "DNDC",
        "text": "DNDC: don't know don't care",
        "type": "Buff",
        "max_power": 0,
        "particles": ["dispell"]
},
    "ZaWarudo": {
        "name": "Za Warudo",
        "text": "Za Warudo",
        "type": "Utility",
        "max_power": 0,
        "anim_frames": 0,
        "particles": ["fireball"]
}
}`;

var spells = JSON.parse(spellList);

//console.log("Type: " + typeof parties.fireballParty.spritesheet);
//console.log(spells[0].name);