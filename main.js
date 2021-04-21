// layout for a set of keys, first is position, second is black (true) or white (false)
//移調鋼琴教室

let notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let octaves = ["0", "1", "2", "3", "4", "5", "6", "7"];

const synth = new Tone.Synth().toDestination();
const now = Tone.now()
let newNoteOctave;
let KeyboardNote;
let KeyboardOctave;


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
    tmpel.classList.remove("pressed");


    //
    if (event.target.name === "A-Series Keyboard Keyboard" || value === 0) {
      //如果是midi out(playback) 力度大小(value)=0 而且會沒有midi off
    }
  } else if (channel < 160) {
    // note on
    tmpel.classList.add("pressed");
    synth.triggerAttackRelease(newNoteOctave, "8n");
    // synth.triggerAttack(newNoteOctave, "8n")


  }

}

function renderPiano(el) {
  let whiteKeys = [];
  let blackKeys = [];

  // 21 - 108 is standard piano key range
  for (let i = 21; i < 109; i++) {
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
  for (let i = 21; i < 109; i++) {
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
    for (let i = 21; i < 109; i++) {
      el = document.querySelector(`[data-number="${i}"]`);
      el.innerHTML = "";
    }
    var statustext = document.getElementById("statusbar");
    statustext.innerHTML = "Support Status: ";



    return false;
  }
  // 



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

  // C-key support
  buttonC.onclick = function () {
    reset();
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
    return false;
  }// G-key support
  buttonG.onclick = function () {
    reset();
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
    return false;
  }
  //D-key support
  buttonD.onclick = function () {
    reset();
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
    return false;
  }
  //A-key support
  buttonA.onclick = function () {
    reset();
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
    return false;
  }
  //E-key support
  buttonE.onclick = function () {
    reset();
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
    return false;
  }
  //Cb/B key support
  buttonCb.onclick = function () {
    reset();
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
    return false;
  }
  //Gb/F# key support
  buttonGb.onclick = function () {
    reset();
    for (let i = 0; i <= 10; i++) {
      if (i * 12 + 0 + 6 >= 21 && i * 12 + 0 + 6 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 0 + 6}"]`);
        Show_Hidden1(el);
      }
      if (i * 12 + 2 + 6 >= 21 && i * 12 + 2 + 6 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 2 + 6}"]`);
        Show_Hidden2(el);
      }
      if (i * 12 + 4 + 6 >= 21 && i * 12 + 4 + 6 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 4 + 6}"]`);
        Show_Hidden3(el);
      }
      if (i * 12 + 5 + 6 >= 21 && i * 12 + 5 + 6 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 5 + 6}"]`);
        Show_Hidden4(el);
      }
      if (i * 12 + 7 + 6 >= 21 && i * 12 + 7 + 6 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 7 + 6}"]`);
        Show_Hidden5(el);
      }
      if (i * 12 + 9 + 6 >= 21 && i * 12 + 9 + 6 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 9 + 6}"]`);
        Show_Hidden6(el);
      }
      if (i * 12 + 11 + 6 >= 21 && i * 12 + 11 + 6 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 11 + 6}"]`);
        Show_Hidden7(el);
      }
    }
    return false;
  }
  //Db/C# key support
  buttonDb.onclick = function () {
    reset();
    for (let i = 0; i <= 10; i++) {
      if (i * 12 + 0 + 1 >= 21 && i * 12 + 0 + 1 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 0 + 1}"]`);
        Show_Hidden1(el);
      }
      if (i * 12 + 2 + 1 >= 21 && i * 12 + 2 + 1 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 2 + 1}"]`);
        Show_Hidden2(el);
      }
      if (i * 12 + 4 + 1 >= 21 && i * 12 + 4 + 1 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 4 + 1}"]`);
        Show_Hidden3(el);
      }
      if (i * 12 + 5 + 1 >= 21 && i * 12 + 5 + 1 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 5 + 1}"]`);
        Show_Hidden4(el);
      }
      if (i * 12 + 7 + 1 >= 21 && i * 12 + 7 + 1 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 7 + 1}"]`);
        Show_Hidden5(el);
      }
      if (i * 12 + 9 + 1 >= 21 && i * 12 + 9 + 1 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 9 + 1}"]`);
        Show_Hidden6(el);
      }
      if (i * 12 + 11 + 1 >= 21 && i * 12 + 11 + 1 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 11 + 1}"]`);
        Show_Hidden7(el);
      }
    }
    return false;
  }
  //Ab key support
  buttonAb.onclick = function () {
    reset();
    for (let i = 0; i <= 10; i++) {
      if (i * 12 + 0 + 8 >= 21 && i * 12 + 0 + 8 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 0 + 8}"]`);
        Show_Hidden1(el);
      }
      if (i * 12 + 2 + 8 >= 21 && i * 12 + 2 + 8 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 2 + 8}"]`);
        Show_Hidden2(el);
      }
      if (i * 12 + 4 + 8 >= 21 && i * 12 + 4 + 8 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 4 + 8}"]`);
        Show_Hidden3(el);
      }
      if (i * 12 + 5 + 8 >= 21 && i * 12 + 5 + 8 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 5 + 8}"]`);
        Show_Hidden4(el);
      }
      if (i * 12 + 7 + 8 >= 21 && i * 12 + 7 + 8 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 7 + 8}"]`);
        Show_Hidden5(el);
      }
      if (i * 12 + 9 + 8 >= 21 && i * 12 + 9 + 8 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 9 + 8}"]`);
        Show_Hidden6(el);
      }
      if (i * 12 + 11 + 8 >= 21 && i * 12 + 11 + 8 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 11 + 8}"]`);
        Show_Hidden7(el);
      }
    }
    return false;
  }
  //Eb key support
  buttonEb.onclick = function () {
    reset();
    for (let i = 0; i <= 10; i++) {
      if (i * 12 + 0 + 3 >= 21 && i * 12 + 0 + 3 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 0 + 3}"]`);
        Show_Hidden1(el);
      }
      if (i * 12 + 2 + 3 >= 21 && i * 12 + 2 + 3 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 2 + 3}"]`);
        Show_Hidden2(el);
      }
      if (i * 12 + 4 + 3 >= 21 && i * 12 + 4 + 3 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 4 + 3}"]`);
        Show_Hidden3(el);
      }
      if (i * 12 + 5 + 3 >= 21 && i * 12 + 5 + 3 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 5 + 3}"]`);
        Show_Hidden4(el);
      }
      if (i * 12 + 7 + 3 >= 21 && i * 12 + 7 + 3 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 7 + 3}"]`);
        Show_Hidden5(el);
      }
      if (i * 12 + 9 + 3 >= 21 && i * 12 + 9 + 3 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 9 + 3}"]`);
        Show_Hidden6(el);
      }
      if (i * 12 + 11 + 3 >= 21 && i * 12 + 11 + 3 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 11 + 3}"]`);
        Show_Hidden7(el);
      }
    }
    return false;
  }
  //Bb key support
  buttonBb.onclick = function () {
    reset();
    for (let i = 0; i <= 10; i++) {
      if (i * 12 + 0 + 10 >= 21 && i * 12 + 0 + 10 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 0 + 10}"]`);
        Show_Hidden1(el);
      }
      if (i * 12 + 2 + 10 >= 21 && i * 12 + 2 + 10 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 2 + 10}"]`);
        Show_Hidden2(el);
      }
      if (i * 12 + 4 + 10 >= 21 && i * 12 + 4 + 10 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 4 + 10}"]`);
        Show_Hidden3(el);
      }
      if (i * 12 + 5 + 10 >= 21 && i * 12 + 5 + 10 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 5 + 10}"]`);
        Show_Hidden4(el);
      }
      if (i * 12 + 7 + 10 >= 21 && i * 12 + 7 + 10 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 7 + 10}"]`);
        Show_Hidden5(el);
      }
      if (i * 12 + 9 + 10 >= 21 && i * 12 + 9 + 10 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 9 + 10}"]`);
        Show_Hidden6(el);
      }
      if (i * 12 + 11 + 10 >= 21 && i * 12 + 11 + 10 < 109) {
        el = document.querySelector(`[data-number="${i * 12 + 11 + 10}"]`);
        Show_Hidden7(el);
      }
    }
    return false;
  }
  //F key support
  buttonF.onclick = function () {
    reset();
    if (difficulty === 0) {
      F_normal();
    }
    if (difficulty === 5) {
      F_mid();
    }
    if (difficulty === 10) {
      F_hard();
    }
    if (difficulty === 100) {
      F_crazy();
    }
    return false;
  }
}

function F_normal() {
  for (let i = 0; i <= 10; i++) {
    if (i * 12 + 0 + 5 >= 21 && i * 12 + 0 + 5 < 109) {
      el = document.querySelector(`[data-number="${i * 12 + 0 + 5}"]`);
      Show_Hidden1(el);
    }
    if (i * 12 + 2 + 5 >= 21 && i * 12 + 2 + 5 < 109) {
      el = document.querySelector(`[data-number="${i * 12 + 2 + 5}"]`);
      Show_Hidden2(el);
    }
    if (i * 12 + 4 + 5 >= 21 && i * 12 + 4 + 5 < 109) {
      el = document.querySelector(`[data-number="${i * 12 + 4 + 5}"]`);
      Show_Hidden3(el);
    }
    if (i * 12 + 5 + 5 >= 21 && i * 12 + 5 + 5 < 109) {
      el = document.querySelector(`[data-number="${i * 12 + 5 + 5}"]`);
      Show_Hidden4(el);
    }
    if (i * 12 + 7 + 5 >= 21 && i * 12 + 7 + 5 < 109) {
      el = document.querySelector(`[data-number="${i * 12 + 7 + 5}"]`);
      Show_Hidden5(el);
    }
    if (i * 12 + 9 + 5 >= 21 && i * 12 + 9 + 5 < 109) {
      el = document.querySelector(`[data-number="${i * 12 + 9 + 5}"]`);
      Show_Hidden6(el);
    }
    if (i * 12 + 11 + 5 >= 21 && i * 12 + 11 + 5 < 109) {
      el = document.querySelector(`[data-number="${i * 12 + 11 + 5}"]`);
      Show_Hidden7(el);
    }
  }
}

function F_mid() {
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



main();


