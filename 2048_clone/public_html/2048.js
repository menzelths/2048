/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){
$("body").html("2048<br>");

var breite=Math.min(window.innerHeight,window.innerWidth);
var delta=breite/4.0;
var schriftgroesse=breite/8.0;
$("body").append("<canvas width='"+breite+"px' height='"+breite+"px' id='bild'></canvas><br><div id='ausgabe'/>");
var c=$("#bild")[0].getContext("2d");
var rv=[-1,0,0,-1,1,0,0,1];
var richtung=["links","oben","rechts","unten"];
var potenzen=[];
var zahl=1;
var spiellaeuft=true;
for (var i=0;i<6;i++){
    potenzen[i]=zahl;
    zahl*=2;
}
potenzen[0]=""; // kein text
var farben=["#777777","#ffff00","ffffaa","#ffaaaa","#ff00aa","#ff0000"];
var belegung=[];
function start(){ // baut spielfeld neu auf
    c.fillStyle="#bbbbbb";
    c.fillRect(0,0,breite,breite);
   
    // belegung löschen
    for (var i=0;i<16;i++){
        belegung[i]=0;
    }
    // zufallswert legen
    var zz=parseInt(Math.random()*1.3+1);
    var pos=parseInt(Math.random()*16);
    var z=holeZufall();
    belegung[z[0]]=z[1];
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

function rotiere(cx, cy, x, y, winkel) {
    var radians = (Math.PI / 180) * winkel,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) - (sin * (y - cy)) + cx,
        ny = (sin * (x - cx)) + (cos * (y - cy)) + cy;
    return [nx, ny];
}

function dreheFeld(winkel,feld){
    this.gedrehtesFeld=[];
    // in diese richtung wird gedreht
    for (var x=0;x<4;x++){
        for (var y=0;y<4;y++){
            var koordinaten=rotiere(1.5,1.5,x,y,winkel);
            var stelle=parseInt(koordinaten[0]+.5)+parseInt(koordinaten[1]+.5)*4;
            this.gedrehtesFeld[stelle]=feld[y*4+x];
        }
    }
    return this.gedrehtesFeld;
}

function holeZufall(){
    // freie felder zählen
    var summe=0;
    for (var i=0;i<belegung.length;i++){
        if (belegung[i]===0){
            summe++;
        }
    }
    var pos1=parseInt(Math.random()*summe);
    var zz=parseInt(Math.random()*1.3+1);
    var pos=0;
    summe=0;
    for (var i=0;i<belegung.length;i++){
        if (belegung[i]===0){
            summe++;
            if (summe===pos1){
                pos=i;
                i=belegung.length;
            }
        }
    }
    return [pos,zz];
}

function bewege(r){ // bewege feld in die richtige richtung: 0 links, 1 oben, 2 rechts, 3 unten
    var feld=[];
    for (var i=0;i<4;i++){
        feld[i]=[];
    }
    if (r===1){ // anpassung an koordinatensystem
        r=3;
    } else if (r===3){
        r=1;
    }
    var gedrehtesFeld=dreheFeld(90*r,belegung);
    // jetzt alles nach links schieben
    for (var y=0;y<4;y++){
        for (var x=0;x<4;x++){
            if (gedrehtesFeld[y*4+x]>0){
                feld[y].push(gedrehtesFeld[y*4+x]);
            }
        }
    }
    // jetzt wieder zurückdrehen
    for (var i=0;i<4;i++){ // feld durchlaufen
        for (var j=0;j<feld[i].length-1;j++){
            if (feld[i][j]===feld[i][j+1]){
                feld[i][j]++; // potenz um 1 erhöhen
                feld[i][j+1]*=-1; // alten wert mit -1 multiplizieren
            } 
        }
    }
    // jetzt nur die positiven werte nehmen
    var feldneu=[];
    for (var i=0;i<16;i++){
        feldneu[i]=0; // alles löschen
    }
    for (var i=0;i<4;i++){
        var zaehlerx=0;
        for (var j=0;j<feld[i].length;j++){
            if (feld[i][j]>0){
                feldneu[i*4+zaehlerx]=feld[i][j];
                zaehlerx++;
            }
        }
    }
    // dieses feld drehen und darstellen
    belegung=dreheFeld(-r*90,feldneu); // um fehlenden winkel weiterdrehen
    // neue zufallszahl holen und setzen
    var z=holeZufall();
    belegung[z[0]]=z[1];
    render();
    
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