function XMLInterface (xml) {
    this.name = "";
    this.delayNodes = ['css', 'html'];
    this.ent = null;
    this.entities = [];

    this.parseInterface = function (xml) {

        var entities = [];
        var delay_nodes = [];
        var children = xml.childNodes;
        var attributes = xml.attributes;
        var ent = Crafty.e("2D");

        _(children).each( function( child, index, children ) {
            if(child.nodeName === 'e')
            {
                entities.push(this.parseInterface(child));
            } else if (_(this.delayNodes).contains(child.nodeName)) {
                delay_nodes.push(child);
            }
        });

        _(attributes).each( function( att, index, attributes ) {
            if (attributes[a].nodeName === 'class') {
                ent.require(attributes[a].nodeValue);
            } else {
                var val = attributes[a].nodeValue;
                if(!isNaN(val))
                {
                    val = parseFloat(val);
                }
                ent[attributes[a].nodeName] = val;
            }
        });

        _(delay_nodes).each( function( node, index, delay_nodes ) {
            if (node.nodeName === 'html') {
                node.replace(node.nodeValue);
            } else if (node.nodeName === 'css') {
                node.css(JSON.parse(node.nodeValue));
            }
        });

        _(entities).each( function( e, index, entities ) {
            ent.attach(e);
        });

        this.entities.push(ent);
        return ent;
    };
    
    this.ent = this.parseInterface(xml);
}


function XMLInterfacePraser(xml) {

    this.interfaces = [];

    this.parseInterfaces = function (xml) { 
        var interfaces = xml.getElementsByTagName('interface');

        _(interfaces).each( function( interfaceXML, index, interfaces ) {
            var inter = new XMLInterface(interfaceXML);
            this.interfaces.push(inter);
        });
    };

    this.parseInterfaces(xml);

}
