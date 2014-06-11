$(document).ready(function() {
    $("body").html("<div class='dick'>Menzels 2048</div>");
    var punkte = 0;
    letzter_klick= new Date().getTime();
    var zeitdifferenz=600;
    var breite = Math.min(window.innerHeight, window.innerWidth);
    var delta = breite / 4.0;
    var schriftgroesse = breite / 11.0;
    var textspezialpunkte=[500,1000,5000,10000,20000,40000,60000,1000000];
    var textspezial=["Nicht schlecht!","Ganz passabel!","Jetzt wird es interessant!","Ok, 10000 geknackt","Respekt!","Jetzt wird es spannend!","Auf Rekordwert!","Unfassbar!"];
    $("body").append("<div id='neu' class='knopf dick'>Neustart</div><br><p>");
    $("body").append("<canvas width='" + breite + "px' height='" + breite + "px' id='bild'></canvas><br>");
    $("body").append("<div id='punkte' class='dick'>Punkte: 0</div><div id='ausgabe' class='dick'></div>");
    $("#neu").click(function() {
        start();
    });
    var c = $("#bild")[0].getContext("2d");
    var potenzen = [];
    var zahl = 1;
    var spiellaeuft = true;
    for (var i = 0; i < 16; i++) {
        potenzen[i] = zahl;
        zahl *= 2;
    }
    potenzen[0] = ""; // kein text
    var farben = [];
    for (var i=1;i<potenzen.length;i++){
        farben[i]="rgb(255,"+(((255-(i*50)))%255+255)+","+(((10-(i*30)))%255+255)+")";
    }
    farben[0]="#000000";
    var belegung = [];
    function start() { // baut spielfeld neu auf
        punkte = 0;
        $("#ausgabe").html("Dann mal los!");
        $("#punkte").html("Punkte: 0");
        spiellaeuft = true;
        c.fillStyle = "#bbbbbb";
        c.fillRect(0, 0, breite, breite);
        for (var i = 0; i < 16; i++) { // belegung löschen und zufälligen wert setzen
            belegung[i] = 0;
        }
        var z = holeZufall();
        belegung[z[0]] = -z[1];
        render();
    }

    function render() {
        c.font = "bold " + schriftgroesse + "px Arial";
        c.textAlign = "center";
        for (var i = 0; i < 16; i++) {
            var wert=belegung[i];
            var neu=false;
            if (wert<0){
                belegung[i]*=-1;
                neu=true;
            }
            c.fillStyle = farben[belegung[i]];
            c.fillRect(i % 4 * delta + 2, parseInt(i / 4) * delta + 2, delta - 4, delta - 4); // farben belegen
            if (neu===true){
                c.beginPath();
                c.strokeStyle="#ff0000";
                var dicke=delta/30;
                c.lineWidth=dicke;
                c.rect(i % 4 * delta + 2+dicke, parseInt(i / 4) * delta + 2+dicke, delta - 4-2*dicke, delta - 4-2*dicke);
                c.stroke();
            }
            c.fillStyle = "#000000";
            c.fillText("" + potenzen[belegung[i]], i % 4 * delta + 2 + delta / 2, parseInt(i / 4) * delta + 2 + (delta-schriftgroesse)/2.0+schriftgroesse);       
        }
        var text="";
        for (var i=0;i<textspezialpunkte.length;i++){
            if (punkte>textspezialpunkte[i]){
                text=textspezial[i];
            }
        }
        if (text!==""){
            $("#ausgabe").html(text);
        }
    }

    function rotiere(cx, cy, x, y, winkel) { // rotieren um cx und cy um winkel winkel
        var radians = (Math.PI / 180) * winkel,
                cos = Math.cos(radians),
                sin = Math.sin(radians),
                nx = (cos * (x - cx)) - (sin * (y - cy)) + cx,
                ny = (sin * (x - cx)) + (cos * (y - cy)) + cy;
        return [nx, ny];
    }

    function dreheFeld(winkel, feld) {
        this.gedrehtesFeld = [];
        for (var x = 0; x < 4; x++) {
            for (var y = 0; y < 4; y++) {
                var koordinaten = rotiere(1.5, 1.5, x, y, winkel);
                var stelle = parseInt(koordinaten[0] + .5) + parseInt(koordinaten[1] + .5) * 4;
                this.gedrehtesFeld[stelle] = feld[y * 4 + x];
            }
        }
        return this.gedrehtesFeld;
    }

    function holeZufall() {
        // freie felder zählen
        var summe = 0;
        for (var i = 0; i < belegung.length; i++) {
            if (belegung[i] === 0) {
                summe++;
            }
        }
        if (summe > 0) {
            var pos1 = parseInt(Math.random() * summe);
            var zz = parseInt(Math.random() * 1.2 + 1);
            var pos = 0;
            summe = -1;
            for (var i = 0; i < belegung.length; i++) {
                if (belegung[i] === 0) {
                    summe++;
                    if (summe === pos1) {
                        pos = i;
                        i = belegung.length;
                    }
                }
            }
            return [pos, zz];
        } else {
            return [];
        }
    }

    function bewege(r) { // bewege feld in die richtige richtung: 0 links, 1 oben, 2 rechts, 3 unten
        var deltapunkte = 0;
        var feld = [];
        for (var i = 0; i < 4; i++) {
            feld[i] = [];
        }
        if (r % 2 === 1) { // anpassung an koordinatensystem
            r = (r + 2) % 4;
        }
        var gedrehtesFeld = dreheFeld(90 * r, belegung);
        // jetzt alles nach links schieben
        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 4; x++) {
                if (gedrehtesFeld[y * 4 + x] > 0) {
                    feld[y].push(gedrehtesFeld[y * 4 + x]);
                }
            }
        }
        for (var i = 0; i < 4; i++) { // feld durchlaufen 
            for (var j = 0; j < feld[i].length - 1; j++) {
                if (feld[i][j] === feld[i][j + 1]) {
                    feld[i][j]++; // potenz um 1 erhöhen
                    deltapunkte += potenzen[feld[i][j]];
                    feld[i][j + 1] *= -1; // alten wert mit -1 multiplizieren
                }
            }
        }
        var feldneu = []; // jetzt nur die positiven werte nehmen
        for (var i = 0; i < 16; i++) {
            feldneu[i] = 0; // alles löschen
        }
        for (var i = 0; i < 4; i++) {
            var zaehlerx = 0;
            for (var j = 0; j < feld[i].length; j++) {
                if (feld[i][j] > 0) {
                    feldneu[i * 4 + zaehlerx] = feld[i][j];
                    zaehlerx++;
                }
            }
        }
        var belegung2 = dreheFeld(-r * 90, feldneu); // um fehlenden winkel weiterdrehen
        
        var unterschied = 0; // vergleichen mit belegung, ob sich etwas geändert hat
        for (var i = 0; i < belegung.length; i++) {
            if (belegung[i] !== belegung2[i]) {
                unterschied++;
            }
        }
        if (unterschied > 0) {
        for (var i = 0; i < belegung.length; i++) {
            belegung[i] = belegung2[i];      
        }
            punkte += deltapunkte;
            
            var z = holeZufall(); // neue zufallszahl holen und setzen
            if (z.length > 0) {
                belegung[z[0]] = -z[1];
                render();
                $("#punkte").html("Punkte: " + punkte);
            } else {
                spiellaeuft = false;
                $("#ausgabe").html("Leider verloren!");
            }
        }
    }

    $("#bild").mousedown(function(event) {
        event.preventDefault();
        var jetzt=new Date().getTime();
        if (spiellaeuft === true&&jetzt-letzter_klick>zeitdifferenz) {
            letzter_klick=jetzt;
            var positionx = event.pageX - $("#bild")[0].offsetLeft;
            var positiony = event.pageY - $("#bild")[0].offsetTop;
            var x = positionx - breite / 2;
            var y = positiony - breite / 2;
            var winkel = Math.atan2(y, x) + Math.PI + Math.PI / 4.0; // winkel gegen uhrzeigersinn von negativer x-achse
            var r = parseInt(winkel / (Math.PI / 2.0)) % 4;
            bewege(r);
        }
    });
    start();
});