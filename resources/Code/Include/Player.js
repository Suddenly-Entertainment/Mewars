
function stackSprite(x, y, z, sprite) {
    return Crafty.e("2D, Canvas, " + sprite).attr({
        x: x,
        y: y,
        z: 10000 + z //Probably will have to adjust z
    });
}
Crafty.c("Player", { //warning - layering is done badly
    init: function() {
        this.addComponent("2D, Canvas");
    },
    updateBody: function() {
        this.bodySprite.destroy();
        this.bodySprite = stackSprite(this.x, this.y, 2, "Body|" + this.sex + "|" + this.bodyColor);
    },
    updateMane: function() {
        this.maneSprite.destroy();
        this.maneSprite = stackSprite(this.x, this.y, 6, "Mane|" + this.sex + "|" + this.mane + "|" + this.hairColor);
    },
    updateHorn: function() {
        if ('hornSprite' in this) {
            this.hornSprite.destroy();
        }
        if (this.race == 2) {
            this.hornSprite = stackSprite(this.x, this.y, 8, "Horn|" + this.sex + "|" + this.bodyColor);
        }
    },
    updateTail: function() {
        this.tailSprite.destroy();
        this.tailSprite = stackSprite(this.x, this.y, 0, "Tail|" + this.sex + "|" + this.tail + "|" + this.hairColor);
    },
    updateEyes: function() {
        this.eyeSprite.destroy();
        this.eyeSprite = stackSprite(this.x, this.y, 3, "Eyes|" + this.sex + "|" + this.eyeColor);
    },
    updateArmor: function() {
        this.armorSprite.destroy();
        this.armorSprite = stackSprite(this.x, this.y, 4, "Armor|" + this.sex + "|" + this.armor + "|" + this.armorColor);
    },
    updateHat: function() {
        this.hatSprite.destroy();
        this.hatSprite = stackSprite(this.x, this.y, 7, "Hat|" + this.sex + "|" + this.hat + "|" + this.hatColor);
    },
    updateWeapon: function() {
        this.weaponSprite.destroy();
        this.weaponSprite = stackSprite(this.x, this.y, 10, "Weapon|" + this.sex + "|" + this.weapon);
    },
    updateWings: function() {
        if ('wingsFrontSprite' in this) {
            this.wingsFrontSprite.destroy();
        }
        if ('wingsBackSprite' in this) {
            this.wingsBackSprite.destroy();
        }
        if (this.race == 1) {
            if (this.wingsExtended == 0) {
                this.wingsFrontSprite = stackSprite(this.x, this.y, 5, "WingsFront|" + this.sex + "|" + this.bodyColor + "|0");
            }
            else {
                this.wingsFrontSprite = stackSprite(this.x, this.y, 9, "WingsFront|" + this.sex + "|" + this.bodyColor + "|1");
                this.wingsBackSprite = stackSprite(this.x, this.y, 1, "WingsBack|" + this.sex + "|" + this.bodyColor);
            }
        }
    },
    getStyle: function() {
        return this.race + "|" + this.sex + "|" + this.bodyColor + "|" + this.mane + "|" + this.tail + "|" + this.hairColor + "|" + this.eyeColor + "|" + this.armor + "|" + this.armorColor + "|" + this.hat + "|" + this.hatColor + "|" + this.weapon + "|" + this.wingsExtended;
    },
    makePlayer: function(x, y, string) {
        style = string.split("|");
        this.attr({
            x: x,
            y: y,
            race: parseInt(style[0]),
            sex: parseInt(style[1]),
            bodyColor: parseInt(style[2]),
            mane: parseInt(style[3]),
            tail: parseInt(style[4]),
            hairColor: parseInt(style[5]),
            eyeColor: parseInt(style[6]),
            armor: parseInt(style[7]),
            armorColor: parseInt(style[8]),
            hat: parseInt(style[9]),
            hatColor: parseInt(style[10]),
            weapon: parseInt(style[11]),
            wingsExtended: parseInt(style[12])
        });
        this.bodySprite = stackSprite(x, y, 2, "Body|" + this.sex + "|" + this.bodyColor);
        this.maneSprite = stackSprite(x, y, 6, "Mane|" + this.sex + "|" + this.mane + "|" + this.hairColor);
        this.tailSprite = stackSprite(x, y, 0, "Tail|" + this.sex + "|" + this.tail + "|" + this.hairColor);
        this.eyeSprite = stackSprite(x, y, 3, "Eyes|" + this.sex + "|" + this.eyeColor);
        this.armorSprite = stackSprite(x, y, 4, "Armor|" + this.sex + "|" + this.armor + "|" + this.armorColor);
        this.hatSprite = stackSprite(x, y, 7, "Hat|" + this.sex + "|" + this.hat + "|" + this.hatColor);
        this.weaponSprite = stackSprite(x, y, 10, "Weapon|" + this.sex + "|" + this.weapon);
        if (this.race == 1) {
            if (this.wingsExtended == 0) {
                this.wingsFrontSprite = stackSprite(x, y, 5, "WingsFront|" + this.sex + "|" + this.bodyColor + "|0");
            }
            else {
                this.wingsFrontSprite = stackSprite(x, y, 9, "WingsFront|" + this.sex + "|" + this.bodyColor + "|1");
                this.wingsBackSprite = stackSprite(x, y, 1, "WingsBack|" + this.sex + "|" + this.bodyColor);
            }
        }
        else if (this.race == 2) {
            this.hornSprite = stackSprite(x, y, 8, "Horn|" + this.sex + "|" + this.bodyColor);
        }
        this.bind("Remove", function() {
            this.bodySprite.destroy();
            this.maneSprite.destroy();
            this.tailSprite.destroy();
            this.eyeSprite.destroy();
            this.armorSprite.destroy();
            this.hatSprite.destroy();
            this.weaponSprite.destroy();
            if ('hornSprite' in this) {
                this.hornSprite.destroy();
            }
            if ('wingsFrontSprite' in this) {
                this.wingsFrontSprite.destroy();
            }
            if ('wingsBackSprite' in this) {
                this.wingsBackSprite.destroy();
            }
        });
        return this;
    },
    switchRace: function(race) {
        this.race = race;
        this.updateWings();
        this.updateHorn();
    },
    switchSex: function(sex) {
        this.sex = sex;
        this.updateBody();
        this.updateMane();
        this.updateTail();
        this.updateEyes();
        this.updateArmor();
        this.updateHat();
        this.updateWeapon();
        this.updateWings();
        this.updateHorn();
    },
    switchBodyColor: function(bodyColor) {
        this.bodyColor = bodyColor;
        this.updateBody();
        this.updateWings();
        this.updateHorn();
    },
    switchMane: function(mane) {
        this.mane = mane;
        this.updateMane();
    },
    switchTail: function(tail) {
        this.tail = tail;
        this.updateTail();
    },
    switchHairColor: function(hairColor) {
        this.hairColor = hairColor;
        this.updateMane();
        this.updateTail();
    },
    switchEyeColor: function(eyeColor) {
        this.eyeColor = eyeColor;
        this.updateEyes();
    },
    switchArmor: function(armor) {
        this.armor = armor;
        this.updateArmor();
    },
    switchArmorColor: function(armorColor) {
        this.armorColor = armorColor;
        this.updateArmor();
    },
    switchHat: function(hat) {
        this.hat = hat;
        this.updateHat();
    },
    switchHatColor: function(hatColor) {
        this.hatColor = hatColor;
        this.updateHat();
    },
    switchWeapon: function(weapon) {
        this.weapon = weapon;
        this.updateWeapon();
    },
    switchWingsExtended: function(wingsExtended) {
        this.wingsExtended = wingsExtended;
        this.updateWings();
    }
});
Crafty.c("CanvasPlayer", { //warning - layering is done badly
    init: function() {
        this.addComponent("2D, Canvas");
    },
    drawOnCanvas: function(sprite) {
        var img = Crafty.assets[$MEW.PonyPartSprites[sprite][0]],
            cw = $MEW.PonyPartSprites[sprite][3],
            ch = $MEW.PonyPartSprites[sprite][4],
            xx = $MEW.PonyPartSprites[sprite][1] * cw,
            yy = $MEW.PonyPartSprites[sprite][2] * ch;
        this.sprite.canv.getContext("2d").drawImage(img, xx, yy, cw, ch, 0, 0, cw, ch);
    },
    buildOnCanvas: function() {
        this.sprite.canv.getContext("2d").clearRect(0, 0, 64, 64);
        this.drawOnCanvas("Tail|" + this.sex + "|" + this.tail + "|" + this.hairColor);
        if (this.race == 1 && this.wingsExtended == 1) {
            this.drawOnCanvas("WingsBack|" + this.sex + "|" + this.bodyColor);
        }
        this.drawOnCanvas("Body|" + this.sex + "|" + this.bodyColor);
        this.drawOnCanvas("Eyes|" + this.sex + "|" + this.eyeColor);
        this.drawOnCanvas("Armor|" + this.sex + "|" + this.armor + "|" + this.armorColor);
        if (this.race == 1 && this.wingsExtended == 0) {
            this.drawOnCanvas("WingsFront|" + this.sex + "|" + this.bodyColor + "|0");
        }
        this.drawOnCanvas("Mane|" + this.sex + "|" + this.mane + "|" + this.hairColor);
        this.drawOnCanvas("Hat|" + this.sex + "|" + this.hat + "|" + this.hatColor);
        if (this.race == 2) {
            this.drawOnCanvas("Horn|" + this.sex + "|" + this.bodyColor);
        }
        if (this.race == 1 && this.wingsExtended == 1) {
            this.drawOnCanvas("WingsFront|" + this.sex + "|" + this.bodyColor + "|1");
        }
        this.drawOnCanvas("Weapon|" + this.sex + "|" + this.weapon);
        this.sprite.trigger("Change");
    },
    makePlayer: function(x, y, string) {
        style = string.split("|");
        this.attr({
            x: x,
            y: y,
            race: parseInt(style[0]),
            sex: parseInt(style[1]),
            bodyColor: parseInt(style[2]),
            mane: parseInt(style[3]),
            tail: parseInt(style[4]),
            hairColor: parseInt(style[5]),
            eyeColor: parseInt(style[6]),
            armor: parseInt(style[7]),
            armorColor: parseInt(style[8]),
            hat: parseInt(style[9]),
            hatColor: parseInt(style[10]),
            weapon: parseInt(style[11]),
            wingsExtended: parseInt(style[12])
        });
        this.sprite = Crafty.e("2D, Canvas, DynamicSprite").sprite(0, 0, 64, 64, 64, 64).attr({
            x: x,
            y: y
        });
        this.buildOnCanvas();
        this.bind("Remove", function() {
            this.sprite.destroy();
        });
        return this;
    },
    switchRace: function(race) {
        this.race = race;
        this.buildOnCanvas();
    },
    switchSex: function(sex) {
        this.sex = sex;
        this.buildOnCanvas();
    },
    switchBodyColor: function(bodyColor) {
        this.bodyColor = bodyColor;
        this.buildOnCanvas();
    },
    switchMane: function(mane) {
        this.mane = mane;
        this.buildOnCanvas();
    },
    switchTail: function(tail) {
        this.tail = tail;
        this.buildOnCanvas();
    },
    switchHairColor: function(hairColor) {
        this.hairColor = hairColor;
        this.buildOnCanvas();
    },
    switchEyeColor: function(eyeColor) {
        this.eyeColor = eyeColor;
        this.buildOnCanvas();
    },
    switchArmor: function(armor) {
        this.armor = armor;
        this.buildOnCanvas();
    },
    switchArmorColor: function(armorColor) {
        this.armorColor = armorColor;
        this.buildOnCanvas();
    },
    switchHat: function(hat) {
        this.hat = hat;
        this.buildOnCanvas();
    },
    switchHatColor: function(hatColor) {
        this.hatColor = hatColor;
        this.buildOnCanvas();
    },
    switchWeapon: function(weapon) {
        this.weapon = weapon;
        this.buildOnCanvas();
    },
    switchWingsExtended: function(wingsExtended) {
        this.wingsExtended = wingsExtended;
        this.buildOnCanvas();
    },
    getStyle: function() {
        return this.race + "|" + this.sex + "|" + this.bodyColor + "|" + this.mane + "|" + this.tail + "|" + this.hairColor + "|" + this.eyeColor + "|" + this.armor + "|" + this.armorColor + "|" + this.hat + "|" + this.hatColor + "|" + this.weapon + "|" + this.wingsExtended;
    }
}); 