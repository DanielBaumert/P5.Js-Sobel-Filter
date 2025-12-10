let _img;
let _grayScaledImg = [];

// checkboxes
let _hideOriginal;
let _hideGrayScale;
let _hideSobelFilter;

// Sliders
let _sliderFilterX;
let _sliderFilterY;
let _sliderFilterXY;
let _sliderFilterYX;

// checkboxes
let _hideFilterX;
let _hideFilterY;
let _hideFilterXY;
let _hideFilterYX;

const IGNORE = -1;

const ANGLE_MAP = [
	[-45,  0, 45],
	[-90,  0, 90],
	[225,180,135]
];


let selectedObj;

let XCannyController = { 
	angleOffset: 0,
	angle: 0,
	position: { 
		x: 0,
		y: 0
	}, controlPosition: { 
		x: 1,
		y: 0
	}, matrix: [
		[ 0,  0,  0],
		[ 0,  0,  0],
		[ 0,  0,  0]
	]
}

let YCannyController = { 
	angleOffset: 90,
	angle: 0,
	position: { 
		x: 0,
		y: 0
	}, controlPosition: { 
		x: 0,
		y: 0
	}, matrix: [
		[ 0,  0,  0],
		[ 0,  0,  0],
		[ 0,  0,  0]
	]
}

function preload() {
	_img = loadImage('assets/buntes.jpg');
}

function setup() {
	createCanvas(750, 424);
	angleMode(DEGREES);
	let uiOffset = 0;

	createCheckBoxEx(
		"Hide original", 										// title
		610, uiOffset += 10, 									// x, y
		false, 													// status
		function() { _hideOriginal = this.checked(); } 			// changed function
	);	

	createCheckBoxEx(	
		"Hide grayscale", 										// title
		610, uiOffset += 20, false,  							// x, y, status
		function() { _hideGrayScale = this.checked(); } 		// changed function
	);	

	createCheckBoxEx(	
		"Hide canny",  											// title
		610, uiOffset += 20, false,  							// x, y 
		function() { _hideSobelFilter = this.checked(); } 		// changed function
	);

	createSliderEx(
		"Canny filter in x axis right", 						// title
		610, uiOffset += 20, 									// x, y 
		XCannyController, 										// status
	);

	createSliderEx(
		"Canny filter in y axis right", 						// title
		610, uiOffset += 150,									// x, y 
		YCannyController,										// status
	);
	
	pixelDensity(1);
	_img.loadPixels();
}

function createSliderEx(
	title, 
	x, y, 
	filterController) { 

	let titleDiv = createDiv(title);
	titleDiv.position(x, y);
	
	filterController.position.x = x;
	filterController.position.y = y + 20;
}

function createCheckBoxEx(title, x, y, status, changedFunc) { 
	let checkbox = createCheckbox(title, status);
	checkbox.position(x, y);
	checkbox.changed(changedFunc);
}

function draw() {
	clear();
	
	let c = color(120);

	noStroke();
	fill(c);
	ellipse(XCannyController.position.x + 50, XCannyController.position.y + 50, 100, 100);
	ellipse(YCannyController.position.x + 50, YCannyController.position.y + 50, 100, 100);

	c = color(60);
	fill(c);
	{ 
        let angle = XCannyController.angle;

		let newX = -sin(angle + 90);
		let newY =  cos(angle + 90);

		XCannyController.controlPosition.x = XCannyController.position.x + 50 - (newX * 40);
		XCannyController.controlPosition.y = XCannyController.position.y + 50 - (newY * 40);

		ellipse(
			XCannyController.controlPosition.x, 
			XCannyController.controlPosition.y, 
			20, 20)
	}
	{
		let angle = YCannyController.angle;

		let newX = -sin(angle + 90);
		let newY =  cos(angle + 90);

		YCannyController.controlPosition.x = YCannyController.position.x + 50 - (newX * 40);
		YCannyController.controlPosition.y = YCannyController.position.y + 50 - (newY * 40);

		ellipse(
			YCannyController.controlPosition.x,
			YCannyController.controlPosition.y, 
			20, 20)
	}
	
	loadPixels();
	for (let x = 0; x < _img.width; x += 1) {
		for (let y = 0; y < _img.height; y += 1) {
			// Calculate the 1D location from a 2D grid
			let loc = (x + y * _img.width) * 4;
			let canvasLoc = (x + y * width) * 4;

			// Get the R,G,B values from image
			let r = _img.pixels[loc + 0];
			let g = _img.pixels[loc + 1];
			let b = _img.pixels[loc + 2];

			if(_hideGrayScale && !_hideOriginal) { 
				pixels[canvasLoc + 0]= _img.pixels[loc + 0];
				pixels[canvasLoc + 1]= _img.pixels[loc + 1];
				pixels[canvasLoc + 2]= _img.pixels[loc + 2];
				pixels[canvasLoc + 3]= 255
			}

			// gray scaling  
			let grayR = r * 0.3;
			let grayG = g * 0.59;
			let grayB = b * 0.11;
			let gray = grayR + grayG + grayB;

			// Make a new color and set pixel in the window
			_grayScaledImg[loc + 0] = gray;
			_grayScaledImg[loc + 1] = gray;
			_grayScaledImg[loc + 2] = gray;
			_grayScaledImg[loc + 3] = 255;

			if(!_hideGrayScale) { 
				pixels[canvasLoc + 0]= gray;
				pixels[canvasLoc + 1]= gray;
				pixels[canvasLoc + 2]= gray;
				pixels[canvasLoc + 3]= 255;
			}
		}
	}

	if(!_hideSobelFilter) {  
		for (let x = 1; x < _img.width - 1; x += 1) {
			for (let y = 1; y < _img.height - 1; y += 1) {
				// Calculate the 1D location from a 2D grid
				let canvasLoc = (x + y * width) * 4;
				// canny
				let kernelX = 0;
				let kernelY = 0;

				// for([start variablen]; [abbruch bedingdung]; [schritte]) {[code]}
				for (let matrixX = -1; matrixX < 2; matrixX += 1) {
					for (let matrixY = -1; matrixY < 2; matrixY += 1) {
						// Calculate the 1D location from a 2D grid
						let imgLoc = ((x + matrixX) + (y + matrixY) * _img.width) * 4;
						// Get the value form the Kernel
						let xCannyValue = XCannyController.matrix[1 + matrixY][1 + matrixX];
						let yCannyValue = YCannyController.matrix[1 + matrixY][1 + matrixX];
						
						// Get the R,G,B values from image
						let grayValue = _grayScaledImg[imgLoc];

						kernelX += xCannyValue * grayValue;
						kernelY += yCannyValue * grayValue;
					}
				}

				//console.log(kernel);
				
				// Make a new color and set pixel in the window
				//Filter

				let color = sqrt((kernelX * kernelX) + (kernelY * kernelY))
				pixels[canvasLoc + 0] = color;
				pixels[canvasLoc + 1] = color;
				pixels[canvasLoc + 2] = color;
				pixels[canvasLoc + 3] = 255;
			}
		}
	} 
	updatePixels();
}


function mouseClicked() {
	if(
		XCannyController.position.x < mouseX 
		&& mouseX < XCannyController.position.x + 100
		&& XCannyController.position.y < mouseY 
		&& mouseY < XCannyController.position.y + 100) 
	{ 
		selectedObj = XCannyController;
	} 
	else if(
		YCannyController.position.x < mouseX 
		&& mouseX < YCannyController.position.x + 100
		&& YCannyController.position.y < mouseY 
		&& mouseY < YCannyController.position.y + 100) 
	{ 
		selectedObj = YCannyController;
	}
}

function mouseDragged() { 
	if(selectedObj !== undefined){ 

		let deltaX = mouseX - selectedObj.position.x ;
		let deltaY = mouseY - selectedObj.position.y ;

		selectedObj.angle = atan2(deltaY, deltaX);

		for(let y = 0; y < 3; y++)
		for(let x = 0; x < 3; x++) 
		{
			selectedObj.matrix[y][x] = f(selectedObj.angle - ANGLE_MAP[y][x]);
		}
	}
}

function mouseReleased() {
	selectedObj = undefined;
}

function f(x) { 
	let xScaled = x / 360;
	return Math.abs(((8 * xScaled) % 8) - 4) - 2;
}
