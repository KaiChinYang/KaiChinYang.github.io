/*
// load a midi file in the browser
const midi = Midi.fromUrl("./star4.mid");
//the file name decoded from the first track
const name = midi.name;
//get the tracks
midi.tracks.forEach(track => {
  //tracks have notes and controlChanges

  //notes are an array
  const notes = track.notes;
  notes.forEach(note => {
    //note.midi, note.time, note.duration, note.name
  });

  //the control changes are an object
  //the keys are the CC number
  track.controlChanges[64];
  //they are also aliased to the CC number's common name (if it has one)
  track.controlChanges.sustain.forEach(cc => {
    // cc.ticks, cc.value, cc.time
  });

  //the track also has a channel and instrument
  //track.instrument.name
});

*/
/*
WebMidi.enable(function (err) {

  if (err) {
    console.log("WebMidi could not be enabled.", err);
  } else {
    console.log("WebMidi enabled!");
    //console.log(WebMidi.inputs);
    //console.log(WebMidi.outputs);
  }

});
*/
//webmidi start


