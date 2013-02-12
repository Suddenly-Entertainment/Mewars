function XMLInterfaceNode (xml) {
    this.minWidth = 0;
    this.minHeight = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.portionWidth = 0;
    this.portionHeight = 0;
    this.width = 0;
    this.height = 0;
    this.xml = xml;
    this.paddingTop = 0;
    this.paddingBottom = 0;
    this.paddingLeft = 0;
    this.paddingRight = 0;
    _(xml.attributes).each( function( atter, index, attributes ) {
        var val = atter.nodeValue;
        if(!isNaN(val)) {
            val = parseFloat(val);
        }
        this[atter.nodeName.toLowerCase()] = val;  
    });
}

function XMLInterface (xml) {
    this.name = "";
    this.delayNodes = ['css', 'html', 'init', 'attr'];
    this.ent = null;
    this.entities = [];
    this.xml = xml;

    this.parseInterface = function (xml, basex, basey, basez, width, height) {

        var entities = [],
            delay_nodes = [],
            parse_interfaces = [],
            minWidth = 0,
            minHeight = 0,
            widthportions = 0,
            heightportions = 0,
            children = xml.childNodes,
            attributes = xml.attributes,
            ent = Crafty.e("2D");

        // get child nodes and figureout how to parse them
        _(children).each( function( node, index, children ) {
            if (node.nodeName === 'e') {
                var inter = new XMLInterfaceNode(node);
                minWidth += inter.minWidth + inter.paddingRight + inter.paddingLeft;
                minHeight += inter.minHeight + inter.paddingTop + inter.paddingBottom;
                widthportions += inter.portionWidth;
                heightportions += inter.portionHeight;
                parse_interfaces.push(inter);
            } else if (_(this.delayNodes).contains(node.nodeName)) {
                delay_nodes.push(node);
            }
        });

        // parse attributes
        _(attributes).each( function( atter, index, attributes ) {
            if (atter.nodeName === 'class') {
                ent.require(atter.nodeValue);
            } else if (atter.nodeName === 'name') {
                ent.setName(atter.nodeValue);
                this.name = atter.nodeValue;
            } else {
                var val = atter.nodeValue;
                if(!isNaN(val)) {
                    val = parseFloat(val);
                }
                ent[atter.nodeName.toLowerCase()] = val;
            }
        });

        // set position relative to parent node
        ent.x = ent.x + basex || basex;
        ent.y = ent.y + basey || basey;
        ent.z = ent.z + basez || basez;

        // figure out the size of each node and parse it
        var lessminWidth = width - minWidth,
            lessminHeight = height - minHeight,
            widthportion = 0,
            heightportion = 0;

        if (lessminWidth > 0) {
            widthportion = Math.round(lessminWidth / widthportions);
        }
        if (lessminHeight > 0) {
            heightportion = Math.round(lessminHeight / heightportions);
        }

        var x = 0, y = 0;
        _(parse_interfaces).each( function( inter, index, parse_interfaces ) {
            var subwidth = widthportion * inter.portionWidth + inter.minWidth,
                subheight = heightportion * inter.portionHeight + inter.minHeight;
            x += subwidth + inter.paddingLeft;
            y += subheight + inter.paddingTop;
            entities.push(this.parseInterface(inter.node, basex + x, basey + y, basez, subwidth, subheight));
            x += inter.paddingRight;
            y += inter.paddingBottom;
        });

        // set attributes in sub nodes
        _(delay_nodes).each( function( node, index, delay_nodes ) {
            try {
                if (node.nodeName === 'html') {
                    ent.replace(node.childNodes[0].nodeValue);
                } else if (node.nodeName === 'css') {
                    ent.css(JSON.parse(node.childNodes[0].nodeValue));
                } else if (node.nodeName === 'init') {
                    ent[node.childNodes[0].nodeValue]();
                } else if (node.nodeName === 'attr') {
                    _(node.childNodes).each( function( attr, index, attributes) {
                        var val = attr.childNodes[0].nodeValue;
                        if(!isNaN(val)) {
                            val = parseFloat(val);
                        }
                        ent[attr.nodeName.toLowerCase()] = val;
                    });
                }
            } catch (e) {
                errortxt = "Error Phrasing Interface " + this.name + "on node: " + ent.name + ":" + node.nodeName;
                console.log(errortxt, e.message, e);
            }
        });

        

        _(entities).each( function( e, index, entities ) {
            ent.attach(e);
        });

        this.entities.push(ent);
        return ent;
    };

    this.layout = function (base) {
        var basex = base.x,
            basey = base.y,
            width = base.w,
            heigt = base.h,
            basez = base.z;
        var inter = this.parseInterface(this.xml, basex, basey, basez, width, height);
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
