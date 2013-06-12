// April Fools is best holiday

function stealthBoing(){
var lyra = new Image();
lyra.id = "stealthLyra";
lyra.style.position = "fixed";
lyra.style.left = Math.floor((window.innerWidth/2)-250) + "px";
lyra.style.bottom = "0px";
lyra.onload = function(){
document.body.appendChild(lyra);
setTimeout("clearLyra()",1900);
}
lyra.src = "http://fc08.deviantart.net/fs70/f/2011/337/a/6/lyra_____surprise____by_sirponylancelot-d4i1evk.gif";
}
function clearLyra(){
document.body.removeChild(document.getElementById("stealthLyra"));
setTimeout("stealthBoing()",((Math.random()*160)+20)*1000);
}
setTimeout('stealthBoing()',((Math.random()*45)+15)*1000);