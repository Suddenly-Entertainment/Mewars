$XMLAttrParsers = {
    component: function (that, ent, attr, base){
        ent.require(attr.nodeValue);
    },
    name: function (that, ent, attr, base) {
        ent.setName(attr.nodeValue);
        that.name = attr.nodeValue;
    },
    x: function (that, ent, attr, base) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        ent.x = val + base.basex || base.basex;
    },
    y: function (that, ent, attr, base) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        ent.y = val + base.basey || base.basey;
    },
    z: function (that, ent, attr, base) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        ent.z = val + base.basez || base.basez;
    }
};

$XMLNodeParsers = {
    e: function (that, ent, entities, nodes, node, base){
        var inter = new XMLEntityNode(node);
        nodes.push(inter);
    },
    sizer: function (that, ent, entities, nodes, node, base) {
        var sizer = new XMLSizerNode(node);
        nodes.push(sizer);
    }
};

$XMLNodeDelayParsers = {
    e: function (that, ent, entities, node, base){
        entities.push(that.parseNode(node, base.basex, base.basey, base.basez, base.width, base.height));
    },
    sizer: function (that, ent, entities, nodes, node, base) {
        var entity = that.parseNode(node, base.basex, base.basey, base.basez, base.width, base.height);
        entities.push(entity);
        node.layout(entity);
    },
    init: function (that, ent, entities, node, base) {
        ent[node.childNodes[0].nodeValue]();
    },
    attr: function (that, ent, entities, node, base) {
        _(node.childNodes).each( function( attr, index, attributes) {
            var val = attr.childNodes[0].nodeValue;
            if(!isNaN(val)) {
                val = parseFloat(val);
            }
            ent.attr(attr.nodeName.toLowerCase(), val);
        });
    },
    html: function (that, ent, entities, node, base) {
        ent.replace(node.childNodes[0].nodeValue);
    },
    css: function (that, ent, entities, node, base) {
        ent.css(JSON.parse(node.childNodes[0].nodeValue));
    },
    text: function (that, ent, entities, node, base) {
        _(node.childNodes).each( function( node, index, nodes) {
            if (node.nodeName.toLowerCase() === 'value') {
                var text = node.childNodes[0].nodeValue;
                ent.text(text);
            } else if (node.nodeName.toLowerCase() === 'textcolor') {
                var color = JSON.parse(node.childNodes[0].nodeValue);
                ent.textColor(color[0], color[1]);
            } else if (node.nodeName.toLowerCase() === 'textfont') {
                var font = JSON.parse(node.childNodes[0].nodeValue);
                ent.textFont(font);
            }
        });
    }
};



function XMLSizerNode (xml) {
    this.name    = '';
    this.type    = '';
    this.x       = 0;
    this.y       = 0;
    this.z       = 0;
    this.portion = 0;
    this.width   = 0;
    this.height  = 0;
    this.xml     = xml;
    this.ptop    = 0;
    this.pbottom = 0;
    this.pleft   = 0;
    this.pright  = 0;
    this.align   = '';
    this.expand  = true;
    this.rows    = 0;
    this.cols    = 0;
    this.vgap    = 0;
    this.hgap    = 0;
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        this[atter.nodeName.toLowerCase()] = val;
    });
    this.layout = function (ent) {
        if (this.type === 'verticle') {
            _(ent.entities).each( function( ent, index, entities ) {
                
            });

        } else if (this.type === 'horizontal') {

        } else if (this.type === 'grid') {

        }
        // var x = 0, y = 0;
        // figure out the size of each node and parse it
        // var lessminWidth     = width - minWidth,
        //     lessminHeight    = height - minHeight,
        //     widthportion     = 0,
        //     heightportion    = 0;

        // if (lessminWidth > 0) {
        //     widthportion = Math.round(lessminWidth / widthportions);
        // }
        // if (lessminHeight > 0) {
        //     heightportion = Math.round(lessminHeight / heightportions);
        // }
        // var subwidth = widthportion * inter.portionWidth + inter.minWidth,
        //     subheight = heightportion * inter.portionHeight + inter.minHeight;
        // x += subwidth + inter.paddingLeft;
        // y += subheight + inter.paddingTop;
        // x += inter.paddingRight;
        // y += inter.paddingBottom;
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
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        this[atter.nodeName.toLowerCase()] = val;
    });
}

function XMLInterface (xml) {
    this.name       = "";
    this.delayNodes = ['css', 'html', 'init', 'attr', 'text', 'sizer'];
    this.ent        = null;
    this.entities   = [];
    this.xml        = xml;

    this.parseNode = function (xml, basex, basey, basez, width, height) {

        var entities     = [],
            delay_nodes  = [],
            nodes        = [],
            children     = xml.childNodes,
            attributes   = xml.attributes,
            ent          = Crafty.e("2D");

        // get child nodes and figureout how to parse them
        var base = {basex: basex, basey: basey, basez: basez, width: width, height: height};
        var that = this;

        _(children).each( function( node, index, children ) {
            if ($XMLNodeParsers.hasOwnProperty(node.nodeName.toLowerCase())) {
                $XMLNodeParsers[node.nodeName.toLowerCase()](that, ent, entities, nodes, node, base);
            }
            if ($XMLNodeDelayParsers.hasOwnProperty(node.nodeName.toLowerCase())) {
                delay_nodes.push(node);
            }
        });

        // parse attributes
        _(attributes).each( function( attr, index, attributes ) {
            if ($XMLAttrParsers.hasOwnProperty(node.nodeName.toLowerCase())){
                $XMLAttrParsers[node.nodeName.toLowerCase()](that, ent, attr, base);
            } else {
                var val = atter.nodeValue;
                if(!isNaN(val)) {
                    val = parseFloat(val);
                }
                ent.attr(attr.nodeName.toLowerCase(), val);
            }
        });

        // set attributes in sub nodes
        _(delay_nodes).each( function( node, index, delay_nodes ) {
            try {
                $XMLNodeDelayParsers[node.nodeName.toLowerCase()](that, ent, entities, node, base);
            } catch (e) {
                errortxt = "Error Phrasing Interface " + this.name + "on node: " + ent.name + ":" + node.nodeName.toLowerCase();
                console.log(errortxt, e.message, e);
            }
        });

        _(entities).each( function( e, index, entities ) {
            ent.attach(e);
        });

        return ent;
    };

    this.layout = function (base) {
        var basex = base.x,
            basey = base.y,
            width = base.w,
            heigt = base.h,
            basez = base.z;
        var inter = this.parseNode(this.xml, basex, basey, basez, width, height);
        base.attach(inter);
    };
    
}


function XMLInterfacePraser(xml) {

    this.interfaces = [];
    this.map = [];

    this.parseInterfaces = function (xml) {
        var interfaces = xml.getElementsByTagName('interface');

        _(interfaces).each( function( interfaceXML, index, interfaces ) {
            var inter = new XMLInterface(interfaceXML);
            this.interfaces.push(inter);
            this.map[inter.name] = inter;
        });
    };

    this.parseInterfaces(xml);

}
