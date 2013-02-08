function XMLInterfaceNode (xml) {
    this.minwidth = 0;
    this.minhight = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.portionwidth = 0;
    this.portionhight = 0;
    this.width = 0;
    this.height = 0;
    this.xml = xml;
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
    this.delayNodes = ['css', 'html', 'init'];
    this.ent = null;
    this.entities = [];
    this.xml = xml;

    this.parseInterface = function (xml, basex, basey, basez, width, height) {

        var entities = [],
            delay_nodes = [],
            parse_nodes = [],
            minwidth = 0,
            minhight = 0,
            widthportions = 0,
            hightportions = 0,
            children = xml.childNodes,
            attributes = xml.attributes,
            ent = Crafty.e("2D");

        // get child nodes and figureout how to parse them
        _(children).each( function( node, index, children ) {
            if (node.nodeName === 'e') {
                var inter = new XMLInterfaceNode(node);
                minwidth += inter.minwidth;
                minhight += inter.minhight;
                widthportions += inter.portionwidth;
                hightportions += inter.portionhight;
                parse_nodes.push(inter);
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
        ent.x = ent.x + baseX || baseX;
        ent.y = ent.y + baseY || baseY;
        ent.z = ent.z + baseZ || baseZ;

        // figure out the size of each node and parse it
        var lessminwidth = width - minwidth,
            lessminhight = hight - minhight,
            widthportion = 0,
            hightportion = 0;

        if (lessminwidth > 0) {
            widthportion = Math.round(lessminwidth / widthportions);
        }
        if (lessminhight > 0) {
            hightportion = Math.round(lessminhight / hightportions);
        }

        _(parse_nodes).each( function( node, index, parse_nodes ) {
            var subwidth = widthportion * node.portionwidth,
                subhight = hightportion * node.portionhight;
            entities.push(this.parseInterface(node.node, basex, basey, basez, subwidth, subheight));
        });

        // set attributes in sub nodes
        _(delay_nodes).each( function( node, index, delay_nodes ) {
            try {
                if (node.nodeName === 'html') {
                    ent.replace(node.nodeValue);
                } else if (node.nodeName === 'css') {
                    ent.css(JSON.parse(node.nodeValue));
                } else if (node.nodeName === 'init') {
                    ent[node.nodeValue]();
                }
            } catch (e) {
                console.log("Error Phrasing Interface " + this.name + "on node: " + node.nodeName, e.message, e);
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
