$MEW.toggleScrolling = function(action) {
    var base = {x: 0, y: 0};

    var scroll = function(e) {
        var dx = base.x - e.clientX,
            dy = base.y - e.clientY;
            base = {x: e.clientX, y: e.clientY};
        Crafty.viewport.x -= dx;
        Crafty.viewport.y -= dy;
        $MEW.interface.moveInterface(dx, dy);
    };

    var mouseUp = function() {
        Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", scroll);
        Crafty.removeEvent(this, Crafty.stage.elem, "mouseup", mouseUp);
    };

    var mouseDown = function(e) {
        if(e.button > 1) return;
        if(e.offsetY > 500) return;
        base = {x: e.clientX, y: e.clientY};

        Crafty.addEvent(this, Crafty.stage.elem, "mousemove", scroll);
        Crafty.addEvent(this, Crafty.stage.elem, "mouseup", mouseUp);
    };

    if (action == 1) {
        Crafty.addEvent(this, Crafty.stage.elem, "mousedown", mouseDown);
    } else {
        Crafty.removeEvent(this, Crafty.stage.elem, "mousedown", mouseDown);
    }
};
    
function getData(player) {
    var data={};
    if ('maneOld' in player) {
        data.maneOld = player.maneOld;
    }
    if ('tailOld' in player) {
        data.tailOld = player.tailOld;
    }
    if ('armorColorOld' in player) {
        data.armorColorOld = player.armorColorOld;
    }
    if ('hatColorOld' in player) {
        data.hatColorOld = player.hatColorOld;
    }
    return data;
}

function restoreData(player, data) {
    if ('maneOld' in data) {
        player.maneOld = data.maneOld;
    }
    if ('tailOld' in data) {
        player.tailOld = data.tailOld;
    }
    if ('armorColorOld' in data) {
        player.armorColorOld = data.armorColorOld;
    }
    if ('hatColorOld' in data) {
        player.hatColorOld = data.hatColorOld;
    }
}

function switchCompositing() {
    if($MEW.compositing == 0) {
        $MEW.compositing = 1;
        $MEW.interface.buttonTexts[4].text("Switch to Standard Compositing");
        $MEW.interface.buttons[4].color("#000000");
        $MEW.interface.texts[0].text("Canvas Compositing");

        if ($MEW.interface.scene == 1) {
            $MEW.player.destroy();
            var data = getData($MEW.player);
            $MEW.player = Crafty.e("CanvasPlayer").makePlayer(200, 200, $MEW.player.getStyle());
            restoreData($MEW.player, data);
        } else if ($MEW.interface.scene == 2) {
            for (i = 0; i < 15 ; ++i) {
                for (j = 0; j < 20; ++j) {
                    var index = i * 20 + j;
                    $MEW.players[index].destroy();
                    $MEW.players[index] = Crafty.e("CanvasPlayer").makePlayer(i * 64, j * 64, $MEW.players[index].getStyle());
                }
            }
        }
    } else {
        $MEW.compositing = 0;
        $MEW.interface.buttonTexts[4].text("Switch to Canvas Compositing");
        $MEW.interface.buttons[4].color("#000000");
        $MEW.interface.texts[0].text("Standard Compositing");

        if ($MEW.interface.scene == 1) {
            $MEW.player.destroy();
            var data = getData($MEW.player);
            $MEW.player = Crafty.e("Player").makePlayer(200, 200, $MEW.player.getStyle());
            restoreData($MEW.player, data);
        } else if ($MEW.interface.scene == 2) {
            for (i = 0; i < 15 ; ++i) {
                for (j = 0; j < 20; ++j) {
                    var index = i * 20 + j;
                    $MEW.players[index].destroy();
                    $MEW.players[index] = Crafty.e("Player").makePlayer(i * 64, j * 64, $MEW.players[index].getStyle());
                }
            }
        }
    }
}

function nextRace() {
    if($MEW.player.race == 1) {
        if($MEW.player.wingsExtended == 0) {
            $MEW.player.switchWingsExtended(1);
            return;
        } else {
            $MEW.player.wingsExtended = 0;
        }
    }

    $MEW.player.switchRace(($MEW.player.race + 1) % 3);
}

function nextSex() {
    $MEW.player.switchSex(($MEW.player.sex + 1) % 2);
}

function nextBodyColor() {
    $MEW.player.switchBodyColor(($MEW.player.bodyColor + 1) % 50);
}

function nextMane() {
    if ($MEW.player.hairColor < 11) return;
    $MEW.player.switchMane(($MEW.player.mane + 1) % 28);
}

function nextTail() {
    if ($MEW.player.hairColor < 11) return;
    $MEW.player.switchTail(($MEW.player.tail + 1) % 26);
}

function nextHairColor() {
    if ($MEW.player.hairColor == 33) {
        $MEW.player.maneOld = $MEW.player.mane;
        $MEW.player.tailOld = $MEW.player.tail;
        $MEW.player.mane = 0;
        $MEW.player.tail = 0;
        $MEW.player.switchHairColor(0);

        $MEW.interface.ponymakerInterface.buttons[4].color("#777777");
        $MEW.interface.ponymakerInterface.buttonTexts[4].textColor("#777777");
        $MEW.interface.ponymakerInterface.buttons[5].color("#777777");
        $MEW.interface.ponymakerInterface.buttonTexts[5].textColor("#777777");
        $MEW.interface.ponymakerInterface.buttons[6].color("#777777");
        $MEW.interface.ponymakerInterface.buttonTexts[6].textColor("#777777");
        $MEW.interface.ponymakerInterface.buttons[7].color("#777777");
        $MEW.interface.ponymakerInterface.buttonTexts[7].textColor("#777777");
    } else if ($MEW.player.hairColor == 10) {
        $MEW.player.mane = $MEW.player.maneOld;
        $MEW.player.tail = $MEW.player.tailOld;
        $MEW.player.switchHairColor(11);

        $MEW.interface.ponymakerInterface.buttons[4].color("#000000");
        $MEW.interface.ponymakerInterface.buttonTexts[4].textColor("#FFFFFF");
        $MEW.interface.ponymakerInterface.buttons[5].color("#000000");
        $MEW.interface.ponymakerInterface.buttonTexts[5].textColor("#FFFFFF");
        $MEW.interface.ponymakerInterface.buttons[6].color("#000000");
        $MEW.interface.ponymakerInterface.buttonTexts[6].textColor("#FFFFFF");
        $MEW.interface.ponymakerInterface.buttons[7].color("#000000");
        $MEW.interface.ponymakerInterface.buttonTexts[7].textColor("#FFFFFF");
    } else {
        $MEW.player.switchHairColor($MEW.player.hairColor + 1);
    }
}

function nextEyeColor() {
    $MEW.player.switchEyeColor(($MEW.player.eyeColor + 1) % 40);
}

function nextArmor() {
    if($MEW.player.armor == 31) {
        $MEW.player.armorColorOld = $MEW.player.armorColor;
        $MEW.player.armorColor = 0;
        $MEW.player.switchArmor(0);

        $MEW.interface.ponymakerInterface.buttons[14].color("#777777");
        $MEW.interface.ponymakerInterface.buttonTexts[14].textColor("#777777");
        $MEW.interface.ponymakerInterface.buttons[15].color("#777777");
        $MEW.interface.ponymakerInterface.buttonTexts[15].textColor("#777777");
    } else if ($MEW.player.armor == 0) {
        $MEW.player.armorColor = $MEW.player.armorColorOld;
        $MEW.player.switchArmor(1);

        $MEW.interface.ponymakerInterface.buttons[14].color("#000000");
        $MEW.interface.ponymakerInterface.buttonTexts[14].textColor("#FFFFFF");
        $MEW.interface.ponymakerInterface.buttons[15].color("#000000");
        $MEW.interface.ponymakerInterface.buttonTexts[15].textColor("#FFFFFF");
    } else {
        $MEW.player.switchArmor($MEW.player.armor + 1);
    }
}

function nextArmorColor() {
    if ($MEW.player.armor == 0) return;
    $MEW.player.switchArmorColor(($MEW.player.armorColor + 1) % 4);
}

function nextHat() {
    if($MEW.player.hat == 31) {
        $MEW.player.hatColorOld = $MEW.player.hatColor;
        $MEW.player.hatColor = 0;
        $MEW.player.switchHat(0);

        $MEW.interface.ponymakerInterface.buttons[18].color("#777777");
        $MEW.interface.ponymakerInterface.buttonTexts[18].textColor("#777777");
        $MEW.interface.ponymakerInterface.buttons[19].color("#777777");
        $MEW.interface.ponymakerInterface.buttonTexts[19].textColor("#777777");
    } else if ($MEW.player.hat == 0) {
        $MEW.player.hatColor = $MEW.player.hatColorOld;
        $MEW.player.switchHat(1);

        $MEW.interface.ponymakerInterface.buttons[18].color("#000000");
        $MEW.interface.ponymakerInterface.buttonTexts[18].textColor("#FFFFFF");

        $MEW.interface.ponymakerInterface.buttons[19].color("#000000");
        $MEW.interface.ponymakerInterface.buttonTexts[19].textColor("#FFFFFF");
    } else {
        $MEW.player.switchHat($MEW.player.hat + 1);
    }
}

function nextHatColor() {
    if ($MEW.player.hat == 0) return;
    $MEW.player.switchHatColor(($MEW.player.hatColor + 1) % 4);
}

function nextWeapon() {
    $MEW.player.switchWeapon(($MEW.player.weapon + 1) % 17);
}

function prevBodyColor() {
    $MEW.player.switchBodyColor(($MEW.player.bodyColor + 49) % 50);
}

function prevMane() {
    if ($MEW.player.hairColor < 11) return;
    $MEW.player.switchMane(($MEW.player.mane + 27) % 28);
}

function prevTail() {
    if ($MEW.player.hairColor < 11) return;
    $MEW.player.switchTail(($MEW.player.tail + 25) % 26);
}

function prevHairColor() {
    if ($MEW.player.hairColor == 11) {
        $MEW.player.maneOld = $MEW.player.mane;
        $MEW.player.tailOld = $MEW.player.tail;
        $MEW.player.mane = 0;
        $MEW.player.tail = 0;
        $MEW.player.switchHairColor(10);

        $MEW.interface.ponymakerInterface.buttons[4].color("#777777");
        $MEW.interface.ponymakerInterface.buttonTexts[4].textColor("#777777");
        $MEW.interface.ponymakerInterface.buttons[5].color("#777777");
        $MEW.interface.ponymakerInterface.buttonTexts[5].textColor("#777777");
        $MEW.interface.ponymakerInterface.buttons[6].color("#777777");
        $MEW.interface.ponymakerInterface.buttonTexts[6].textColor("#777777");
        $MEW.interface.ponymakerInterface.buttons[7].color("#777777");
        $MEW.interface.ponymakerInterface.buttonTexts[7].textColor("#777777");
    } else if ($MEW.player.hairColor == 0) {
        $MEW.player.mane = $MEW.player.maneOld;
        $MEW.player.tail = $MEW.player.tailOld;

        $MEW.interface.ponymakerInterface.buttons[4].color("#000000");
        $MEW.interface.ponymakerInterface.buttonTexts[4].textColor("#FFFFFF");
        $MEW.interface.ponymakerInterface.buttons[5].color("#000000");
        $MEW.interface.ponymakerInterface.buttonTexts[5].textColor("#FFFFFF");
        $MEW.interface.ponymakerInterface.buttons[6].color("#000000");
        $MEW.interface.ponymakerInterface.buttonTexts[6].textColor("#FFFFFF");
        $MEW.interface.ponymakerInterface.buttons[7].color("#000000");
        $MEW.interface.ponymakerInterface.buttonTexts[7].textColor("#FFFFFF");
        $MEW.player.switchHairColor(33);
    } else {
        $MEW.player.switchHairColor($MEW.player.hairColor - 1);
    }
}

function prevEyeColor() {
    $MEW.player.switchEyeColor(($MEW.player.eyeColor + 39) % 40);
}

function prevArmor() {
    if($MEW.player.armor == 1) {
        $MEW.player.armorColorOld = $MEW.player.armorColor;
        $MEW.player.armorColor = 0;
        $MEW.player.switchArmor(0);

        $MEW.interface.ponymakerInterface.buttons[14].color("#777777");
        $MEW.interface.ponymakerInterface.buttonTexts[14].textColor("#777777");
        $MEW.interface.ponymakerInterface.buttons[15].color("#777777");
        $MEW.interface.ponymakerInterface.buttonTexts[15].textColor("#777777");
    } else if ($MEW.player.armor == 0) {
        $MEW.player.armorColor = $MEW.player.armorColorOld;
        $MEW.player.switchArmor(31);

        $MEW.interface.ponymakerInterface.buttons[14].color("#000000");
        $MEW.interface.ponymakerInterface.buttonTexts[14].textColor("#FFFFFF");
        $MEW.interface.ponymakerInterface.buttons[15].color("#000000");
        $MEW.interface.ponymakerInterface.buttonTexts[15].textColor("#FFFFFF");
    } else {
        $MEW.player.switchArmor($MEW.player.armor - 1);
    }
}

function prevArmorColor() {
    if ($MEW.player.armor == 0) return;
    $MEW.player.switchArmorColor(($MEW.player.armorColor + 3) % 4);
}

function prevHat() {
    if($MEW.player.hat == 1) {
        $MEW.player.hatColorOld = $MEW.player.hatColor;
        $MEW.player.hatColor = 0;
        $MEW.player.switchHat(0);

        $MEW.interface.ponymakerInterface.buttons[18].color("#777777");
        $MEW.interface.ponymakerInterface.buttonTexts[18].textColor("#777777");
        $MEW.interface.ponymakerInterface.buttons[19].color("#777777");
        $MEW.interface.ponymakerInterface.buttonTexts[19].textColor("#777777");
    } else if ($MEW.player.hat == 0) {
        $MEW.player.hatColor = $MEW.player.hatColorOld;
        $MEW.player.switchHat(31);

        $MEW.interface.ponymakerInterface.buttons[18].color("#000000");
        $MEW.interface.ponymakerInterface.buttonTexts[18].textColor("#FFFFFF");
        $MEW.interface.ponymakerInterface.buttons[19].color("#000000");
        $MEW.interface.ponymakerInterface.buttonTexts[19].textColor("#FFFFFF");
    } else {
        $MEW.player.switchHat($MEW.player.hat - 1);
    }
}

function prevHatColor() {
    if ($MEW.player.hat == 0) return;
    $MEW.player.switchHatColor(($MEW.player.hatColor + 3) % 4);
}

function prevWeapon() {
    $MEW.player.switchWeapon(($MEW.player.weapon + 16) % 17);
}

Crafty.c("InterfaceCommonTemporary", {
    init : function() {
        this.buttonCount = 0;
        this.buttons = [];
        this.buttonTexts = [];
        this.textCount = 0;
        this.texts = [];
    },

    moveInterface : function(x, y) {
        this.x += x;
        this.y += y;

        for (i = 0; i < this.buttonCount; ++i) {
            this.buttons[i].x += x;
            this.buttons[i].y += y;

            this.buttonTexts[i].x += x;
            this.buttonTexts[i].y += y;
        }

        for (i = 0; i < this.textCount; ++i) {
            this.texts[i].x += x;
            this.texts[i].y += y;
        }
    },

    addText : function(x, y, w, h, caption) {
        this.texts[this.textCount] = Crafty.e("2D, Canvas, Text").attr({
            x : this.x + x,
            y : this.y + y - 5,
            w : w,
            h : h,
            z : this.z + 2
        });
        this.texts[this.textCount].text(caption);
        this.texts[this.textCount].textColor("#000000");

        ++this.textCount;
    },

    addButton : function(x, y, w, h, caption, method) {
        this.buttons[this.buttonCount] = Crafty.e("2D, Canvas, Color, Mouse").attr({
            x : this.x + x,
            y : this.y + y,
            w : w,
            h : h,
            z : this.z + 1
        });
        this.buttons[this.buttonCount].color("#000000");
        this.buttons[this.buttonCount].bind("Click", method);

        this.buttonTexts[this.buttonCount] = Crafty.e("2D, Canvas, Text").attr({
            x : this.x + x + 12,
            y : this.y + y - 10,
            w : w,
            h : Math.floor(h / 2) + 15,
            z : this.z + 2
        });
        this.buttonTexts[this.buttonCount].text(caption);
        this.buttonTexts[this.buttonCount].textColor("#FFFFFF");

        ++this.buttonCount;
    }
});

Crafty.c("PonymakerInterface", {
    init : function() {
        this.addComponent("2D, Canvas");
        this.addComponent("Color, InterfaceCommonTemporary");
    },

    makeInterface : function(x, y) {
        this.attr({
            x : x,
            y : y,
            z : 50000,
            w : 1000,
            h : 1000
        });
        this.color("#FFFFFF");

        this.addText(13, 0, 50, 25, "Race:");
        this.addButton(93, 0, 95, 30, "Change", function(){nextRace();});

        this.addText(13, 40, 50, 25, "Sex:");
        this.addButton(93, 40, 95, 30, "Change", function(){nextSex();});

        this.addText(13, 80, 50, 25, "Body Color:");
        this.addButton(93, 80, 45, 30, "Prev", function(){prevBodyColor();});
        this.addButton(143, 80, 45, 30, "Next", function(){nextBodyColor();});

        this.addText(13, 120, 50, 25, "Mane:");
        this.addButton(93, 120, 45, 30, "Prev", function(){prevMane();});
        this.addButton(143, 120, 45, 30, "Next", function(){nextMane();});

        this.addText(13, 160, 50, 25, "Tail:");
        this.addButton(93, 160, 45, 30, "Prev", function(){prevTail();});
        this.addButton(143, 160, 45, 30, "Next", function(){nextTail();});

        this.addText(13, 200, 50, 25, "Hair Color:");
        this.addButton(93, 200, 45, 30, "Prev", function(){prevHairColor();});
        this.addButton(143, 200, 45, 30, "Next", function(){nextHairColor();});

        this.addText(13, 240, 50, 25, "Eye Color:");
        this.addButton(93, 240, 45, 30, "Prev", function(){prevEyeColor();});
        this.addButton(143, 240, 45, 30, "Next", function(){nextEyeColor();});

        this.addText(13, 280, 50, 25, "Armor:");
        this.addButton(93, 280, 45, 30, "Prev", function(){prevArmor();});
        this.addButton(143, 280, 45, 30, "Next", function(){nextArmor();});

        this.addText(13, 320, 50, 25, "Armor Color:");
        this.addButton(93, 320, 45, 30, "Prev", function(){prevArmorColor();});
        this.addButton(143, 320, 45, 30, "Next", function(){nextArmorColor();});
        this.buttons[14].color("#777777");
        this.buttonTexts[14].textColor("#777777");
        this.buttons[15].color("#777777");
        this.buttonTexts[15].textColor("#777777");

        this.addText(13, 360, 50, 25, "Hat:");
        this.addButton(93, 360, 45, 30, "Prev", function(){prevHat();});
        this.addButton(143, 360, 45, 30, "Next", function(){nextHat();});

        this.addText(13, 400, 50, 25, "Hat Color:");
        this.addButton(93, 400, 45, 30, "Prev", function(){prevHatColor();});
        this.addButton(143, 400, 45, 30, "Next", function(){nextHatColor();});
        this.buttons[18].color("#777777");
        this.buttonTexts[18].textColor("#777777");
        this.buttons[19].color("#777777");
        this.buttonTexts[19].textColor("#777777");

        this.addText(13, 440, 50, 25, "Weapon:");
        this.addButton(93, 440, 45, 30, "Prev", function(){prevWeapon();});
        this.addButton(143, 440, 45, 30, "Next", function(){nextWeapon();});

        return this;
    }
});

Crafty.c("ChatEmbed", {
	init: function(chat_id, x, y) {
	$MEW.Chat.id = chat_id;
	$MEW.Chat.lastid = 0;
	$MEW.Chat.melemid = null;
	
	var chat_html = ''
    + '<form id="submitForm" style="float:left;width:100%;" onsubmit="return $MEW.Chat.send(this)">'
    +    '<input id="chatText" style="float:left;width:90%;" name="chatText" maxlength="255" />'
    +    '<input type="submit" name="sendButton" value="Send" onClick=""/>'
    + '</form>'
;
    
    var chatMessages = Crafty.e("HTML, Delay")
        .attr({x:-100, y:246, w:600, h:120}) //hard coded x/y values for sceneChess
        .css({
            'overflow': 'scroll',
            'align': 'left',
            'font-family': '"Times New Roman",Georgia,Serif',
            'font-size': '12px',
            'text-align': 'left',
        });
        
    $MEW.Chat.melemid = chatMessages.getDomId();
    
    var chatBar = Crafty.e("HTML")
        .attr({x:-100, y:366, w:600, h:34}) //hard coded x/y values for sceneChess
        .replace(chat_html)
        .css({
            'clear': 'both',
            'align': 'left',
            'float': 'left',
        });
    var refreshChat = function () {
        $MEW.Chat.get();
        chatMessages.delay(refreshChat, 2000)
    };;
    $MEW.Chat.get();
    chatMessages.delay(refreshChat, 2000);
    $MEW.toggleScrolling(0);
	}

});

Crafty.c("Lobby", {
    init: function() {
        var name_html = ''
        + '<form id="submitForm" style="float:left;width:100%;" onsubmit="return $MEW.Lobby.send(this)">'
        +    '<input id="nameInput" style="float:left;width:90%;" name="nameInput" maxlength="255" />'
        +    '<input type="submit" name="sendButton" value="Send" onClick=""/>'
        + '</form>'
    
        var lobbies = Crafty.e("HTML", "Delay", "Mouse")
            .attr({x : 100, y:200, w:600, h:400})
        
        Crafty.e("HTML")
            .attr({x:100, y:200, w:200, h:34})
            .replace(name_html)
            .css({
                'clear': 'both',
                'align': 'left',
                'float': 'left',
            });
    }

});

Crafty.c("Interface", {
    init : function() {
        this.addComponent("2D, Canvas");
        this.addComponent("Color, InterfaceCommonTemporary"); //just for dummy fill with one color
    },
	
    makeInterface : function(x, y, scene, w, h) {
        
		this.attr({
            x : x,
            y : y,
            z : 100000,
            w : (w)?w:1000,
            h : (h)?h:1000,
            scene : scene
        });
        this.color("#FFFFFF");

        if (scene == 0) { //world map
            this.addButton(300, 50, 200, 50, "Switch to Ponymaker Test", function(){Crafty.scene("PonymakerTest");});

            this.addButton(550, 50, 200, 50, "Switch to Performance Test", function(){Crafty.scene("PerformanceTest");});
            
            this.addButton(550, -20, 150, 50, "Switch to Chat Test", function(){Crafty.scene("Chat");});
			
			this.addButton(550, -90, 150, 50, "Switch to Chess Test", function(){Crafty.scene("Chess");});
						
            this.addButton(25, 50, 250, 50, ($MEW.compositing == 0 ? "Switch to Canvas Compositing" : "Switch to Standard Compositing"), function(){switchCompositing();});

            this.addText(13, -20, 200, 50, ($MEW.compositing == 0 ? "Standard Compositing" : "Canvas Compositing"));

            this.addText(400, -20, 200, 50, "World Map Test");
        } else if (scene == 1) {//ponymaker test
            this.ponymakerInterface = Crafty.e("PonymakerInterface").makeInterface(this.x + 600, this.y - 500);

            this.addButton(300, 50, 200, 50, "Switch to World Map Test", function(){Crafty.scene("Map");});

            this.addButton(550, 50, 200, 50, "Switch to Performance Test", function(){Crafty.scene("PerformanceTest");});

            this.addButton(550, -20, 150, 50, "Switch to Chat Test", function(){Crafty.scene("Chat");});
            
            this.addButton(25, 50, 250, 50, ($MEW.compositing == 0 ? "Switch to Canvas Compositing" : "Switch to Standard Compositing"), function(){switchCompositing();});

            this.addText(13, -20, 200, 50, ($MEW.compositing == 0 ? "Standard Compositing" : "Canvas Compositing"));

            this.addText(400, -20, 200, 50, "Ponymaker Test");
        } else if (scene == 2){//performance test
            this.addButton(300, 50, 200, 50, "Switch to World Map Test", function(){Crafty.scene("Map");});

            this.addButton(550, 50, 200, 50, "Switch to Ponymaker Test", function(){Crafty.scene("PonymakerTest");});

            this.addButton(550, -20, 150, 50, "Switch to Chat Test", function(){Crafty.scene("Chat");});
            
            this.addButton(25, 50, 250, 50, ($MEW.compositing == 0 ? "Switch to Canvas Compositing" : "Switch to Standard Compositing"), function(){switchCompositing();});

            this.addText(13, -20, 200, 50, ($MEW.compositing == 0 ? "Standard Compositing" : "Canvas Compositing"));

            this.addText(400, -20, 200, 50, "Performance Test");
        }else if (scene == 3){// Chess game
			this.chessInterface = Crafty.e("ChatEmbed").init(2, 400, 400);
			
            this.addButton(0, -100, 180, 50, "Switch to World Map Test", function(){Crafty.scene("Map");});
			
			this.addText(-200, 180, 200, 50, "Chess Game");
		}else if (scene == 4){ //lobby
            this.lobbyInterface.lobby = Crafty.e("Lobby").init();
            
            this.lobbyInterface.chess = Crafty.e("ChatEmbed").init(4, 200, 200);
            
            //this.addButton(-300, -600, 180, 50, "Switch to World Map", function(){Crafty.scene("Map");});
            
            this.addText(200, -600, 200, 50, "Main Lobby");
    	}

        return this;
    }
});
