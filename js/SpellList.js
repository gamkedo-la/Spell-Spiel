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
    "Shield1": {
        "name": "Shield1",
        "text": "Protect",
        "type": "Shield",
        "max_power": 250,
        "particles": ["fireball"]
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

console.log("Type: " + typeof parties.fireballParty.spritesheet);
//console.log(spells[0].name);