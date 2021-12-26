/* PianoVisual.js Library */
"use strict";

// sources for music sheet symbols in ./img:
// 	- treble clef: https://www.musicnotes.com/now/wp-content/uploads/treble-clef-1279909_960_720.png
// 	- bass clef: https://www.musicnotes.com/now/wp-content/uploads/Bass.png
// 	- sharp: https://cdn0.iconfinder.com/data/icons/music-notation/128/8-512.png
// 	- flat: https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flat.svg/472px-Flat.svg.png
// 	- whole note: https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/WholeNote.svg/1024px-WholeNote.svg.png
// 	- half note: https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Half_note_with_upwards_stem.svg/210px-Half_note_with_upwards_stem.svg.png
// 	- quarter note: https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Quarter_note_with_upwards_stem.svg/374px-Quarter_note_with_upwards_stem.svg.png
// mp3 files of piano notes were retrieved from https://github.com/fuhton/piano-mp3

(function(global, document) {

function Piano(containerId=null, canPlay=true) {
	this.keyboard = null
	this.annotations = false
	this.octaveRange = [0,0]
	this.note = null
	this.interval = null
	this.chord = null
	this.canPlay = canPlay
	this.containerId = containerId
}

function MusicSheet(containerId=null, canPlay=true) {
	this.sheet = null
	this.annotations = false
	this.note = null
	this.interval = null
	this.chord = null
	this.canPlay = canPlay
	this.containerId = containerId
}

Piano.prototype = {

	createKeyboard: function(startOctave, endOctave) {
		let container = document.querySelector('body')
		if (this.containerId) {
			container = document.querySelector(`#${this.containerId}`)
		}
		const keyboard = document.createElement('div')
		keyboard.className = "keyboard"
		const keylist = document.createElement('ul')
		keylist.className = "keylist"

		const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
		const classNames = ['white', 'black', 'white shift', 'black', 'white shift', 'white', 'black', 'white shift', 'black', 'white shift', 'black', 'white shift']

		for (let i = startOctave; i < endOctave + 1; i++) {
			for (let j = 0; j < notes.length; j++) {
				const key = document.createElement('li')
				key.id = notes[j] + `${i}`
				key.className = classNames[j]
				keylist.appendChild(key)
			}
		}
		keyboard.appendChild(keylist)
		container.appendChild(keyboard)
		this.octaveRange = [startOctave, endOctave]
		this.keyboard = keyboard
	},

	annotateKeyboard: function() {
		const keys = this.keyboard.querySelectorAll("li")
		for (let i = 0; i < keys.length; i++) {
			const noteName = keys[i].id.substring(0, keys[i].id.length - 1)
			switch (noteName) {
				case 'Db':
					keys[i].appendChild(document.createTextNode('C#'))
					keys[i].appendChild(document.createElement('br'))
					keys[i].appendChild(document.createTextNode('Db'))
					break;
				case 'Eb':
					keys[i].appendChild(document.createTextNode('D#'))
					keys[i].appendChild(document.createElement('br'))
					keys[i].appendChild(document.createTextNode('Eb'))
					break;
				case 'Gb':
					keys[i].appendChild(document.createTextNode('F#'))
					keys[i].appendChild(document.createElement('br'))
					keys[i].appendChild(document.createTextNode('Gb'))
					break;
				case 'Ab':
					keys[i].appendChild(document.createTextNode('G#'))
					keys[i].appendChild(document.createElement('br'))
					keys[i].appendChild(document.createTextNode('Ab'))
					break;
				case 'Bb':
					keys[i].appendChild(document.createTextNode('A#'))
					keys[i].appendChild(document.createElement('br'))
					keys[i].appendChild(document.createTextNode('Bb'))
					break;
				default:
					keys[i].appendChild(document.createTextNode(noteName))
			}
		}
		this.annotations = true;
	},

	displayKeyboardNote: function(name, color) {
		let key = name
		if (name.includes("#")) {
			switch (name.substring(0, name.length-1)) {
				case 'C#': {
					key = 'Db' + name.substring(name.length-1)
					break;
				}
				case 'D#': {
					key = 'Eb' + name.substring(name.length-1)
					break;
				}
				case 'F#': {
					key = 'Gb' + name.substring(name.length-1)
					break;
				}
				case 'G#': {
					key = 'Ab' + name.substring(name.length-1)
					break;
				}
				case 'A#': {
					key = 'Bb' + name.substring(name.length-1)
					break;
				}
			}
		}
		this.keyboard.querySelector(`#${key}`).style = `background: ${color}`
		if (this.canPlay) {
			this.keyboard.addEventListener('click', () => {
				_playNotes([`${key}`])
				_changeOpacity(this.keyboard)
			})
		}
		this.note = {name: name, color: color}
		return key
	},

	displayKeyboardInterval: function(name, intervalType, color) {
		let key = name
		if (name.includes("#")) {
			switch (name.substring(0, name.length-1)) {
				case 'C#': {
					key = 'Db' + name.substring(name.length-1)
					break;
				}
				case 'D#': {
					key = 'Eb' + name.substring(name.length-1)
					break;
				}
				case 'F#': {
					key = 'Gb' + name.substring(name.length-1)
					break;
				}
				case 'G#': {
					key = 'Ab' + name.substring(name.length-1)
					break;
				}
				case 'A#': {
					key = 'Bb' + name.substring(name.length-1)
					break;
				}
			}
		}
		const current = this.keyboard.querySelector(`#${key}`)
		current.style = `background: ${color}`

		let notesToPlay = []
		switch(intervalType) {
			case "m2": {
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, [1], color))
				break;
			}
			case "M2": {
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, [2], color))
				break;
			}
			case "m3": {
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, [3], color))
				break;
			}
			case "M3": {
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, [4], color))
				break;
			}
			case "P4": {
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, [5], color))
				break;
			}
			case "TT": {
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, [6], color))
				break;
			}
			case "P5": {
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, [7], color))
				break;
			}
			case "m6": {
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, [8], color))
				break;
			}
			case "M6": {
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, [9], color))
				break;
			}
			case "m7": {
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, [10], color))
				break;
			}
			case "M7": {
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, [11], color))
				break;
			}
			case "P8": {
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, [12], color))
				break;
			}

		}

		if (this.canPlay) {
			this.keyboard.addEventListener('click', () => {
				_playNotes(notesToPlay)
				_changeOpacity(this.keyboard)
			})
		}

		this.interval = {name: name, interval: intervalType, color: color}

	},

	displayKeyboardChord: function(name, chordType, color) {
		let key = name
		if (name.includes("#")) {
			switch (name.substring(0, name.length-1)) {
				case 'C#': {
					key = 'Db' + name.substring(name.length-1)
					break;
				}
				case 'D#': {
					key = 'Eb' + name.substring(name.length-1)
					break;
				}
				case 'F#': {
					key = 'Gb' + name.substring(name.length-1)
					break;
				}
				case 'G#': {
					key = 'Ab' + name.substring(name.length-1)
					break;
				}
				case 'A#': {
					key = 'Bb' + name.substring(name.length-1)
					break;
				}
			}
		}
		const current = this.keyboard.querySelector(`#${key}`)
		current.style = `background: ${color}`

		let notesToPlay = []
		switch(chordType) {
			case "major": {
				const steps = [4, 3]
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, steps, color))
				break;
			}
			case "minor": {
				const steps = [3, 4]
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, steps, color))
				break;
			}
			case "augmented": {
				const steps = [4, 4]
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, steps, color))
				break;
			}
			case "diminished": {
				const steps = [3, 3]
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, steps, color))
				break;
			}
			case "major7": {
				const steps = [4, 3, 4]
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, steps, color))
				break;
			}
			case "minor7": {
				const steps = [3, 4, 3]
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, steps, color))
				break;
			}
			case "dominant7": {
				const steps = [4, 3, 3]
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, steps, color))
				break;
			}
			case "diminished7": {
				const steps = [3, 3, 3]
				notesToPlay =[current.id].concat(_findKeyboardInterval(current, steps, color))
				break;
			}
		}

		if (this.canPlay) {
			this.keyboard.addEventListener('click', () => {
				_playNotes(notesToPlay)
				_changeOpacity(this.keyboard)
			})
		}

		this.chord = {name: name, chordType: chordType, color: color}

	}

}

MusicSheet.prototype = {

	createSheet: function () {
		let container = document.querySelector('body')
		if (this.containerId) {
			container = document.querySelector(`#${this.containerId}`)
		}
		const sheet = document.createElement('div')
		sheet.className = "sheet"

		const top = document.createElement('div')
		top.id = "top"
		const trebleStaff = document.createElement('ul')
		trebleStaff.id = "trebleStaff"
		const trebleNotes = ['F4', 'D4', 'B3', 'G3', 'E3']
		for (let i = 0; i < 5; i++) {
			const trebleLine = document.createElement('li')
			trebleLine.id = trebleNotes[i]
			trebleLine.className = "treble"
			trebleStaff.appendChild(trebleLine)
		}
		const trebleClef = document.createElement('img')
		trebleClef.src = "./img/trebleclef.png"
		trebleClef.id = "trebleSymbol"
		const topNotes = document.createElement('div')
		topNotes.className = "notes"
		top.appendChild(trebleStaff)
		top.appendChild(trebleClef)
		top.appendChild(topNotes)

		const bottom = document.createElement('div')
		bottom.id = "bottom"
		const bassStaff = document.createElement('ul')
		bassStaff.id = "bassStaff"
		const bassNotes = ['A2', 'F2', 'D2', 'B1', 'G1']
		for (let i = 0; i < 5; i++) {
			const bassLine = document.createElement('li')
			bassLine.id = bassNotes[i]
			bassLine.className = "bass"
			bassStaff.appendChild(bassLine)
		}
		const bassClef = document.createElement('img')
		bassClef.src = "./img/bassclef.png"
		bassClef.id = "bassSymbol"
		const bottomNotes = document.createElement('div')
		bottomNotes.className = "notes"
		bottom.appendChild(bassStaff)
		bottom.appendChild(bassClef)
		bottom.appendChild(bottomNotes)

		sheet.appendChild(top)
		sheet.appendChild(bottom)
		container.appendChild(sheet)
		this.sheet = sheet

	},

	annotateSheet: function() {
		const top = this.sheet.querySelector('#top')
		const annotations = document.createElement('div')
		annotations.className = "annotations"
		const notes = ['F', 'D', 'B', 'G', 'E', 'A', 'F', 'D', 'B', 'G']
		const margins = [0.575, 0, 0, 0, 0, 1, 0, 0, 0, 0]
		for (let i = 0; i < margins.length; i++) {
			const annotation = document.createElement('p')
			annotation.className = "annotation"
			annotation.style = `margin:${margins[i]}rem 0 0 23rem;`
			annotation.appendChild(document.createTextNode(notes[i]))
			annotations.appendChild(annotation)
		}
		top.appendChild(annotations)
		this.annotations = true
	},

	displaySheetNote: function(name, noteValue, onlyAccidental=false) {
		const top = this.sheet.querySelector("#top")
		const notes = document.createElement('div')
		notes.className = "notes"
		const letter = name.substring(0, 1)
		const number = name.substring(name.length-1)

		if (!onlyAccidental) {
			if (noteValue === "whole" || noteValue === "whole2") {
				notes.appendChild(_displayNoteSymbol(name, noteValue))
			} else {
				if (name === "C2" || name === "Cb2" || name === "C#2" || number <= 1) {
					notes.appendChild(_displayNoteSymbol(name, noteValue, 'up'))
				} else if (name === "B3" || name === "Bb3" || name === "B#3" ||number >= 4) {
					notes.appendChild(_displayNoteSymbol(name, noteValue, 'down'))
				} else if (number === '2') {
					notes.appendChild(_displayNoteSymbol(name, noteValue, 'down'))
				} else if (number === '3') {
					notes.appendChild(_displayNoteSymbol(name, noteValue, 'up'))
				}
			}

			if (name === 'C3' || name === 'Cb3' || name === 'C#3') {
				notes.appendChild(_displayStaffLine(6.75))
			} else if (name === 'A4' || name === 'B4' || name === 'Ab4' || name === 'Bb4' || name === 'A#4' || name === 'B#4') {
				notes.appendChild(_displayStaffLine(-0.1))
			} else if (name === 'E1' || name === 'D1' || name === 'Eb1' || name === 'Db1' || name === 'E#1' || name === 'D#1') {
				notes.appendChild(_displayStaffLine(13.3))
			} else if (name === 'C1' || name === 'Cb1' || name === 'C#1') {
				notes.appendChild(_displayStaffLine(13.3))
				notes.appendChild(_displayStaffLine(14.35))
			}
		}

		if (name.includes('#')){
			notes.appendChild(_displayAccidental(name, 'sharp'))
		}
		if (name.includes('b')){
			notes.appendChild(_displayAccidental(name, 'flat'))
		}

		let key = name
		if (name.includes("#")) {
			switch (name.substring(0, name.length-1)) {
				case 'C#': {
					key = 'Db' + name.substring(name.length-1)
					break;
				}
				case 'D#': {
					key = 'Eb' + name.substring(name.length-1)
					break;
				}
				case 'F#': {
					key = 'Gb' + name.substring(name.length-1)
					break;
				}
				case 'G#': {
					key = 'Ab' + name.substring(name.length-1)
					break;
				}
				case 'A#': {
					key = 'Bb' + name.substring(name.length-1)
					break;
				}
			}
		} else if (name.includes("b")) {
			switch (name.substring(0, name.length-1)) {
				case 'Cb': {
					const n = parseInt(name.substring(name.length-1)) - 1
					key = 'B' + `${n}`
					break;
				}
				case 'Fb': {
					key = 'E' + name.substring(name.length-1)
					break;
				}
			}
		}

		top.insertBefore(notes, top.lastChild)
		this.note = {name: name, noteValue: noteValue}

		if (this.canPlay) {
			this.sheet.addEventListener('click', () => {
				_playNotes([`${key}`])
			 	_changeOpacity(this.sheet)
			})
		}

	},

	displaySheetInterval: function(name, intervalType, noteValue) {
		if (intervalType !== "m2" && intervalType !== "M2") {
			this.displaySheetNote(name, noteValue);
		}
		switch (intervalType) {
			case "m2": {
				this.displaySheetNote(name, noteValue+"2");
				const intervalNote = _findSheetInterval(name, 1, 0)
				this.displaySheetNote(intervalNote, noteValue, true)
				return intervalNote
				break;
			}
			case "M2": {
				this.displaySheetNote(name, noteValue+"2");
				const intervalNote = _findSheetInterval(name, 2, 0)
				this.displaySheetNote(intervalNote, noteValue, true)
				return intervalNote
				break;
			}
			case "m3": {
				const intervalNote = _findSheetInterval(name, 3, 1)
				this.displaySheetNote(intervalNote, noteValue)
				return intervalNote
				break;
			}
			case "M3": {
				this.displaySheetNote(_findSheetInterval(name, 4, 1), noteValue)
				return _findSheetInterval(name, 4, 1)
				break;
			}
			case "P4": {
				const intervalNote = _findSheetInterval(name, 5, 2)
				this.displaySheetNote(intervalNote, noteValue)
				return intervalNote
				break;
			}
			case "TT": {
				const intervalNote = _findSheetInterval(name, 6, 2)
				this.displaySheetNote(intervalNote, noteValue)
				return intervalNote
				break;
			}
			case "P5": {
				const intervalNote = _findSheetInterval(name, 7, 3)
				this.displaySheetNote(intervalNote, noteValue)
				return intervalNote
				break;
			}
			case "m6": {
				const intervalNote = _findSheetInterval(name, 8, 4)
				this.displaySheetNote(intervalNote, noteValue)
				return intervalNote
				break;
			}
			case "M6": {
				const intervalNote = _findSheetInterval(name, 9, 4)
				this.displaySheetNote(intervalNote, noteValue)
				return intervalNote
				break;
			}
			case "m7": {
				const intervalNote = _findSheetInterval(name, 10, 5)
				this.displaySheetNote(intervalNote, noteValue)
				return intervalNote
				break;
			}
			case "M7": {
				const intervalNote = _findSheetInterval(name, 11, 5)
				this.displaySheetNote(intervalNote, noteValue)
				return intervalNote
				break;
			}
			case "P8": {
				const intervalNote = _findSheetInterval(name, 12, 6)
				this.displaySheetNote(intervalNote, noteValue)
				return intervalNote
				break;
			}

		}
		this.interval = {name: name, intervalType: intervalType, noteValue: noteValue}
	},

	displaySheetChord: function(name, chordType, noteValue) {
		switch (chordType) {
			case "major": {
				const name2 = this.displaySheetInterval(name, 'M3', noteValue)
				const name3 = this.displaySheetInterval(name2, 'm3', noteValue)
				break;
			}
			case "minor": {
				const name2 = this.displaySheetInterval(name, 'm3', noteValue)
				const name3 = this.displaySheetInterval(name2, 'M3', noteValue)
				break;
			}
			case "augmented": {
				const name2 = this.displaySheetInterval(name, 'M3', noteValue)
				const name3 = this.displaySheetInterval(name2, 'M3', noteValue)
				break;
			}
			case "diminished": {
				const name2 = this.displaySheetInterval(name, 'm3', noteValue)
				const name3 = this.displaySheetInterval(name2, 'm3', noteValue)
				break;
			}
			case "major7": {
				const name2 = this.displaySheetInterval(name, 'M3', noteValue)
				const name3 = this.displaySheetInterval(name2, 'm3', noteValue)
				const name4 = this.displaySheetInterval(name3, 'M3', noteValue)
				break;
			}
			case "minor7": {
				const name2 = this.displaySheetInterval(name, 'm3', noteValue)
				const name3 = this.displaySheetInterval(name2, 'M3', noteValue)
				const name4 = this.displaySheetInterval(name3, 'm3', noteValue)
				break;
			}
			case "dominant7": {
				const name2 = this.displaySheetInterval(name, 'M3', noteValue)
				const name3 = this.displaySheetInterval(name2, 'm3', noteValue)
				const name4 = this.displaySheetInterval(name3, 'm3', noteValue)
				break;
			}
			case "diminished7": {
				const name2 = this.displaySheetInterval(name, 'm3', noteValue)
				const name3 = this.displaySheetInterval(name2, 'm3', noteValue)
				const name4 = this.displaySheetInterval(name3, 'm3', noteValue)
				break;
			}
		}

		this.chord = {name: name, chordType: chordType, noteValue: noteValue}
	}

}

//HELPER FUNCTIONS
function _playNotes(notesToPlay) {
	for (let i = 0; i < notesToPlay.length; i++) {
		const audio = new Audio(`./mp3/${notesToPlay[i]}.mp3`)
		audio.play()
	}
}

function _changeOpacity(element) {
	element.style.opacity = 0.7
	setTimeout(function() {
		element.style.opacity = 1
   }, 800);
	console.log(element)
}

//PIANO HELPER FUNCTIONS
function _findKeyboardInterval(current, steps, color) {
	let nextSibling = current.nextElementSibling
	let notes = []
	for (let i = 1; i < steps[0]; i++) {
		nextSibling = nextSibling.nextElementSibling
	}
	nextSibling.style = `background: ${color}`
	notes.push(nextSibling.id)

	for (let j = 1; j < steps.length; j++) {
		for (let i = 0; i < steps[j]; i++) {
			nextSibling = nextSibling.nextElementSibling
		}
		nextSibling.style = `background: ${color}`
		notes.push(nextSibling.id)
	}
	// console.log(notes)
	return notes
}

//MUSIC SHEET HELPER FUNCTIONS
function _displayStaffLine(margin) {
	const line = document.createElement('img')
	line.className = "note"
	line.src = "./img/line.png"
	line.style = `margin: ${margin}rem 0 0 -9rem; width:2rem; transform: translate(-20%, 0%);`
	return line
}

function _displayNoteSymbol(name, noteValue, orientation=null) {
	const dict = {
		'B4': -1,
		'A4': -0.5,
		'G4': 0,
		'F4': 0.575,
		'E4': 1.15,
		'D4': 1.725,
		'C4': 2.3,
		'B3': 2.875,
		'A3': 3.45,
		'G3': 4.035,
		'F3': 4.6,
		'E3': 5.175,
		'D3': 5.75,
		'C3': 6.25,
		'B2': 6.75,
		'A2': 7.25,
		'G2': 7.75,
		'F2': 8.325,
		'E2': 8.9,
		'D2': 9.475,
		'C2': 10.05,
		'B1': 10.525,
		'A1': 11.2,
		'G1': 11.775,
		'F1': 12.35,
		'E1': 12.85,
		'D1': 13.35,
		'C1': 13.85
	}
	const letter = name.substring(0, 1)
	const number = name.substring(name.length-1)
	const noteSymbol = document.createElement('img')
	noteSymbol.className = "note"
	if (!orientation ) {
		if (noteValue.includes("2")) {
			noteSymbol.src = `./img/${noteValue}note.png`
			noteSymbol.style=`margin: ${dict[letter+number]}rem 0 0 -9.2rem;  height:1.47rem; transform: translate(0,-32%);`
		} else {
			noteSymbol.src = `./img/${noteValue}note.png`
			noteSymbol.style=`margin: ${dict[letter+number]}rem 0 0 -9.2rem;  height:1rem;`
		}
	} else {
		if (noteValue.includes("2")) {
			if (orientation === 'up') {
				noteSymbol.src = `./img/${noteValue}note${orientation}.png`
				noteSymbol.style=`margin: ${dict[letter+number]}rem 0 0 -9rem;  width:2.6rem; transform: translate(0,-74%);`
			} else if (orientation === 'down') {
				noteSymbol.src = `./img/${noteValue}note${orientation}.png`
				noteSymbol.style=`margin: ${dict[letter+number]}rem 0 0 -9rem;  width:2.6rem; transform: translate(0,-15%);`
			}
		}	else {
			noteSymbol.src = `./img/${noteValue}note${orientation}.png`
			if (orientation === 'up') {
				noteSymbol.style=`margin: ${dict[letter+number]}rem 0 0 -9rem;  width:1.27rem; transform: translate(0,-72%);`
			} else if (orientation === 'down') {
				noteSymbol.style=`margin: ${dict[letter+number]}rem 0 0 -9rem;  width:1.27rem;`
			}
		}
	}
	return noteSymbol
}

function _displayAccidental(name, accidentalType) {
	const dict = {
		'B4': -1,
		'A4': -0.5,
		'G4': 0,
		'F4': 0.575,
		'E4': 1.15,
		'D4': 1.725,
		'C4': 2.3,
		'B3': 2.875,
		'A3': 3.45,
		'G3': 4.035,
		'F3': 4.6,
		'E3': 5.175,
		'D3': 5.75,
		'C3': 6.25,
		'B2': 6.75,
		'A2': 7.25,
		'G2': 7.75,
		'F2': 8.325,
		'E2': 8.9,
		'D2': 9.475,
		'C2': 10.05,
		'B1': 10.525,
		'A1': 11.2,
		'G1': 11.775,
		'F1': 12.35,
		'E1': 12.85,
		'D1': 13.35,
		'C1': 13.85
	}
	const letter = name.substring(0, 1)
	const number = name.substring(name.length-1)
	const accidental = document.createElement('img')
	accidental.className = "note"
	accidental.src = `./img/${accidentalType}.png`
	if (accidentalType === 'sharp') {
		accidental.style = `margin: ${dict[letter+number]}rem 0 0 -10.3rem; height:1.5rem; transform: translate(0, -20%);`
	} else {
		accidental.style = `margin: ${dict[letter+number]}rem 0 0 -9.7rem; height:1.5rem; transform: translate(0, -40%);`
	}
	return accidental
}

function _findSheetInterval(name, intervalStep, accidentalPosition) {
	const dict = {
		'B': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
		'A': ['B', 'C', 'D', 'E', 'F', 'G', 'A'],
		'G': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
		'F': ['G', 'A', 'B', 'C', 'D', 'E', 'F'],
		'E': ['F', 'G', 'A', 'B', 'C', 'D', 'E'],
		'D': ['E', 'F', 'G', 'A', 'B', 'C', 'D'],
		'C': ['D', 'E', 'F', 'G', 'A', 'B', 'C']
	}
	const notes = ['C1', 'C#1/Db1', 'D1', 'D#1/Eb1', 'E1/Fb1', 'F1/E#1', 'F#1/Gb1', 'G1', 'G#1/Ab1', 'A1', 'A#1/Bb1', 'B1/Cb2',
	'C2/B#1', 'C#2/Db2', 'D2', 'D#2/Eb2', 'E2/Fb2', 'F2/E#2', 'F#2/Gb2', 'G2', 'G#2/Ab2', 'A2', 'A#2/Bb2', 'B2/Cb3',
	'C3/B#2', 'C#3/Db3', 'D3', 'D#3/Eb3', 'E3/Fb3', 'F3/E#3', 'F#3/Gb3', 'G3', 'G#3/Ab3', 'A3', 'A#3/Bb3', 'B3/Cb4',
	'C4/B#3', 'C#4/Db4', 'D4', 'D#4/Eb4', 'E4/Fb4', 'F4/E#4', 'F#4/Gb4', 'G4', 'G#4/Ab4', 'A4', 'A#4/Bb4', 'B4']
	const number = name.substring(name.length-1)
	const letter = name.substring(0,1)
	const name1 = notes.filter((note) => note.includes(name)===true)
	const name2 = notes[notes.indexOf(`${name1}`) + intervalStep]
	if (name2.includes('#') || name2.includes('b')) {
		const opt1 = name2.substring(0,name2.length-4)
		const opt2 = name2.substring(name2.length-3,name2.length)
		if (opt1.includes(dict[letter][accidentalPosition])) {
			return opt1
		} else if (opt2.includes(dict[letter][accidentalPosition])) {
			return opt2
		}
	} else {
		return name2
	}
}

global.Piano = global.Piano || Piano
global.MusicSheet = global.MusicSheet || MusicSheet

})(window, window.document)
