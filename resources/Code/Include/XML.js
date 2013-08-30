/*global $MEW, Crafty, sprintf, _, $*/
function Clone() { }
function clone(obj) {
    Clone.prototype = obj;
    return new Clone();
}

/******************************************************************
 * Interface Parsing
 ******************************************************************/
 
 var DEPTH = 0; //This is to stop infinite loops, or too much recursian

var $XMLInterfaceAttrParsers = {
    component: function (self, ent, attr, base){ //This is for the component attributes, might look something like this component="2D, DOM, HTML"
        ent.requires(attr.nodeValue);
    },
    name: function (self, ent, attr, base) { //The name of the node
        ent.setName(attr.nodeValue);
        self.name = attr.nodeValue;
    },
    x: function (self, ent, attr, base) { //It's x position on the screen
        var val = attr.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        ent.x = val + base.basex || base.basex;
    },
    y: function (self, ent, attr, base) { //IT's y position on the screen
        var val = attr.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        ent.y = val + base.basey|| base.basey;
    },
    z: function (self, ent, attr, base) { //At what depth this is at.
        var val = attr.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val); 
        }
        ent.z = val + base.basez || base.basez;
    }
};

var $XMLInterfaceNodeParsers = {

};

var IGNORE_NODETYPES = [3, 7, 8]

var $XMLInterfaceNodeDelayParsers = {
    e: function (self, ent, entities, node, base){
        var pnode = new XMLInterfaceNode(node)
        pnode.parseNode(base.basex, base.basey, base.basez, base.width, base.height, self.interface)
        var entity = new XMLEntityNode(node);
        entity.passAttrs(pnode.ent);
        entities.push(pnode.ent);
    },
    sizer: function (self, ent, entities, node, base) {
        var pnode = new XMLInterfaceNode(node)
        pnode.parseNode(base.basex, base.basey, base.basez, base.width, base.height, self.interface)
        var sizer = new XMLSizerNode(node);
        pnode.ent.requires("Sizer");
        sizer.passAttrs(pnode.ent);
        pnode.ent.Sizer(pnode.entities);
        entities.push(pnode.ent);
    },
    init: function (self, ent, entities, node, base) {
        //if it's CDATA we need to treat it differently
        if (node.childNodes[0].nodeType == 4) {
            ent[node.childNodes[0].data]();
        } else {
            ent[node.childNodes[0].nodeValue]();
        }
    },
    attr: function (self, ent, entities, node, base) {
        _(node.childNodes).each( function( attr, index, attributes) {
            // skip if we want to ignore this node type
            if (IGNORE_NODETYPES.inArray(attr.nodeType)) return

            var val = attr.childNodes[0].nodeValue;
            if(!isNaN(val)) {
                val = parseFloat(val);
            }
            ent.attr(attr.nodeName.toLowerCase(), val);
        });
    },
    craftyhtml: function (self, ent, entities, node, base) {
        //if it's CDATA we need to treat it differently
        if (node.childNodes[0].nodeType == 4) {
            ent.replace(node.childNodes[0].data);
        } else {
            ent.replace(node.childNodes[0].nodeValue);
        }
    },
    css: function (self, ent, entities, node, base) {
        //if it's CDATA we need to treat it differently
        if (node.childNodes[0].nodeType == 4) {
            ent.css(JSON.parse(node.childNodes[0].data));
        } else {
            ent.css(JSON.parse(node.childNodes[0].nodeValue));
        }
    },
    craftytext: function (self, ent, entities, node, base) {
        _(node.childNodes).each( function( cnode, index, nodes) {
            switch(cnode.nodeName.toLowerCase()){
                
                case 'value':
                    var text = cnode.childNodes[0].nodeValue;
                    ent.text(text);
                break;

                case 'textcolor':
                    var color;
                    //If its CDATA we need to treat it differently
                    if (cnode.childNodes[0].nodeType == 4) {
                        color = JSON.parse(cnode.childNodes[0].data);
                    }else{
                        color = JSON.parse(cnode.childNodes[0].nodeValue);
                    }
                    ent.textColor(color["color"], color["opacity"]);
                break;

                case 'textfont':
                    var font;
                    //If its CDATA we need to treat it differently
                    if (node.childNodes[0].nodeType == 4) {
                        font = JSON.parse(cnode.childNodes[0].data);
                    }else{
                        font = JSON.parse(cnode.childNodes[0].nodeValue);
                    }
                    ent.textFont(font);
                break;

                default:
                    console.log(cnode.nodeName.toLowerCase() + " is not implemented, so we are doing nothing with it.");
                break;
            }

        });
    },
    craftycolor: function(self, ent, entities, node, base){

        var val;
        //If its CDATA we need to treat it differently
        if (node.childNodes[0].nodeType == 4) {
            val = node.childNodes[0].data;
        }else{
            val = node.childNodes[0].nodeValue;
        }
        console.log(val);
        ent.color(val);

    },
    craftybind: function(self, ent, entities, node, base){
        var eventName;
        var cb;
        _(node.childNodes).each( function( cnode, index, nodes) {
            var nodeName = cnode.nodeName.toLowerCase();
            if(nodeName == "eventname"){
                eventName = cnode.childNodes[0].nodeValue;
            }else if(nodeName == "callback"){
                if (cnode.childNodes[0].nodeType == 4) {
                    cb = ent[cnode.childNodes[0].data];
                } else {
                    cb = ent[cnode.childNodes[0].nodeValue];
                }
            }
        });

        ent.bind(eventName, cb);
    }
};

Crafty.c("Sizer", {
    init: function () {
        var self = this;
        self.requires("2D");
        self.attr({
            type: 'verticle',
            ptop: 0,
            pbottom: 0,
            pleft: 0,
            pright: 0,
            align: 'left',
            expand: true,
            rows: 1,
            cols: 1,
            vgap: 0,
            hgap: 0
        });
    },
    Sizer: function(nodes) {
        var self = this;
        self.nodes = nodes;
        self.bind("Change", function(e) {
            if (e) {
                var w = e.w || self.w,
                    h = e.h || self.h;
                self.layout(self.x, self.y, w, h);
            }
        });
        return this;
    },
    layout: function (basex, basey, width, height) {
        var self = this;
        var x              = 0,
            y              = 0,
            maxwidth       = 0,
            minwidth       = 0,
            maxheight      = 0,
            minheight      = 0,
            widthportion   = 0,
            widthportions  = 0,
            heightportion  = 0,
            heightportions = 0,
            lessminwidth   = 0,
            lessminHeight  = 0,
            minweight      = 0;
            
        if (self.type === 'verticle') {
            // get the height avalible for expantion and section it
            _(self.nodes).each( function( node, index, nodes ) {
                heightportions += node.portion;
                minheight      += (node.minheight || 0);
                minheight      += node.ptop + node.pbottom;
            });
            lessminHeight = height - minheight;
            if (lessminHeight > 0) {
                heightportion = Math.round(lessminHeight / heightportions);
            }
            // distribute the available height
            _(self.nodes).each( function( entity, index, entities ) {
                var subheight = heightportion * entity.portion + entity.minheight,
                    subwidth  = width - entity.pleft - entity.pright;
                if (subwidth < entity.minwidth) subwidth = entity.minwidth;
                y += entity.ptop;
                console.log({x: basex + x, y: basey + entity.ptop, w: subwidth, h: subheight})
                entity.attr({x: basex + entity.pleft, y: basey + y, w: subwidth, h: subheight});
                y += subheight + entity.pbottom;
            });

        } else if (self.type === 'horizontal') {
            // get the width avalible for expantion and section it
            _(self.nodes).each( function( node, index, nodes ) {
                widthportions += node.portion;
                minweight     += (node.minwidth || 0);
                minweight     += node.pleft + node.pright;
            });
            lessminwidth = width - minwidth;
            if (lessminwidth > 0) {
                widthportion = Math.round(lessminwidth / widthportions);
            }
            // distribute the available width
            _(self.nodes).each( function( entity, index, entities ) {
                var subheight = height - entity.ptop - entity.pbottom,
                    subwidth  = widthportion * entity.portion + entity.minwidth;
                if (subheight < entity.minheight) subheight = entity.minheight;
                x += entity.pleft;
                console.log({x: basex + x, y: basey + entity.ptop, w: subwidth, h: subheight})
                entity.attr({x: basex + x, y: basey + entity.ptop, w: subwidth, h: subheight});
                x += subwidth + entity.pright;
            });

        } else if (self.type === 'grid') {
            // divide the available width by the num of cols
            maxwidth = Math.round(width / self.cols);
            //TODO: finish grid layout
        }
    }
});


function XMLSizerNode (xml) {
    var self = this
    self.name    = '';
    self.type    = 'verticle';
    self.x       = 0;
    self.y       = 0;
    self.z       = 0;
    self.portion = 0;
    self.width   = 0;
    self.height  = 0;
    self.xml     = xml;
    self.ptop    = 0;
    self.pbottom = 0;
    self.pleft   = 0;
    self.pright  = 0;
    self.align   = 'left';
    self.expand  = true;
    self.rows    = 1;
    self.cols    = 1;
    self.vgap    = 0;
    self.hgap    = 0;
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        self[atter.nodeName.toLowerCase()] = val;
    });
    self.passAttrs = function (ent) {
        var self = this
        ent.attr({
            name: self.name,
            type: self.type,
            x: self.x,
            y: self.y,
            z: self.z,
            portion: self.portion,
            width: self.width,
            height: self.height,
            xml: self.xml,
            ptop: self.ptop,
            pbottom: self.pbottom,
            pleft: self.pleft,
            pright: self.pright,
            align: self.align,
            expand: self.expand,
            rows: self.rows,
            cols: self.cols,
            vgap: self.vgap,
            hgap: self.hgap
        });
    };
}

function XMLEntityNode (xml) {
    this.name      = '';
    this.component = '';
    this.minwidth  = 0;
    this.minheight = 0;
    this.x         = 0;
    this.y         = 0;
    this.z         = 0;
    this.portion   = 0;
    this.width     = 0;
    this.height    = 0;
    this.xml       = xml;
    this.ptop      = 0;
    this.pbottom   = 0;
    this.pleft     = 0;
    this.pright    = 0;
    this.align     = '';
    this.expand    = true;
    var that = this;
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        that[atter.nodeName.toLowerCase()] = val;
    });
    this.passAttrs = function (ent) {

        var self = this
        ent.attr({
            name: self.name,
            component: self.component,
            minwidth: self.minwidth,
            minheight: self.minheight,
            x: self.x,
            y: self.y,
            z: self.z,
            portion: self.portion,
            width: self.width,
            height: self.height,
            xml: self.xml,
            ptop: self.ptop,
            pbottom: self.pbottom,
            pleft: self.pleft,
            pright: self.pright,
            align: self.align,
            expand: self.expand
        });
        ent.requires(self.component)
    };
}

function XMLInterfaceNode (xml) {
    this.entities    = [];
    this.delayNodes = [];
    this.children    = xml.childNodes;
    this.attributes  = xml.attributes;
    this.ent         = Crafty.e("2D");
    this.xml         = xml;
    this.interface = null;   


    this.parseNode = function (basex, basey, basez, width, height, interface) {
        var self = this
        DEPTH++

        self.interface = interface

        // get child nodes and figure out how to parse them
        var base = {basex: basex, basey: basey, basez: basez, width: width, height: height}

        _(self.children).each( function( node, index, children ) {
            if ($XMLInterfaceNodeParsers.hasOwnProperty(node.nodeName.toLowerCase())) {
                $XMLInterfaceNodeParsers[node.nodeName.toLowerCase()](self, self.ent, self.entities, node, base);
            }
            if ($XMLInterfaceNodeDelayParsers.hasOwnProperty(node.nodeName.toLowerCase())) {
                self.delayNodes.push(node);
            }
        })

        // parse attributes
        _(self.attributes).each( function( attr, index, attributes ) {
            if ($XMLInterfaceAttrParsers.hasOwnProperty(attr.nodeName.toLowerCase())){
                $XMLInterfaceAttrParsers[attr.nodeName.toLowerCase()](self, self.ent, attr, base);
            } else {
                var val = attr.nodeValue;
                if(!isNaN(val)) {
                    val = parseFloat(val);
                }
                self.ent.attr(attr.nodeName.toLowerCase(), val);
            }
        })

        // attach the entities so self relative movements will propagate
        _(self.entities).each( function( e, index, entities ) {
            self.ent.attach(e);
        })

        // set attributes in sub nodes
        _(self.delayNodes).each(function(node, index, delayNodes) {
            try {
                $XMLInterfaceNodeDelayParsers[node.nodeName.toLowerCase()](self, self.ent, self.entities, node, base);
            } catch (e) {
                var errortxt = "Error Parasing Interface '" + self.name + "' on node: " + self.ent._entityName + ":" + node.nodeName.toLowerCase();
                console.log(errortxt, e.message, e.stack);
            }  
        })

        self.interface.entities.extend(self.entities);
        
        DEPTH--
    }
}


function XMLInterface (xml) {
    var self = this
    self.name       = ""
    self.delayNodes = []
    self.ent        = null
    self.entities   = []
    self.xml        = xml

    self.layout = function (base) {
        var self = this
        var basex = base.x, //TODO: Find out why this comes in as undefined
            basey = base.y, //TODO: Find out why even when Crafty.viewport. y doesn't equal 0 this still is 0
            width = base.w,
            height = base.h,
            basez = base.z;

        var inter = new XMLInterfaceNode(self.xml);

        inter.parseNode(basex, basey, basez, width, height, self);

        self.entities.push(inter.ent);

        base.attach(inter.entities[0]);

        _(self.entities).each(function(entity, index, entities) {
            entity.trigger('Change', true);
        });
    };
    
    self.destroy = function() {
        var self = this
        _(self.entities).each(function(entity, index, entities) {
            entity.destroy();
        });
    }
}


function XMLInterfaceParser(xml) {
    var self = this
    self.interfaces = []
    self.map = []
    var self = this
    self.parseInterfaces = function (xml) {
        var self = this
        var interfaces = xml.getElementsByTagName('interface');

        _(interfaces).each( function( interfaceXML, index, interfaces ) {
            var inter = new XMLInterface(interfaceXML)
            inter.name = interfaceXML.attributes['name'].nodeValue
            self.interfaces.push(inter)
            self.map[inter.name] = inter
        })
    }

    self.parseInterfaces(xml)

    //self.getInterface = function (name) {
    self.getInterface = function (name) {
        var self = this
        var inter = self.map[name] || null 
        return inter
    }

}
