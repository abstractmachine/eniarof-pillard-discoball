
// Variables

let delay = 600
let countdown = delay
let data
let notifications
let title = "...."
let hint = "Hello"
let hintIndex = -1
let code = "ABCD"
let cursor = 0
let guess = "----"
let state = 0
let song
let port
let writer
let yes
let nope


// Démarrage


function preload() {
	data = loadJSON("notifications.json")
	song = new p5.SoundFile("musique/mingus.mp3")
	yes = loadSound("bruitage/yes.wav")
	nope = loadSound("bruitage/nope.wav")
}




function setup() {

	createCanvas(windowWidth, windowHeight)

	setupSerial()
	textAlign(CENTER,CENTER)

	// load data into sketch
	notifications = data.notifications

	nextHint()

}


// En boucle, 60 fois par seconde

function draw() {

	switch(state) {

		case 0:
			// OFF
			background(128)
			break;

		case 1:
			// YES
			background(0,255,0)
			break;

		case 2:
			let pulse = 127 + sin(frameCount*0.1) * 127
			// GO
			background(0,pulse,0)
			// est-ce qu'on a fini de jouer?
			if (!song.isPlaying()) {
				discoEnd()
				// changer l'état à OFF
				state = 0
			}
			break;

		case 3:
			// END
			// revenir à OFF
			state = 0
			break;

		case 6:
			// NO
			background(255,0,0)
			break;

	}
	
	fill(255)
	textSize(30)
	text(hint,width*0.5,height*0.25)
	textSize(100)
	text(guess,width*0.5,height*0.5)
	text(title,width*0.5,height*0.75)

	if (--countdown < 0) {
		countdown = delay
		nextHint()
	}

}


function nextHint() {
	hintIndex++
	if (hintIndex >= notifications.length) {
		hintIndex = 0
	}
	hint = notifications[hintIndex].hint
}


// lorsqu'on appuie sur une touche

function keyPressed() {
	
	// vérifier qu'il s'agit d'une touche entre a et z
	if (key >= 'a' && key <= 'z') {
			attempt(key)
	}

}


function attempt(value) {

	// s'il y a trop de caractères
	if (cursor >= 4) {
		// tout effacer et recommencer
		resetCode()
	}

	guess = guess.substr(0,cursor) + value + guess.substring(cursor+1)
	// passer au caractère suivant
	cursor++

	if (cursor >= 4) {
		validateCode()
	}

}



// Effacer tout et recommencer

function resetCode() {
	cursor = 0
	// changer l'état OFF
	state = 0
	guess = "----"
	stopSound()
}




function validateCode() {
	
	// aller dans chaque notification
	for(let i=0; i<notifications.length; i++) {

		// verifier ce code
		if (notifications[i].code == guess) {
			// c'est bon, joue ce son
			playSound(notifications[i].filename)
			// dire au lightshow qu'on a reussi
			discoYes()
			// changer l'état à YES
			state = 1
			// afficher le titre
			title = notifications[i].title
			// partir de cette fonction
			return
		}

	}

	discoNo()
	// changer l'état NO
	state = 6

}



function playSound(filename) {
	song = new p5.SoundFile("musique/" + filename, soundLoaded)
}



function soundLoaded() {
	song.play()
	guess = "----"
	discoGo()
	// changer l'état à GO!!!
	state = 2
}



function stopSound() {
	song.stop()
	title = ""
	discoStop()
}



async function discoYes() {
	let data = new Uint8Array([89]) // lettre: Y
    writer.write(data)

	yes.play();
}



async function discoNo() { // lettre: N
	let data = new Uint8Array([78])
    writer.write(data)

	nope.play();
}



async function discoGo() {
	let data = new Uint8Array([71]) // lettre: G
    writer.write(data)
}



async function discoStop() {
	let data = new Uint8Array([83]) // lettre: S
    writer.write(data)
}



async function discoEnd() { // lettre: E
	let data = new Uint8Array([69])
    writer.write(data)
}



// Pour se connecter à l'arduino on utilise la port série

async function setupSerial() {

	const permission = document.getElementById("serial")
	const serialButton = document.getElementById("serial")
	serialButton.onclick = async () => {
		port = await navigator.serial.requestPort()
		await port.open({ baudRate:9600 })
		writer = port.writable.getWriter()
		console.log(writer)
		//const ports = await navigator.serial.getPorts()
		permission.remove()
	}
	
}