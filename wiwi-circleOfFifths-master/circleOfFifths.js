var texxx = 87;
let outRatio = 0.8;
let outC1;
let outC2;
let outCH;
let outCT;
let outCSP; // 分隔
let outText = ["沒有升降", "1 個 #", "2 個 #", "3 個 #", "4 個 #", "7 個 b / 5 個 #", "6 個 b / 6 個 #", "5 個 b / 7 個 #", "4 個 b", "3 個 b", "2 個 b", "1 個 b"]
let outTextSize = 15;

let majorRatio = 0.74;
let majorC1;
let majorC2;
let majorCT;
let majorText = ["C", "G", "D", "A", "E", "Cb/B", "Gb/F#", "Db/C#", "Ab", "Eb", "Bb", "F"]
let majorTextSize = 22;

let minorRatio = 0.65;
let minorC1;
let minorC2;
let minorCT;
let minorText = ["Am", "Em", "Bm", "F#m", "C#m", "Abm/G#m", "Ebm/D#m", "Bbm/A#m", "Fm", "Cm", "Gm", "Dm"]
let minorTextSize = 17;
let canvasP5;
let showcircle;
let circle = 1;
showcircle = document.getElementById("showcircle");
showcircle.onclick = function () {
  console.log(sss);
  clear();
  background(90);
  if (circle === 1) { //circle origin =1
    WebMidi.disable();

    WebMidi.enable(function (err) { //listen midi keyboard input 

      if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        disableP5Webmidi = true;
        console.log("WebMidi enabled!");
        //console.log(WebMidi.inputs);
        //console.log(WebMidi.outputs);
      }
      var input = WebMidi.getInputByName("A-Series Keyboard Keyboard");
      input.addListener('noteon', "all",
        function (e) {
          console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
          console.log(e.note);

          for (var i = 0; i < allSprites.length; i++) {
            var mySprite = allSprites[i];

            //even if they are out of the canvas, sprites keep getting updated
            //consuming precious memory
            //use Sprite.remove() to remove a sprite from the sketch
            if (e.note.number === 60) {
              mySprite.remove();
              break;
            }
          }

          console.log(allSprites);
        }
      );

    });

    circle = 0;
    console.log("showcircle = false");
  }
  else {
    WebMidi.disable();
    circle = 1;
    console.log("showcircle = True");
  }
}

//P5.play參數
let pg;
var ghost, asterisk;

//------------------------------------------------------------------------------------------------------------
let detailText1 = [
  "C 大調 ─ A 小調",
  "G 大調 ─ E 小調",
  "D 大調 ─ B 小調",
  "A 大調 ─ F# 小調",
  "E 大調 ─ C# 小調",
  "Cb 大調 ─ Ab 小調 / B 大調 ─ G# 小調",
  "Gb 大調 ─ Eb 小調 / F# 大調 ─ D# 小調",
  "Db 大調 ─ Bb 小調 / C# 大調 ─ A# 小調",
  "Ab 大調 ─ F 小調",
  "Eb 大調 ─ C 小調",
  "Bb 大調 ─ G 小調",
  "F 大調 ─ D 小調"
]
let detailTextSize = 22;

let coreRatio = 0.57;
let coreType = "Detail";

let dbText = "Circle of Fifths by NiceChord (Wiwi Kuan)"

let mouseDir;

let acc = 0;
let vel = 0;
let angle = -3.5; // 1 = 1/12 TAU, global angle

let locked = true;

let imgStaff;
let imgSharp;
let imgFlat;

let difficult = 0;
let sel;
var buttonShowcanvas = document.getElementById("showcanvas");
var buttonSetkey = document.getElementById("setkey");
//let show = 0;
//let canvasshow = 0;

let modeLabel = ["Major/Minor", "Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"];

let paintingArray = new Array();

function preload() {
  imgStaff = loadImage("./wiwi-circleOfFifths-master/staff.png");
  imgFlat = loadImage("./wiwi-circleOfFifths-master/flat.png");
  imgSharp = loadImage("./wiwi-circleOfFifths-master/sharp.png");

  //create an animation from a sequence of numbered images
  //pass the first and the last file name and it will try to find the ones in between
  ghost = loadAnimation('./wiwi-circleOfFifths-master/staff.png', './wiwi-circleOfFifths-master/sharp.png');

  //create an animation listing all the images files
  asterisk = loadAnimation('./wiwi-circleOfFifths-master/sharp.png', './wiwi-circleOfFifths-master/flat.png');
}

function setup() {  //p5 init
  print(windowWidth, windowHeight);
  lockButton = createButton('[已鎖定]');
  lockButton.style('position', 'relative');
  lockButton.mousePressed(toggleLocked);

  /*setToneButton = createButton("顯示視覺輔助");
  setToneButton.style('position', 'relative');
  setToneButton.style('left', '10px');
  setToneButton.mousePressed(doSupportThing);*/

  //canvas setting
  canvasP5 = createCanvas(1000, 1000); //800 800      //550 550
  canvasP5.id('circleCanvas');
  canvasP5.style('position', 'absolute');
  canvasP5.style("z-index", '2');
  canvasP5.style("display", "none");
  canvasP5.style("left", "450px");
  canvasP5.style("top", "250px");

  ellipseMode(CENTER);
  colorMode(HSB, 100);
  //colors
  outC1 = color(60, 30, 70);
  outC2 = color(60, 30, 80);
  outCH = color(0, 60, 0);
  outCT = color(60, 0, 95);
  outCSP = color(60, 20, 95);
  majorC1 = color(80, 30, 80);
  majorC2 = color(80, 30, 70);
  majorCT = color(80, 30, 20);
  minorC1 = color(80, 30, 75);
  minorC2 = color(80, 30, 65);
  minorCT = color(80, 10, 90);

  outTextSize = width * 0.01875;
  majorTextSize = width * 0.0275;
  minorTextSize = width * 0.02125;
  detailTextSize = width * 0.0275;

  sel = createSelect();
  sel.style('font-size', '16px');
  sel.style("position", 'relative');
  sel.style('left', '5px');
  sel.style('z-index', '3');
  //sel.position(140, 183);
  sel.option('全顯示');
  sel.option('顯示較少');
  sel.option('只有 1＆5');
  sel.option('根音Only');
  sel.selected('全顯示');
  sel.changed(doSelectThing);

  /*
    normalButton = createButton("簡單");
    normalButton.position(200, 178);
    normalButton.mousePressed(normal);
  
    mediumButton = createButton("普通");
    mediumButton.position(250, 178);
    mediumButton.mousePressed(medium);
  
    hardButton = createButton("困難");
    hardButton.position(300, 178);
    hardButton.mousePressed(hard);
  
    crazyButton = createButton("瘋狂");
    crazyButton.position(350, 178);
    crazyButton.mousePressed(crazy);
  */
}

function doSelectThing() {

  let item = sel.value();
  if (item === "全顯示") {
    reset(); difficult = 0;
    switch (keynum) {
      case 0:
        C_normal(); statustext.innerHTML = "Support Status: C大調-Ａm小調 全顯示";
        break;
      case 1:
        G_normal(); statustext.innerHTML = "Support Status: G大調-E小調 全顯示";
        break;
      case 2:
        D_normal(); statustext.innerHTML = "Support Status: D大調-B小調 全顯示";
        break;
      case 3:
        A_normal(); statustext.innerHTML = "Support Status: A大調-F#小調 全顯示";
        break;
      case 4:
        E_normal(); statustext.innerHTML = "Support Status: E大調-C#小調 全顯示";
        break;
      case 5:
        B_normal(); statustext.innerHTML = "Support Status: Cb/B大調-Ab/G#小調 全顯示";
        break;
      case 6:
        Gb_normal(); statustext.innerHTML = "Support Status: Gb/F#大調-Eb/D#小調 全顯示";
        break;
      case 7:
        Db_normal(); statustext.innerHTML = "Support Status: Db/C#大調-Bb/A#小調 全顯示";
        break;
      case 8:
        Ab_normal(); statustext.innerHTML = "Support Status: Ab大調-F小調 全顯示";
        break;
      case 9:
        Eb_normal(); statustext.innerHTML = "Support Status: Eb大調-C小調 全顯示";
        break;
      case 10:
        Bb_normal(); statustext.innerHTML = "Support Status: Bb大調-G小調 全顯示";
        break;
      case 11:
        F_normal(); statustext.innerHTML = "Support Status: F大調-D小調 全顯示";
        break;
    }
  }
  if (item === "顯示較少") {
    reset(); difficult = 5;
    switch (keynum) {
      case 0:
        C_med(); statustext.innerHTML = "Support Status: C大調-Ａ小調 顯示較少";
        break;
      case 1:
        G_med(); statustext.innerHTML = "Support Status: G大調-E小調 顯示較少";
        break;
      case 2:
        D_med(); statustext.innerHTML = "Support Status: D大調-B小調 顯示較少";
        break;
      case 3:
        A_med(); statustext.innerHTML = "Support Status: A大調-F#小調 顯示較少";
        break;
      case 4:
        E_med(); statustext.innerHTML = "Support Status: E大調-C#小調 顯示較少";
        break;
      case 5:
        B_med(); statustext.innerHTML = "Support Status: Cb/B大調-Ab/G#小調 顯示較少";
        break;
      case 6:
        Gb_med(); statustext.innerHTML = "Support Status: Gb/F#大調-Eb/D#小調 顯示較少";
        break;
      case 7:
        Db_med(); statustext.innerHTML = "Support Status: Db/C#大調-Bb/A#小調 顯示較少";
        break;
      case 8:
        Ab_med(); statustext.innerHTML = "Support Status: Ab大調-F小調 顯示較少";
        break;
      case 9:
        Eb_med(); statustext.innerHTML = "Support Status: Eb大調-C小調 顯示較少";
        break;
      case 10:
        Bb_med(); statustext.innerHTML = "Support Status: Bb大調-G小調 顯示較少";
        break;
      case 11:
        F_med(); statustext.innerHTML = "Support Status: F大調-D小調 顯示較少";
        break;

    }
  }
  if (item === "只有 1＆5") {
    reset(); difficult = 10;
    switch (keynum) {
      case 0:
        C_hard(); statustext.innerHTML = "Support Status: C大調-Ａ小調 顯示 1 & 5";
        break;
      case 1:
        G_hard(); statustext.innerHTML = "Support Status: G大調-E小調 顯示 1 & 5";
        break;
      case 2:
        D_hard(); statustext.innerHTML = "Support Status: D大調-B小調 顯示 1 & 5";
        break;
      case 3:
        A_hard(); statustext.innerHTML = "Support Status: A大調-F#小調 顯示 1 & 5";
        break;
      case 4:
        E_hard(); statustext.innerHTML = "Support Status: E大調-C#小調 顯示 1 & 5";
        break;
      case 5:
        B_hard(); statustext.innerHTML = "Support Status: Cb/B大調-Ab/G#小調 顯示 1 & 5";
        break;
      case 6:
        Gb_hard(); statustext.innerHTML = "Support Status: Gb/F#大調-Eb/D#小調 顯示 1 & 5";
        break;
      case 7:
        Db_hard(); statustext.innerHTML = "Support Status: Db/C#大調-Bb/A#小調 顯示 1 & 5";
        break;
      case 8:
        Ab_hard(); statustext.innerHTML = "Support Status: Ab大調-F小調 顯示 1 & 5";
        break;
      case 9:
        Eb_hard(); statustext.innerHTML = "Support Status: Eb大調-C小調 顯示 1 & 5";
        break;
      case 10:
        Bb_hard(); statustext.innerHTML = "Support Status: Bb大調-G小調 顯示 1 & 5";
        break;
      case 11:
        F_hard(); statustext.innerHTML = "Support Status: F大調-D小調 顯示 1 & 5";
        break;
    }
  }
  if (item === "根音Only") {
    reset(); difficult = 100;
    switch (keynum) {
      case 0:
        C_crazy(); statustext.innerHTML = "Support Status: C大調-Ａ小調 根音Only";
        break;
      case 1:
        G_crazy(); statustext.innerHTML = "Support Status: G大調-E小調 根音Only";
        break;
      case 2:
        D_crazy(); statustext.innerHTML = "Support Status: D大調-B小調 根音Only";
        break;
      case 3:
        A_crazy(); statustext.innerHTML = "Support Status: A大調-F#小調 根音Only";
        break;
      case 4:
        E_crazy(); statustext.innerHTML = "Support Status: E大調-C#小調 根音Only";
        break;
      case 5:
        B_crazy(); statustext.innerHTML = "Support Status: Cb/B大調-Ab/G#小調 根音Only";
        break;
      case 6:
        Gb_crazy(); statustext.innerHTML = "Support Status: Gb/F#大調-Eb/D#小調 根音Only";
        break;
      case 7:
        Db_crazy(); statustext.innerHTML = "Support Status: Db/C#大調-Bb/A#小調 根音Only";
        break;
      case 8:
        Ab_crazy(); statustext.innerHTML = "Support Status: Ab大調-F小調 根音Only";
        break;
      case 9:
        Eb_crazy(); statustext.innerHTML = "Support Status: Eb大調-C小調 根音Only";
        break;
      case 10:
        Bb_crazy(); statustext.innerHTML = "Support Status: Bb大調-G小調 根音Only";
        break;
      case 11:
        F_crazy(); statustext.innerHTML = "Support Status: F大調-D小調 根音Only";
        break;
    }
  }
}

//
buttonShowcanvas.onclick = function () {    //顯示p5畫布


  if (canvasshow === 0) {
    canvasP5.style("display", "block");
    canvasshow = 1;
    show = 1;
  }
  else if (canvasshow === 1) {
    canvasP5.style("display", "none");
    canvasshow = 0;
    show = 0;
  }
}

function normal() {
  difficult = 0;
}
function medium() {
  difficult = 5;
}

function hard() {
  difficult = 10;
}

function crazy() {
  difficult = 100;
}

function toggleLocked() {
  if (locked) {
    lockButton.html("鎖定");
    locked = false;
  } else {
    lockButton.html("[已鎖定]");
    locked = true;
  }
}

function highlighted() {
  let x = mouseDir - angle;
  while (x < 0) {
    x += 12;
  }
  x = ((x * 10000) % 120000) / 10000;

  return floor(x);
}

var statustext = document.getElementById("statusbar");

buttonSetkey.onclick = function () {
  alert("請按下你要的key");
  WebMidi.disable();
  WebMidi.enable(function (err) { //listen midi keyboard input 

    if (err) {
      console.log("WebMidi could not be enabled.", err);
    } else {
      console.log("WebMidi enabled!");
      //console.log(WebMidi.inputs);
      //console.log(WebMidi.outputs);
    }
    var input = WebMidi.getInputByName("A-Series Keyboard Keyboard");
    input.addListener('noteon', "all",
      function (e) {
        console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
        var tmpkeynum = 0;
        tmpkeynum = e.note.number % 12;
        aaaa = e.note.number % 12;

        if (tmpkeynum === 0) {  //C
          reset();
          keynum = 0;
          if (difficult === 0) { C_normal(); statustext.innerHTML = "Support Status: C大調-Ａ小調 全顯示"; }
          if (difficult === 5) { C_med(); statustext.innerHTML = "Support Status: C大調-Ａ小調 顯示較少"; }
          if (difficult === 10) { C_hard(); statustext.innerHTML = "Support Status: C大調-Ａ小調 顯示 1 & 5"; }
          if (difficult === 100) { C_crazy(); statustext.innerHTML = "Support Status: C大調-Ａ小調 根音Only"; }
          WebMidi.disable();
        }
        if (tmpkeynum === 7) {  //G
          reset();
          keynum = 1;
          if (difficult === 0) { G_normal(); statustext.innerHTML = "Support Status: G大調-E小調 全顯示"; }
          if (difficult === 5) { G_med(); statustext.innerHTML = "Support Status: G大調-E小調 顯示較少"; }
          if (difficult === 10) { G_hard(); statustext.innerHTML = "Support Status: G大調-E小調 顯示 1 & 5"; }
          if (difficult === 100) { G_crazy(); statustext.innerHTML = "Support Status: G大調-E小調 根音Only"; }
          WebMidi.disable();
        }
        if (tmpkeynum === 2) {  //D
          reset();
          keynum = 2;
          if (difficult === 0) { D_normal(); statustext.innerHTML = "Support Status: D大調-B小調 全顯示"; }
          if (difficult === 5) { D_med(); statustext.innerHTML = "Support Status: D大調-B小調 顯示較少"; }
          if (difficult === 10) { D_hard(); statustext.innerHTML = "Support Status: D大調-B小調 顯示 1 & 5"; }
          if (difficult === 100) { D_crazy(); statustext.innerHTML = "Support Status: D大調-B小調 根音Only"; }
          WebMidi.disable();
        }
        if (tmpkeynum === 9) {  //A
          reset();
          keynum = 3;
          if (difficult === 0) { A_normal(); statustext.innerHTML = "Support Status: A大調-F#小調 全顯示"; }
          if (difficult === 5) { A_med(); statustext.innerHTML = "Support Status: A大調-F#小調 顯示較少"; }
          if (difficult === 10) { A_hard(); statustext.innerHTML = "Support Status: A大調-F#小調 顯示 1 & 5"; }
          if (difficult === 100) { A_crazy(); statustext.innerHTML = "Support Status: A大調-F#小調 根音Only"; }
          WebMidi.disable();
        }
        if (tmpkeynum === 4) {  //E
          reset();
          keynum = 4;
          if (difficult === 0) { E_normal(); statustext.innerHTML = "Support Status: E大調-C#小調 全顯示"; }
          if (difficult === 5) { E_med(); statustext.innerHTML = "Support Status: E大調-C#小調 顯示較少"; }
          if (difficult === 10) { E_hard(); statustext.innerHTML = "Support Status: E大調-C#小調 顯示 1 & 5"; }
          if (difficult === 100) { E_crazy(); statustext.innerHTML = "Support Status: E大調-C#小調 根音Only"; }
          WebMidi.disable();
        }
        if (tmpkeynum === 11) {  // Cb/B
          reset();
          keynum = 5;
          if (difficult === 0) { B_normal(); statustext.innerHTML = "Support Status: Cb/B大調-Ab/G#小調 全顯示"; }
          if (difficult === 5) { B_med(); statustext.innerHTML = "Support Status: Cb/B大調-Ab/G#小調 顯示較少"; }
          if (difficult === 10) { B_hard(); statustext.innerHTML = "Support Status: Cb/B大調-Ab/G#小調 顯示 1 & 5"; }
          if (difficult === 100) { B_crazy(); statustext.innerHTML = "Support Status: Cb/B大調-Ab/G#小調 根音Only"; }
          WebMidi.disable();
        }
        if (tmpkeynum === 6) {  // Gb/F#
          reset();
          keynum = 6;
          if (difficult === 0) { Gb_normal(); statustext.innerHTML = "Support Status: Gb/F#大調-Eb/D#小調 全顯示"; }
          if (difficult === 5) { Gb_med(); statustext.innerHTML = "Support Status: Gb/F#大調-Eb/D#小調 顯示較少"; }
          if (difficult === 10) { Gb_hard(); statustext.innerHTML = "Support Status: Gb/F#大調-Eb/D#小調 顯示 1 & 5"; }
          if (difficult === 100) { Gb_crazy(); statustext.innerHTML = "Support Status: Gb/F#大調-Eb/D#小調 根音Only"; }
          WebMidi.disable();
        }
        if (tmpkeynum === 1) {  // Db/C#
          reset();
          keynum = 7;
          if (difficult === 0) { Db_normal(); statustext.innerHTML = "Support Status: Db/C#大調-Bb/A#小調 全顯示"; }
          if (difficult === 5) { Db_med(); statustext.innerHTML = "Support Status: Db/C#大調-Bb/A#小調 顯示較少"; }
          if (difficult === 10) { Db_hard(); statustext.innerHTML = "Support Status: Db/C#大調-Bb/A#小調 顯示 1 & 5"; }
          if (difficult === 100) { Db_crazy(); statustext.innerHTML = "Support Status: Db/C#大調-Bb/A#小調 根音Only"; }
          WebMidi.disable();
        }
        if (tmpkeynum === 8) {  //Ab
          reset();
          keynum = 8;
          if (difficult === 0) { Ab_normal(); statustext.innerHTML = "Support Status: Ab大調-F小調 全顯示"; }
          if (difficult === 5) { Ab_med(); statustext.innerHTML = "Support Status: Ab大調-F小調 顯示較少"; }
          if (difficult === 10) { Ab_hard(); statustext.innerHTML = "Support Status: Ab大調-F小調 顯示 1 & 5"; }
          if (difficult === 100) { Ab_crazy(); statustext.innerHTML = "Support Status: Ab大調-F小調 根音Only"; }
          WebMidi.disable();
        }
        if (tmpkeynum === 3) {  //Eb
          reset();
          keynum = 9;
          if (difficult === 0) { Eb_normal(); statustext.innerHTML = "Support Status: Eb大調-C小調 全顯示"; }
          if (difficult === 5) { Eb_med(); statustext.innerHTML = "Support Status: Eb大調-C小調 顯示較少"; }
          if (difficult === 10) { Eb_hard(); statustext.innerHTML = "Support Status: Eb大調-C小調 顯示 1 & 5"; }
          if (difficult === 100) { Eb_crazy(); statustext.innerHTML = "Support Status: Eb大調-C小調 根音Only"; }
          WebMidi.disable();
        }
        if (tmpkeynum === 10) { //Bb
          reset();
          keynum = 10;
          if (difficult === 0) { Bb_normal(); statustext.innerHTML = "Support Status: Bb大調-G小調 全顯示"; }
          if (difficult === 5) { Bb_med(); statustext.innerHTML = "Support Status: Bb大調-G小調 顯示較少"; }
          if (difficult === 10) { Bb_hard(); statustext.innerHTML = "Support Status: Bb大調-G小調 顯示 1 & 5"; }
          if (difficult === 100) { Bb_crazy(); statustext.innerHTML = "Support Status: Bb大調-G小調 根音Only"; }
          WebMidi.disable();
        }
        if (tmpkeynum === 5) { //F key
          reset();
          keynum = 11;
          if (difficult === 0) { F_normal(); statustext.innerHTML = "Support Status: F大調-D小調 全顯示"; }
          if (difficult === 5) { F_med(); statustext.innerHTML = "Support Status: F大調-D小調 顯示較少"; }
          if (difficult === 10) { F_hard(); statustext.innerHTML = "Support Status: F大調-D小調 顯示 1 & 5"; }
          if (difficult === 100) { F_crazy(); statustext.innerHTML = "Support Status: F大調-D小調 根音Only"; }
          WebMidi.disable();
        }




      }
    );

  });

}
function doubleClicked() {
  if (show === 1) {
    for (i = 0; i < 12; i++) {
      if (i == highlighted()) {
        if (i === 0) {  //C
          reset();
          keynum = 0;
          if (difficult === 0) { C_normal(); statustext.innerHTML = "Support Status: C大調-Ａ小調 全顯示"; }
          if (difficult === 5) { C_med(); statustext.innerHTML = "Support Status: C大調-Ａ小調 顯示較少"; }
          if (difficult === 10) { C_hard(); statustext.innerHTML = "Support Status: C大調-Ａ小調 顯示 1 & 5"; }
          if (difficult === 100) { C_crazy(); statustext.innerHTML = "Support Status: C大調-Ａ小調 根音Only"; }
        }
        if (i === 1) {  //G
          reset();
          keynum = 1;
          if (difficult === 0) { G_normal(); statustext.innerHTML = "Support Status: G大調-E小調 全顯示"; }
          if (difficult === 5) { G_med(); statustext.innerHTML = "Support Status: G大調-E小調 顯示較少"; }
          if (difficult === 10) { G_hard(); statustext.innerHTML = "Support Status: G大調-E小調 顯示 1 & 5"; }
          if (difficult === 100) { G_crazy(); statustext.innerHTML = "Support Status: G大調-E小調 根音Only"; }
        }
        if (i === 2) {  //D
          reset();
          keynum = 2;
          if (difficult === 0) { D_normal(); statustext.innerHTML = "Support Status: D大調-B小調 全顯示"; }
          if (difficult === 5) { D_med(); statustext.innerHTML = "Support Status: D大調-B小調 顯示較少"; }
          if (difficult === 10) { D_hard(); statustext.innerHTML = "Support Status: D大調-B小調 顯示 1 & 5"; }
          if (difficult === 100) { D_crazy(); statustext.innerHTML = "Support Status: D大調-B小調 根音Only"; }
        }
        if (i === 3) {  //A
          reset();
          keynum = 3;
          if (difficult === 0) { A_normal(); statustext.innerHTML = "Support Status: A大調-F#小調 全顯示"; }
          if (difficult === 5) { A_med(); statustext.innerHTML = "Support Status: A大調-F#小調 顯示較少"; }
          if (difficult === 10) { A_hard(); statustext.innerHTML = "Support Status: A大調-F#小調 顯示 1 & 5"; }
          if (difficult === 100) { A_crazy(); statustext.innerHTML = "Support Status: A大調-F#小調 根音Only"; }
        }
        if (i === 4) {  //E
          reset();
          keynum = 4;
          if (difficult === 0) { E_normal(); statustext.innerHTML = "Support Status: E大調-C#小調 全顯示"; }
          if (difficult === 5) { E_med(); statustext.innerHTML = "Support Status: E大調-C#小調 顯示較少"; }
          if (difficult === 10) { E_hard(); statustext.innerHTML = "Support Status: E大調-C#小調 顯示 1 & 5"; }
          if (difficult === 100) { E_crazy(); statustext.innerHTML = "Support Status: E大調-C#小調 根音Only"; }
        }
        if (i === 5) {  // Cb/B
          reset();
          keynum = 5;
          if (difficult === 0) { B_normal(); statustext.innerHTML = "Support Status: Cb/B大調-Ab/G#小調 全顯示"; }
          if (difficult === 5) { B_med(); statustext.innerHTML = "Support Status: Cb/B大調-Ab/G#小調 顯示較少"; }
          if (difficult === 10) { B_hard(); statustext.innerHTML = "Support Status: Cb/B大調-Ab/G#小調 顯示 1 & 5"; }
          if (difficult === 100) { B_crazy(); statustext.innerHTML = "Support Status: Cb/B大調-Ab/G#小調 根音Only"; }
        }
        if (i === 6) {  // Gb/F#
          reset();
          keynum = 6;
          if (difficult === 0) { Gb_normal(); statustext.innerHTML = "Support Status: Gb/F#大調-Eb/D#小調 全顯示"; }
          if (difficult === 5) { Gb_med(); statustext.innerHTML = "Support Status: Gb/F#大調-Eb/D#小調 顯示較少"; }
          if (difficult === 10) { Gb_hard(); statustext.innerHTML = "Support Status: Gb/F#大調-Eb/D#小調 顯示 1 & 5"; }
          if (difficult === 100) { Gb_crazy(); statustext.innerHTML = "Support Status: Gb/F#大調-Eb/D#小調 根音Only"; }
        }
        if (i === 7) {  // Db/C#
          reset();
          keynum = 7;
          if (difficult === 0) { Db_normal(); statustext.innerHTML = "Support Status: Db/C#大調-Bb/A#小調 全顯示"; }
          if (difficult === 5) { Db_med(); statustext.innerHTML = "Support Status: Db/C#大調-Bb/A#小調 顯示較少"; }
          if (difficult === 10) { Db_hard(); statustext.innerHTML = "Support Status: Db/C#大調-Bb/A#小調 顯示 1 & 5"; }
          if (difficult === 100) { Db_crazy(); statustext.innerHTML = "Support Status: Db/C#大調-Bb/A#小調 根音Only"; }
        }
        if (i === 8) {  //Ab
          reset();
          keynum = 8;
          if (difficult === 0) { Ab_normal(); statustext.innerHTML = "Support Status: Ab大調-F小調 全顯示"; }
          if (difficult === 5) { Ab_med(); statustext.innerHTML = "Support Status: Ab大調-F小調 顯示較少"; }
          if (difficult === 10) { Ab_hard(); statustext.innerHTML = "Support Status: Ab大調-F小調 顯示 1 & 5"; }
          if (difficult === 100) { Ab_crazy(); statustext.innerHTML = "Support Status: Ab大調-F小調 根音Only"; }
        }
        if (i === 9) {  //Eb
          reset();
          keynum = 9;
          if (difficult === 0) { Eb_normal(); statustext.innerHTML = "Support Status: Eb大調-C小調 全顯示"; }
          if (difficult === 5) { Eb_med(); statustext.innerHTML = "Support Status: Eb大調-C小調 顯示較少"; }
          if (difficult === 10) { Eb_hard(); statustext.innerHTML = "Support Status: Eb大調-C小調 顯示 1 & 5"; }
          if (difficult === 100) { Eb_crazy(); statustext.innerHTML = "Support Status: Eb大調-C小調 根音Only"; }
        }
        if (i === 10) { //Bb
          reset();
          keynum = 10;
          if (difficult === 0) { Bb_normal(); statustext.innerHTML = "Support Status: Bb大調-G小調 全顯示"; }
          if (difficult === 5) { Bb_med(); statustext.innerHTML = "Support Status: Bb大調-G小調 顯示較少"; }
          if (difficult === 10) { Bb_hard(); statustext.innerHTML = "Support Status: Bb大調-G小調 顯示 1 & 5"; }
          if (difficult === 100) { Bb_crazy(); statustext.innerHTML = "Support Status: Bb大調-G小調 根音Only"; }
        }
        if (i === 11) { //F key
          reset();
          keynum = 11;
          if (difficult === 0) { F_normal(); statustext.innerHTML = "Support Status: F大調-D小調 全顯示"; }
          if (difficult === 5) { F_med(); statustext.innerHTML = "Support Status: F大調-D小調 顯示較少"; }
          if (difficult === 10) { F_hard(); statustext.innerHTML = "Support Status: F大調-D小調 顯示 1 & 5"; }
          if (difficult === 100) { F_crazy(); statustext.innerHTML = "Support Status: F大調-D小調 根音Only"; }
        }
      }
    }
  }
}

function drawOuter(ang) {
  stroke(outCSP);
  strokeWeight(width / 600);
  for (i = 0; i < 12; i++) {
    fill((i % 2 == 0) ? outC1 : outC2);
    //print("i=", i, "h=", highlighted());
    if (i == highlighted()) {   // 判斷位置
      fill(outCH);
    }
    //-------------------------------------------------------------------------------
    let j = i + ang;
    arc(0, 0, width * outRatio, height * outRatio, TAU * (j / 12), TAU * ((j + 1) / 12) - 0.000001, PIE);
  }
  stroke(20);
  noFill();
  ellipse(0, 0, width * outRatio);
}

function drawOuterText(ang) {
  for (i = 0; i < 12; i++) {
    let j = i + ang + 3.5; // 把第一個字畫到右方
    push();
    rotate(TAU * (j / 12));
    textAlign(CENTER);
    textSize(outTextSize);
    noStroke();
    fill(outCT);
    text(outText[i], 0, -(height * outRatio / 2 * 0.945));
    pop();
  }

}

function drawMajor(ang) {
  stroke(90);
  for (i = 0; i < 12; i++) {
    fill((i % 2 == 0) ? majorC1 : majorC2);
    let j = i + ang;
    arc(0, 0, width * majorRatio, height * majorRatio, TAU * (j / 12), TAU * ((j + 1) / 12) - 0.000001);
  }
}

function drawMajorText(ang) {
  for (i = 0; i < 12; i++) {
    let j = i + ang + 3.5;
    push();
    rotate(TAU * (j / 12));
    textAlign(CENTER);
    textSize(majorTextSize);
    noStroke();
    fill(majorCT);
    text(majorText[i], 0, -(height * majorRatio / 2 * 0.91));
    pop();
  }

}

function drawMinor(ang) {
  noStroke();
  for (i = 0; i < 12; i++) {
    fill((i % 2 == 0) ? minorC1 : minorC2);
    let j = i + ang;
    arc(0, 0, width * minorRatio, height * minorRatio, TAU * (j / 12), TAU * ((j + 1) / 12) - 0.000001);
  }
}

function drawMinorText(ang) {
  for (i = 0; i < 12; i++) {
    let j = i + ang + 3.5;
    push();
    rotate(TAU * (j / 12));
    textAlign(CENTER);
    textSize(minorTextSize);
    noStroke();
    fill(minorCT);
    text(minorText[i], 0, -(height * minorRatio / 2 * 0.91));
    pop();
  }
}

function drawCore(ang) {
  switch (coreType) {
    case "Empty":
      drawCoreEmpty(ang);
      break;
    case "Black":
      drawCoreBlack(ang);
      break;
    case "Detail":
      drawCoreDetail(ang);
      break;
    default:
      drawCoreEmpty(ang);
  }
}

function drawCoreDetail(ang) {
  fill(100);
  stroke(40);
  ellipse(0, 0, width * coreRatio);
  fill(20);
  noStroke();
  textAlign(CENTER);
  textSize(detailTextSize);
  text(detailText1[highlighted()], 0, height * 0.08);

  imageMode(CENTER);
  image(imgStaff, 0, height * -0.03, width / 2, height * 0.15);
  let sig = highlighted();
  sig = (sig > 6) ? sig - 12 : sig;

  //


  // dbText = sig;
  switch (sig) {
    case 5:
      stroke(0);
      strokeWeight(width / 400);
      line(width * -0.008, height * -0.066, width * -0.008, height * 0.009);
      strokeWeight(width / 800);
      drawKeySig(5, 0.02, 1);
      drawKeySig(-7, -0.16, 1);
      drawSigNumber(5, -7);
      break;
    case 6:
      stroke(0);
      strokeWeight(width / 400);
      line(width * -0.008, height * -0.066, width * -0.008, height * 0.009);
      strokeWeight(width / 800);
      drawKeySig(6, 0.02, 1);
      drawKeySig(-6, -0.16, 1);
      drawSigNumber(6, -6);
      break;
    case -5:
      stroke(0);
      strokeWeight(width / 400);
      line(width * -0.008, height * -0.066, width * -0.008, height * 0.009);
      strokeWeight(width / 800);
      drawKeySig(7, 0.02, 1);
      drawKeySig(-5, -0.16, 1);
      drawSigNumber(7, -5);
      break;
    default:
      drawKeySig(sig, -0.16, 1);
      drawSigNumber((sig > 0) ? sig : 0, (sig < 0) ? sig : 0);
  }


}

function drawSigNumber(s, f) {
  // draw center one
  noStroke();
  fill(80);
  let acci = [
    "Fb", "Cb", "Gb", "Db", "Ab", "Eb", "Bb", "",
    "F#", "C#", "G#", "D#", "A#", "E#", "B#"
  ]
  let sp = 0.024; // space
  let w = 0.02; // width
  let h = 0.004; // height
  rectMode(CENTER);
  textAlign(CENTER);
  for (i = -7; i < 8; i++) {
    switch (true) {
      case (i < 0): // flat
        fill(20, (i < f) ? 20 : 100, (i < f) ? 90 : 70);
        break;
      case (i > 0): // sharp
        fill(100, (i > s) ? 20 : 90, (i < s) ? 90 : 80);
        break;
      default:
        fill(80);
        textSize(width / 60);
        text("♮", 0, height * 0.14);
        fill(60);
    }
    rect((0 + sp * i) * width, height * 0.12, height * w, height * h);
    textSize(width / 74);
    text(acci[i + 7], (0 + sp * i) * width, height * 0.138);
  }
  textSize(width / 60);
  fill(90);
  text(`（${-f} 個降記號 / ${s} 個升記號）`, 0, height * 0.16);
}

function drawKeySig(sig, x, y) {
  let sx = x;
  let sp = 0.02;
  if (sig > 0) {
    imageMode(CENTER);
    let sy = [-0.066, -0.039, -0.077, -0.0475, -0.017, -0.0575, -0.02875];
    for (i = 0; i < sig; i++) {
      image(imgSharp, width * (sx + (i * sp)), height * sy[i], width / 16, height / 16);
    }
  }
  if (sig < 0) {
    imageMode(CENTER);
    let sy = [-0.0289, -0.059, -0.021, -0.049, -0.012, -0.04, -0.002];
    for (i = 0; i < abs(sig); i++) {
      image(imgFlat, width * (sx + (i * sp)), height * sy[i], width / 16, height / 16);
    }
  }
}

function drawCoreEmpty(ang) {
  fill(100);
  stroke(40);
  ellipse(0, 0, width * coreRatio);
}

function drawCoreBlack(ang) {
  fill(0);
  stroke(40);
  ellipse(0, 0, width * coreRatio);
}

function debugText() {
  fill(0);
  noStroke();
  textAlign(CENTER);
  text(dbText, 0, height * 0.45);
}

function mouseAngle(ang) {
  let v = createVector(mouseX - width / 2, mouseY - height / 2);
  let h = v.heading(); // -PI ~ PI
  let i = map(h, -PI, PI, 6, 18);
  mouseDir = (i > 12) ? i - 12 : i;
  //console.log(mouseDir);

}

function rotateGlobal() {
  acc = (mouseX - width / 2) / width;
  if (abs(acc) > 0.4) {
    vel += acc / 70;
    vel = constrain(vel, -0.1, 0.1);
  }

  if (locked) {
    vel = 0; // friction
  } else {
    vel *= 0.9
  }
  angle += vel;
}


function keyTyped() {
  if (key === 'z') {
    var s = createSprite(-800, -750);
    s.addAnimation('normal', './pic/1mid.png', './pic/1right.png', './pic/1mid.png', './pic/1left.png');
    var s2 = createSprite(-400, -750);
    var s3 = createSprite(0, -750);
    var s4 = createSprite(400, -750);
    //if no image or animation is associated it will be a rectancle of the specified size
    //and a random color
    s.addAnimation('normal', './pic/1mid.png', './pic/1right.png', './pic/1mid.png', './pic/1left.png');
    s2.addAnimation('normal', './pic/2mid.png', './pic/2right.png', './pic/2mid.png', './pic/2left.png');
    s3.addAnimation('normal', './pic/3mid.png', './pic/3right.png', './pic/3mid.png', './pic/3left.png');
    s4.addAnimation('normal', './pic/4mid.png', './pic/4right.png', './pic/4mid.png', './pic/4left.png');
  }
}

function draw() {
  background(90);
  translate(width / 2, height / 2);
  mouseAngle(angle);
  rotateGlobal();
  highlighted();
  drawOuter(angle);
  drawOuterText(angle);
  drawMajor(angle);
  drawMajorText(angle);
  drawMinor(angle);
  drawMinorText(angle);
  drawCore(angle);


  debugText();
  if (!circle) {  // 隱藏五度圈後
    clear();
    background(90);
    ///animation(ghost, 0, 0);
    ///animation(asterisk, 100, 0);

    /*if (keyDown('z')) {


      //create a sprite at the mouse position and store it in a temporary variable
      var s = createSprite(-800, -750);
      //var s2 = createSprite(-400, -750);
      //var s3 = createSprite(0, -750);
      //var s4 = createSprite(400, -750);
      //if no image or animation is associated it will be a rectancle of the specified size
      //and a random color
      s.addAnimation('normal', './pic/1mid.png', './pic/1right.png', './pic/1mid.png', './pic/1left.png');
      //s2.addAnimation('normal', './pic/2mid.png', './pic/2right.png', './pic/2mid.png', './pic/2left.png');
      //s3.addAnimation('normal', './pic/3mid.png', './pic/3right.png', './pic/3mid.png', './pic/3left.png');
      //s4.addAnimation('normal', './pic/4mid.png', './pic/4right.png', './pic/4mid.png', './pic/4left.png');

    }*/


    //now you can use the variable to set properties
    //e.g. a random velocity on the x and y coordinates
    scale(0.5);
    //s.velocity.x = random(-5, 5);
    ///s.velocity.y = random(-5, 5);

    //if (s.position.y > height / 2)
    //  s.remove();///////
  }
  else {
    //clear();
    //background(90);
  }

  drawSprites();
}
//if (disableP5Webmidi === true) {
//  WebMidi.disable();
//}
if (!circle) {  // 隱藏五度圈後


}

//function mousePressed() {
//}

//----------------------------------------------------------------------
var el = document.querySelector(`[data-number="${60}"]`);

function reset() {
  for (let i = 21; i < 109; i++) {
    el = document.querySelector(`[data-number="${i}"]`);
    el.innerHTML = "";
  }
}

function Show_Hidden1(obj) {
  if (obj.innerHTML == "1") { obj.innerHTML = ""; }
  else { obj.innerHTML = "1"; }
}
function Show_Hidden2(obj) {
  if (obj.innerHTML == "2") { obj.innerHTML = ""; }
  else { obj.innerHTML = "2"; }
}
function Show_Hidden3(obj) {
  if (obj.innerHTML == "3") { obj.innerHTML = ""; }
  else { obj.innerHTML = "3"; }
}
function Show_Hidden4(obj) {
  if (obj.innerHTML == "4") { obj.innerHTML = ""; }
  else { obj.innerHTML = "4"; }
}
function Show_Hidden5(obj) {
  if (obj.innerHTML == "5") { obj.innerHTML = ""; }
  else { obj.innerHTML = "5"; }
}
function Show_Hidden6(obj) {
  if (obj.innerHTML == "6") { obj.innerHTML = ""; }
  else { obj.innerHTML = "6"; }
}
function Show_Hidden7(obj) {
  if (obj.innerHTML == "7") { obj.innerHTML = ""; }
  else { obj.innerHTML = "7"; }
}
//------------------------------------------------------------------
function C_normal() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 >= 36 && i * 12 + 0 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 0 >= 36 && i * 12 + 0 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 2}"]`);
      Show_Hidden2(el);
    }
    if (i * 12 + 0 >= 36 && i * 12 + 0 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 0 >= 36 && i * 12 + 0 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 5}"]`);
      Show_Hidden4(el);
    }
    if (i * 12 + 0 >= 36 && i * 12 + 0 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7}"]`);
      Show_Hidden5(el);
    }
    if (i * 12 + 0 >= 36 && i * 12 + 0 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 9}"]`);
      Show_Hidden6(el);
    }
    if (i * 12 + 0 >= 36 && i * 12 + 0 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 11}"]`);
      Show_Hidden7(el);
    }
  }
}

function C_med() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 >= 36 && i * 12 + 0 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 0 >= 36 && i * 12 + 0 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 0 >= 36 && i * 12 + 0 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7}"]`);
      Show_Hidden5(el);
    }
  }
}

function C_hard() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 >= 36 && i * 12 + 0 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 0 >= 36 && i * 12 + 0 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7}"]`);
      Show_Hidden5(el);
    }
  }
}

function C_crazy() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 >= 36 && i * 12 + 0 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0}"]`);
      Show_Hidden1(el);
    }
  }
}

function G_normal() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 7 >= 36 && i * 12 + 0 + 7 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 7}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 0 + 7 >= 36 && i * 12 + 0 + 7 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 2 + 7}"]`);
      Show_Hidden2(el);
    }
    if (i * 12 + 0 + 7 >= 36 && i * 12 + 0 + 7 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 7}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 0 + 7 >= 36 && i * 12 + 0 + 7 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 5 + 7}"]`);
      Show_Hidden4(el);
    }
    if (i * 12 + 0 + 7 >= 36 && i * 12 + 0 + 7 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 7}"]`);
      Show_Hidden5(el);
    }
    if (i * 12 + 0 + 7 >= 36 && i * 12 + 0 + 7 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 9 + 7}"]`);
      Show_Hidden6(el);
    }
    if (i * 12 + 0 + 7 >= 36 && i * 12 + 0 + 7 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 11 + 7}"]`);
      Show_Hidden7(el);
    }
  }
}

function G_med() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 7 >= 36 && i * 12 + 0 + 7 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 7}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 0 + 7 >= 36 && i * 12 + 0 + 7 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 7}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 0 + 7 >= 36 && i * 12 + 0 + 7 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 7}"]`);
      Show_Hidden5(el);
    }
  }
}

function G_hard() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 7 >= 36 && i * 12 + 0 + 7 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 7}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 0 + 7 >= 36 && i * 12 + 0 + 7 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 7}"]`);
      Show_Hidden5(el);
    }
  }
}

function G_crazy() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 7 >= 36 && i * 12 + 0 + 7 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 7}"]`);
      Show_Hidden1(el);
    }
  }
}
function D_normal() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 2 >= 36 && i * 12 + 0 + 2 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 2}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 0 + 2 >= 36 && i * 12 + 0 + 2 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 2 + 2}"]`);
      Show_Hidden2(el);
    }
    if (i * 12 + 0 + 2 >= 36 && i * 12 + 0 + 2 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 2}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 0 + 2 >= 36 && i * 12 + 0 + 2 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 5 + 2}"]`);
      Show_Hidden4(el);
    }
    if (i * 12 + 0 + 2 >= 36 && i * 12 + 0 + 2 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 2}"]`);
      Show_Hidden5(el);
    }
    if (i * 12 + 0 + 2 >= 36 && i * 12 + 0 + 2 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 9 + 2}"]`);
      Show_Hidden6(el);
    }
    if (i * 12 + 0 + 2 >= 36 && i * 12 + 0 + 2 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 11 + 2}"]`);
      Show_Hidden7(el);
    }
  }
}

function D_med() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 2 >= 36 && i * 12 + 0 + 2 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 2}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 0 + 2 >= 36 && i * 12 + 0 + 2 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 2}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 0 + 2 >= 36 && i * 12 + 0 + 2 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 2}"]`);
      Show_Hidden5(el);
    }
  }

}

function D_hard() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 2 >= 36 && i * 12 + 0 + 2 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 2}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 0 + 2 >= 36 && i * 12 + 0 + 2 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 2}"]`);
      Show_Hidden5(el);
    }
  }

}

function D_crazy() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 2 >= 36 && i * 12 + 0 + 2 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 2}"]`);
      Show_Hidden1(el);
    }
  }

}

function A_normal() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 9 >= 36 && i * 12 + 0 + 9 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 9}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 0 + 9 >= 36 && i * 12 + 0 + 9 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 2 + 9}"]`);
      Show_Hidden2(el);
    }
    if (i * 12 + 0 + 9 >= 36 && i * 12 + 0 + 9 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 9}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 0 + 9 >= 36 && i * 12 + 0 + 9 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 5 + 9}"]`);
      Show_Hidden4(el);
    }
    if (i * 12 + 0 + 9 >= 36 && i * 12 + 0 + 9 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 9}"]`);
      Show_Hidden5(el);
    }
    if (i * 12 + 0 + 9 >= 36 && i * 12 + 0 + 9 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 9 + 9}"]`);
      Show_Hidden6(el);
    }
    if (i * 12 + 0 + 9 >= 36 && i * 12 + 0 + 9 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 11 + 9}"]`);
      Show_Hidden7(el);
    }
  }
}

function A_med() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 9 >= 36 && i * 12 + 0 + 9 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 9}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 0 + 9 >= 36 && i * 12 + 0 + 9 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 9}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 0 + 9 >= 36 && i * 12 + 0 + 9 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 9}"]`);
      Show_Hidden5(el);
    }
  }
}

function A_hard() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 9 >= 36 && i * 12 + 0 + 9 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 9}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 0 + 9 >= 36 && i * 12 + 0 + 9 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 9}"]`);
      Show_Hidden5(el);
    }
  }
}

function A_crazy() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 9 >= 36 && i * 12 + 0 + 9 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 9}"]`);
      Show_Hidden1(el);
    }
  }
}

function E_normal() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 4 >= 36 && i * 12 + 0 + 4 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 4}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 0 + 4 >= 36 && i * 12 + 0 + 4 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 2 + 4}"]`);
      Show_Hidden2(el);
    }
    if (i * 12 + 0 + 4 >= 36 && i * 12 + 0 + 4 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 4}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 0 + 4 >= 36 && i * 12 + 0 + 4 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 5 + 4}"]`);
      Show_Hidden4(el);
    }
    if (i * 12 + 0 + 4 >= 36 && i * 12 + 0 + 4 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 4}"]`);
      Show_Hidden5(el);
    }
    if (i * 12 + 0 + 4 >= 36 && i * 12 + 0 + 4 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 9 + 4}"]`);
      Show_Hidden6(el);
    }
    if (i * 12 + 0 + 4 >= 36 && i * 12 + 0 + 4 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 11 + 4}"]`);
      Show_Hidden7(el);
    }
  }
}

function E_med() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 4 >= 36 && i * 12 + 0 + 4 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 4}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 0 + 4 >= 36 && i * 12 + 0 + 4 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 4}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 0 + 4 >= 36 && i * 12 + 0 + 4 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 4}"]`);
      Show_Hidden5(el);
    }
  }
}

function E_hard() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 4 >= 36 && i * 12 + 0 + 4 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 4}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 0 + 4 >= 36 && i * 12 + 0 + 4 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 4}"]`);
      Show_Hidden5(el);
    }
  }
}

function E_crazy() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 4 >= 36 && i * 12 + 0 + 4 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 4}"]`);
      Show_Hidden1(el);
    }
  }
}

function B_normal() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 11 >= 36 && i * 12 + 0 + 11 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 11}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 2 + 11 >= 36 && i * 12 + 2 + 11 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 2 + 11}"]`);
      Show_Hidden2(el);
    }
    if (i * 12 + 4 + 11 >= 36 && i * 12 + 4 + 11 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 11}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 5 + 11 >= 36 && i * 12 + 5 + 11 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 5 + 11}"]`);
      Show_Hidden4(el);
    }
    if (i * 12 + 7 + 11 >= 36 && i * 12 + 7 + 11 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 11}"]`);
      Show_Hidden5(el);
    }
    if (i * 12 + 9 + 11 >= 36 && i * 12 + 9 + 11 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 9 + 11}"]`);
      Show_Hidden6(el);
    }
    if (i * 12 + 11 + 11 >= 36 && i * 12 + 11 + 11 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 11 + 11}"]`);
      Show_Hidden7(el);
    }
  }
}

function B_med() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 11 >= 36 && i * 12 + 0 + 11 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 11}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 4 + 11 >= 36 && i * 12 + 4 + 11 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 11}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 7 + 11 >= 36 && i * 12 + 7 + 11 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 11}"]`);
      Show_Hidden5(el);
    }
  }
}

function B_hard() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 11 >= 36 && i * 12 + 0 + 11 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 11}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 7 + 11 >= 36 && i * 12 + 7 + 11 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 11}"]`);
      Show_Hidden5(el);
    }
  }
}

function B_crazy() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 11 >= 36 && i * 12 + 0 + 11 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 11}"]`);
      Show_Hidden1(el);
    }
  }
}

function Gb_normal() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 6 >= 36 && i * 12 + 0 + 6 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 6}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 2 + 6 >= 36 && i * 12 + 2 + 6 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 2 + 6}"]`);
      Show_Hidden2(el);
    }
    if (i * 12 + 4 + 6 >= 36 && i * 12 + 4 + 6 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 6}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 5 + 6 >= 36 && i * 12 + 5 + 6 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 5 + 6}"]`);
      Show_Hidden4(el);
    }
    if (i * 12 + 7 + 6 >= 36 && i * 12 + 7 + 6 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 6}"]`);
      Show_Hidden5(el);
    }
    if (i * 12 + 9 + 6 >= 36 && i * 12 + 9 + 6 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 9 + 6}"]`);
      Show_Hidden6(el);
    }
    if (i * 12 + 11 + 6 >= 36 && i * 12 + 11 + 6 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 11 + 6}"]`);
      Show_Hidden7(el);
    }
  }
}
function Gb_med() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 6 >= 36 && i * 12 + 0 + 6 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 6}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 4 + 6 >= 36 && i * 12 + 4 + 6 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 6}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 7 + 6 >= 36 && i * 12 + 7 + 6 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 6}"]`);
      Show_Hidden5(el);
    }
  }
}
function Gb_hard() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 6 >= 36 && i * 12 + 0 + 6 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 6}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 7 + 6 >= 36 && i * 12 + 7 + 6 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 6}"]`);
      Show_Hidden5(el);
    }
  }
}
function Gb_crazy() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 6 >= 36 && i * 12 + 0 + 6 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 6}"]`);
      Show_Hidden1(el);
    }
  }
}

function Db_normal() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 1 >= 36 && i * 12 + 0 + 1 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 1}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 2 + 1 >= 36 && i * 12 + 2 + 1 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 2 + 1}"]`);
      Show_Hidden2(el);
    }
    if (i * 12 + 4 + 1 >= 36 && i * 12 + 4 + 1 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 1}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 5 + 1 >= 36 && i * 12 + 5 + 1 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 5 + 1}"]`);
      Show_Hidden4(el);
    }
    if (i * 12 + 7 + 1 >= 36 && i * 12 + 7 + 1 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 1}"]`);
      Show_Hidden5(el);
    }
    if (i * 12 + 9 + 1 >= 36 && i * 12 + 9 + 1 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 9 + 1}"]`);
      Show_Hidden6(el);
    }
    if (i * 12 + 11 + 1 >= 36 && i * 12 + 11 + 1 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 11 + 1}"]`);
      Show_Hidden7(el);
    }
  }
}

function Db_med() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 1 >= 36 && i * 12 + 0 + 1 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 1}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 4 + 1 >= 36 && i * 12 + 4 + 1 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 1}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 7 + 1 >= 36 && i * 12 + 7 + 1 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 1}"]`);
      Show_Hidden5(el);
    }
  }
}

function Db_hard() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 1 >= 36 && i * 12 + 0 + 1 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 1}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 7 + 1 >= 36 && i * 12 + 7 + 1 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 1}"]`);
      Show_Hidden5(el);
    }
  }
}
function Db_crazy() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 1 >= 36 && i * 12 + 0 + 1 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 1}"]`);
      Show_Hidden1(el);
    }
  }
}
function Ab_normal() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 8 >= 36 && i * 12 + 0 + 8 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 8}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 2 + 8 >= 36 && i * 12 + 2 + 8 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 2 + 8}"]`);
      Show_Hidden2(el);
    }
    if (i * 12 + 4 + 8 >= 36 && i * 12 + 4 + 8 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 8}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 5 + 8 >= 36 && i * 12 + 5 + 8 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 5 + 8}"]`);
      Show_Hidden4(el);
    }
    if (i * 12 + 7 + 8 >= 36 && i * 12 + 7 + 8 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 8}"]`);
      Show_Hidden5(el);
    }
    if (i * 12 + 9 + 8 >= 36 && i * 12 + 9 + 8 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 9 + 8}"]`);
      Show_Hidden6(el);
    }
    if (i * 12 + 11 + 8 >= 36 && i * 12 + 11 + 8 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 11 + 8}"]`);
      Show_Hidden7(el);
    }
  }
}
function Ab_med() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 8 >= 36 && i * 12 + 0 + 8 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 8}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 4 + 8 >= 36 && i * 12 + 4 + 8 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 8}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 7 + 8 >= 36 && i * 12 + 7 + 8 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 8}"]`);
      Show_Hidden5(el);
    }
  }
}

function Ab_hard() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 8 >= 36 && i * 12 + 0 + 8 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 8}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 7 + 8 >= 36 && i * 12 + 7 + 8 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 8}"]`);
      Show_Hidden5(el);
    }
  }
}

function Ab_crazy() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 8 >= 36 && i * 12 + 0 + 8 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 8}"]`);
      Show_Hidden1(el);
    }
  }
}

function Eb_normal() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 3 >= 36 && i * 12 + 0 + 3 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 3}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 2 + 3 >= 36 && i * 12 + 2 + 3 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 2 + 3}"]`);
      Show_Hidden2(el);
    }
    if (i * 12 + 4 + 3 >= 36 && i * 12 + 4 + 3 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 3}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 5 + 3 >= 36 && i * 12 + 5 + 3 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 5 + 3}"]`);
      Show_Hidden4(el);
    }
    if (i * 12 + 7 + 3 >= 36 && i * 12 + 7 + 3 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 3}"]`);
      Show_Hidden5(el);
    }
    if (i * 12 + 9 + 3 >= 36 && i * 12 + 9 + 3 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 9 + 3}"]`);
      Show_Hidden6(el);
    }
    if (i * 12 + 11 + 3 >= 36 && i * 12 + 11 + 3 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 11 + 3}"]`);
      Show_Hidden7(el);
    }
  }
}
function Eb_med() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 3 >= 36 && i * 12 + 0 + 3 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 3}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 4 + 3 >= 36 && i * 12 + 4 + 3 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 3}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 7 + 3 >= 36 && i * 12 + 7 + 3 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 3}"]`);
      Show_Hidden5(el);
    }
  }
}
function Eb_hard() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 3 >= 36 && i * 12 + 0 + 3 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 3}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 7 + 3 >= 36 && i * 12 + 7 + 3 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 3}"]`);
      Show_Hidden5(el);
    }
  }
}
function Eb_crazy() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 3 >= 36 && i * 12 + 0 + 3 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 3}"]`);
      Show_Hidden1(el);
    }
  }
}

function Bb_normal() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 10 >= 36 && i * 12 + 0 + 10 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 10}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 2 + 10 >= 36 && i * 12 + 2 + 10 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 2 + 10}"]`);
      Show_Hidden2(el);
    }
    if (i * 12 + 4 + 10 >= 36 && i * 12 + 4 + 10 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 10}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 5 + 10 >= 36 && i * 12 + 5 + 10 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 5 + 10}"]`);
      Show_Hidden4(el);
    }
    if (i * 12 + 7 + 10 >= 36 && i * 12 + 7 + 10 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 10}"]`);
      Show_Hidden5(el);
    }
    if (i * 12 + 9 + 10 >= 36 && i * 12 + 9 + 10 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 9 + 10}"]`);
      Show_Hidden6(el);
    }
    if (i * 12 + 11 + 10 >= 36 && i * 12 + 11 + 10 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 11 + 10}"]`);
      Show_Hidden7(el);
    }
  }
}

function Bb_med() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 10 >= 36 && i * 12 + 0 + 10 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 10}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 4 + 10 >= 36 && i * 12 + 4 + 10 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 10}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 7 + 10 >= 36 && i * 12 + 7 + 10 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 10}"]`);
      Show_Hidden5(el);
    }
  }
}
function Bb_hard() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 10 >= 36 && i * 12 + 0 + 10 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 10}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 7 + 10 >= 36 && i * 12 + 7 + 10 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 10}"]`);
      Show_Hidden5(el);
    }
  }
}
function Bb_crazy() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 10 >= 36 && i * 12 + 0 + 10 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 10}"]`);
      Show_Hidden1(el);
    }
  }
}

function F_normal() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 5 >= 36 && i * 12 + 0 + 5 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 5}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 2 + 5 >= 36 && i * 12 + 2 + 5 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 2 + 5}"]`);
      Show_Hidden2(el);
    }
    if (i * 12 + 4 + 5 >= 36 && i * 12 + 4 + 5 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 5}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 5 + 5 >= 36 && i * 12 + 5 + 5 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 5 + 5}"]`);
      Show_Hidden4(el);
    }
    if (i * 12 + 7 + 5 >= 36 && i * 12 + 7 + 5 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 5}"]`);
      Show_Hidden5(el);
    }
    if (i * 12 + 9 + 5 >= 36 && i * 12 + 9 + 5 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 9 + 5}"]`);
      Show_Hidden6(el);
    }
    if (i * 12 + 11 + 5 >= 36 && i * 12 + 11 + 5 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 11 + 5}"]`);
      Show_Hidden7(el);
    }
  }
}

function F_med() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 5 >= 36 && i * 12 + 0 + 5 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 5}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 4 + 5 >= 36 && i * 12 + 4 + 5 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 5}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 7 + 5 >= 36 && i * 12 + 7 + 5 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 5}"]`);
      Show_Hidden5(el);
    }
  }
}

function F_hard() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 5 >= 36 && i * 12 + 0 + 5 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 5}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 7 + 5 >= 36 && i * 12 + 7 + 5 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 5}"]`);
      Show_Hidden5(el);
    }
  }
}

function F_crazy() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 5 >= 36 && i * 12 + 0 + 5 < 83) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 5}"]`);
      Show_Hidden1(el);
    }
  }
}
//----------------------------------------------------------------------------

//var scripts = document.getElementsByTagName('script');
//var currentScript = scripts[scripts.length - 1];
//var data = currentScript.getAttribute('difficulty');
//console.log(ooxx);
