// layout for a set of keys, first is position, second is black (true) or white (false)
//移調鋼琴教室

let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let octaves = ["0", "1", "2", "3", "4", "5", "6", "7"];

//const synth = new Tone.Synth().toDestination();
const now = Tone.now()
let newNoteOctave;
let KeyboardNote;
let KeyboardOctave;

/*
var piano = SampleLibrary.load({
  instruments: "violin"
}); */

//piano.release = .5;
//piano.toMaster();

//load samples
var samples = SampleLibrary.load({
  instruments: ['piano', 'bass-electric', 'bassoon', 'cello', 'clarinet', 'contrabass', 'flute', 'french-horn', 'guitar-acoustic', 'guitar-electric', 'guitar-nylon', 'harmonium', 'harp', 'organ', 'saxophone', 'trombone', 'trumpet', 'tuba', 'violin', 'xylophone'],
  baseUrl: "./samples/"
})

window.onload = function () {
  for (var property in samples) {
    if (samples.hasOwnProperty(property)) {
      console.log(samples[property])
      //samples[property].release = .5;
      samples[property].toMaster();
    }
  }
}
//

var current;
current = samples['piano'];


var sampleselect = document.getElementById("SampleSelect");
sampleselect.onchange = function () {
  console.log(sampleselect.value);
  current = samples[sampleselect.value];
  //current.release = .5;
  //current.toMaster();
}
//current.release = .5;
//current.toMaster();

/*
Tone.Buffer.on('load', function () {
  // loop through instruments and set release, connect to master output
  for (var property in samples) {
    if (samples.hasOwnProperty(property)) {
      console.log(samples[property])
      samples[property].release = .5;
      samples[property].toMaster();
    }
  }
  current = samples['piano'];
})

Tone.Buffer.on('error', function () {
  document.querySelector("#loading").innerHTML = "I'm sorry, there has been an error loading the samples. This demo works best on on the most up-to-date version of Chrome.";
})*/


//Audio start
var zzz = document.getElementById("sound");
zzz.onclick = function () {
  Tone.start();
  alert("Audio ready");

  ///MIDIjs.play('./star4.mid');
  //MIDIjs.message_callback = display_message;
  console.log(MIDIjs.get_audio_status());

}


const layout = [
  [0, false],
  [0, true],
  [1, false],
  [1, true],
  [2, false],
  [3, false],
  [3, true],
  [4, false],
  [4, true],
  [5, false],
  [5, true],
  [6, false],
];
var difficulty = 0;
var test = 123;

function onMessage(event) {
  const [channel, number, value] = event.data;
  newNoteOctave = "";
  KeyboardNote = notes[number % 12];
  KeyboardOctave = parseInt(number / 12) - 1;
  //var Octave = KeyboardOctave.toString;
  newNoteOctave = KeyboardNote + KeyboardOctave.toString();
  //alert(newNoteOctave);

  var tmpel = document.querySelector(`[data-number="${number}"]`);
  var el2 = document.querySelectorAll(`[data-number="${number + 2}"]`);
  var el3 = document.querySelectorAll(`[data-number="${number + 4}"]`);
  var el4 = document.querySelectorAll(`[data-number="${number + 5}"]`);
  var el5 = document.querySelectorAll(`[data-number="${number + 7}"]`);
  var el6 = document.querySelectorAll(`[data-number="${number + 9}"]`);
  var el7 = document.querySelectorAll(`[data-number="${number + 11}"]`);
  console.log("channel", channel, "number", number, "value", value);


  // reference https://github.com/mikaeljorhult/midi-events/blob/master/src/main.js
  if (channel < 144 || value === 0) {
    // note off
    if (number >= 48 && number < 84) {
      tmpel.classList.remove("pressed");
    }
    //tmpel.style.display = "inline-block";
    //synth.triggerRelease(newNoteOctave, "4n", now);
    current.triggerRelease(newNoteOctave);
    //
    if (event.target.name === "A-Series Keyboard Keyboard" || value === 0) {
      //如果是midi out(playback) 力度大小(value)=0 而且會沒有midi off
    }
  } else if (channel < 160) {
    // note on
    //tmpel.style.display = "none";
    if (number >= 48 && number < 84) {
      tmpel.classList.add("pressed");
    }

    //synth.triggerAttack(newNoteOctave, "8n", now)
    //current.volume.value = value / 127 * 10; //fail
    current.triggerAttack(newNoteOctave, current.currentTime, value / 127); //note,time,velocity


  }

}

function renderPiano(el) {
  let whiteKeys = [];
  let blackKeys = [];

  // 21 - 108 is standard piano key range
  for (let i = 48; i < 84; i++) { //but I only show 48~84
    const index = i % 12;
    const pos = layout[index];
    if (pos[1]) {
      blackKeys.push(`<div data-number="${i}"></div>`);
    } else {
      whiteKeys.push(`<div data-number="${i}"></div>`);
    }
  }
  el.innerHTML +=
    `<div class="black-keys">${blackKeys.join("")}</div>` +
    `<div class="white-keys">${whiteKeys.join("")}</div>`;

  //var colorDiv = document.querySelector(`[data-number="${61}"]`);
  //colorDiv.style.background += 'black';
}

// list event from midi inputs, index -1 is listening all inputs
function listenEvent(inputs, index = -1) {
  // index = -1 means listen all midi inputs
  inputs.forEach((input, i) => {
    if (i === index || index < 0) {
      input.onmidimessage = onMessage;
    } else {
      input.onmidimessage = null;
    }
  });
}

function renderSettings(el, inputs) {
  const id = "input-select";
  const options = [];
  options.push('<option value="-1">Listen all MIDI inputs</option>');
  inputs.forEach((input, index) => {
    options.push(
      `<option value="${index}">${input.id} - ${input.manufacturer}</option>`
    );
  });
  el.innerHTML = `<select id="${id}">${options.join("")}</select>`;

  const select = document.getElementById(id);
  select.style.display = "none";
  select.addEventListener("change", (event) => {
    const index = Number.parseInt(event.target.value);
    listenEvent(inputs, index);
  });
}

//------------------------------------------------------
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

function reset() {
  for (let i = 48; i < 84; i++) {
    el = document.querySelector(`[data-number="${i}"]`);
    el.innerHTML = "";
  }
}
/*
window.onload = function () {
  var button1 = document.getElementById("bu1");
  var pic1 = document.getElementById("pic");
  button1.onclick = function () {
    Show_Hidden(pic1);
    return false;
  }
}*/
//------------------------main-------------------------------------------
async function main() {
  const piano = document.getElementById("piano");
  const settings = document.getElementById("settings");

  try {
    const access = await navigator.requestMIDIAccess();
    const inputs = [...access.inputs.values()];
    listenEvent(inputs);
    renderPiano(piano);
    renderSettings(settings, inputs);
    //set backgroundcolor
    //for (let i = 48; i <= 59; i++) {

    //colorDiv.classList.add("support");
    //colorDiv.innerHTML = "kk";
    //}
  } catch (e) {
    alert(e);
  }
  //--------------------------------------------------------------------------

  var el = document.querySelector(`[data-number="${60}"]`);
  //el.innerHTML = "1";
  //el.classList.add("support");

  var buttonReset = document.getElementById("reset");
  //var buttonShowcanvas = document.getElementById("showcanvas");
  var buttonEasy = document.getElementById("easy");
  var buttonMedium = document.getElementById("medium");
  var buttonHard = document.getElementById("hard");
  var buttonCrazy = document.getElementById("crazy");
  var buttonC = document.getElementById("Ckey");
  var buttonG = document.getElementById("Gkey");
  var buttonD = document.getElementById("Dkey");
  var buttonA = document.getElementById("Akey");
  var buttonE = document.getElementById("Ekey");
  var buttonCb = document.getElementById("Cbkey");
  var buttonGb = document.getElementById("Gbkey");
  var buttonDb = document.getElementById("Dbkey");
  var buttonAb = document.getElementById("Abkey");
  var buttonEb = document.getElementById("Ebkey");
  var buttonBb = document.getElementById("Bbkey");
  var buttonF = document.getElementById("Fkey");
  //var circlecanvas = document.getElementById("circleCanvas");

  //reset
  buttonReset.onclick = function () {
    keynum = -1;
    for (let i = 48; i < 84; i++) {
      el = document.querySelector(`[data-number="${i}"]`);
      el.innerHTML = "";
    }
    var statustext = document.getElementById("statusbar");
    statustext.innerHTML = "Support Status: ";



    return false;
  }
  // 


  /*
    buttonEasy.onclick = function () {
      difficulty = 0;
    }
    buttonMedium.onclick = function () {
      difficulty = 5;
    }
    buttonHard.onclick = function () {
      difficulty = 10;
    }
    buttonCrazy.onclick = function () {
      difficulty = 100;
    }
  */



}


main();



