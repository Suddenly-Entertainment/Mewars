// HSLTransform.js
// 2013-07-23, Linaea, GNU GPL v3+
// Provides utilities to manipulate HSL pixel data

// `exclusiveTransform`
//  Multiplies values in pic by transform if they are outside of range.
// *Assumes:* pix is an array in RGB-space (returned by Canvas.getImageData.data);
//            transform contains fields h, s, and l
// *Returns:* modified pix array
function exclusiveTransform(pix, transform, range) {
    if (!(range.from && range.to && range.from.r && range.from.g && range.from.b && range.to.r && range.to.g && range.to.b)) {
        throw "Badly-formed data structure range";
    }
    var hsl, t;
    for (var i = 0, n = pix.length; i < n; i += 4) {
        if (!(pix[i].between(range.from.r, range.to.r) && pix[i+1].between(range.from.g, range.to.g) && pix[i+2].between(range.from.b, range.to.b))) {
            hsl = rgbToHsl(pix[i], pix[i+1], pix[i+2]);
            hsl.h=hsl.h*transform.h;
            hsl.s=hsl.s*transform.s;
            hsl.l=hsl.l*transform.l;
            t = hslToRgb(hsl.h, hsl.s, hsl.l);
            pix[i] = t.r;
            pix[i+1] = t.g;
            pix[i+2] = t.b;
        }
    }
    return pix;
}

// `inclusiveTransform`
//  Multiplies values in pic by transform if they are inside range.
// *Assumes:* pix is an array in RGB-space (returned by Canvas.getImageData.data);
//            transform contains fields h, s, and l
// *Returns:* modified pix array
function inclusiveTransform(pix, transform, range) {
    if (!(range.from && range.to && range.from.r && range.from.g && range.from.b && range.to.r && range.to.g && range.to.b)) {
        throw "Badly-formed data structure range";
    }
    var hsl, t;
    for (var i = 0, n = pix.length; i < n; i += 4) {
        if (pix[i].between(range.from.r, range.to.r) && pix[i+1].between(range.from.g, range.to.g) && pix[i+2].between(range.from.b, range.to.b)) {
            hsl = rgbToHsl(pix[i], pix[i+1], pix[i+2]);
            hsl.h=hsl.h*transform.h;
            hsl.s=hsl.s*transform.s;
            hsl.l=hsl.l*transform.l;
            t = hslToRgb(hsl.h, hsl.s, hsl.l);
            pix[i] = t.r;
            pix[i+1] = t.g;
            pix[i+2] = t.b;
        }
    }
    return pix;
}

// `number.between`
// Operator checking if number is between a and b.
// *Assumes:* a and b are numbers
// *Returns:* true if number is between a and b, false otherwise
Number.prototype.between = function(a,b) {
    return (a>b)?(this>=b && this<=a):(this>=a && this<=b);
};


// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {

    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min) {
        h = s = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return { h: h, s: s, l: l };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
    var r, g, b;

    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);

    function hue2rgb(p, q, t) {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    if(s === 0) {
        r = g = b = l; // achromatic
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}
// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
    n = Math.min(max, Math.max(0, parseFloat(n)));
    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}