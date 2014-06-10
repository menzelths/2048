/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){
$("body").html("2048<br>");
var breite=300;
var delta=breite/4.0;
var schriftgroesse=300/8.0;
$("body").append("<canvas width='"+breite+"px' height='"+breite+"px' id='bild'></canvas><br><div id='ausgabe'/>");
var c=$("#bild")[0].getContext("2d");
var rv=[-1,0,0,-1,1,0,0,1];
var richtung=["links","oben","rechts","unten"];
var potenzen=[];
var zahl=1;
var spiellaeuft=true;
for (var i=0;i<3;i++){
    potenzen[i]=zahl;
    zahl*=2;
}
potenzen[0]=""; // kein text
var farben=["#777777","#ffff00","ffffaa"];
var belegung=[];
function start(){ // baut spielfeld neu auf
    c.fillStyle="#bbbbbb";
    c.fillRect(0,0,breite,breite);
   
    // belegung löschen
    for (var i=0;i<16;i++){
        belegung[i]=0;
    }
    // zufallswert legen
    var zz=parseInt(Math.random()*2+1);
    var pos=parseInt(Math.random()*16);
    belegung[pos]=zz;
    render();
}

function render(){
    
    c.font = "bold "+schriftgroesse+"px Arial";
    c.textAlign="center";
    for (var i=0;i<16;i++){
        c.fillStyle=farben[belegung[i]];
        c.fillRect(i%4*delta+2,parseInt(i/4)*delta+2,delta-4,delta-4); // farben belegen
        c.fillStyle = "#000000";
        
        c.fillText(""+potenzen[belegung[i]],i%4*delta+2+delta/2,parseInt(i/4)*delta+2+2*delta/3);
        
    }
}

function bewege(r){ // bewege feld in die richtige richtung: 0 links, 1 oben, 2 rechts, 3 unten
    var dx=rv[r*2]; // richtige verschiebung holen, schon bezogen auf bildschirm-ks
    var dy=rv[r*2+1];
    
}

$("#bild").mousedown(function(event) {
        event.preventDefault();
        if (spiellaeuft===true){
            var positionx=event.pageX-$("#bild")[0].offsetLeft;
            var positiony=event.pageY-$("#bild")[0].offsetTop;
            var x=positionx-breite/2;
            var y=positiony-breite/2;
           
            var winkel=Math.atan2(y,x)+Math.PI+Math.PI/4.0; // winkel gegen uhrzeigersinn von negativer x-achse
            var r=parseInt(winkel/(Math.PI/2.0))%4;
            bewege(r);
            $("#ausgabe").html("Richtung: "+richtung[r]);
        }     
    });
    
start();
});