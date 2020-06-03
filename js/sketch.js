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
const X_CANNY = [
	[-1,  0,  1],
	[-2,  0,  2],
	[-1,  0,  1]
];

const Y_CANNY = [
	[-1, -2, -1],
	[ 0,  0,  0],
	[ 1,  2,  1]
];

const XY_CANNY = [
	[-2, -1,  0],
	[-1,  0,  1],
	[ 0,  1,  2]
];

const YX_CANNY = [
	[ 0,  1,  2],
	[-1,  0,  1],
	[-2, -1,  0]
];

function preload() {
	_img = loadImage('assets/buntes.jpg');
}

function setup() {
	createCanvas(600, 424);

	let uiOffset = 0;

	createCheckBoxEx(
		"Hide original", 										// title
		610, uiOffset += 10, 									// x, y
		false, 													// status
		function() { _hideOriginal = this.checked(); } 			// changed function
	);	

	createCheckBoxEx(	
		"Hide grayscale", 										// title
		610, uiOffset += 20, 									// x, y
		false, 													// status
		function() { _hideGrayScale = this.checked(); } 		// changed function
	);	

	createCheckBoxEx(	
		"Hide canny",  											// title
		610, uiOffset += 20, 									// x, y
		false, 													// status
		function() { _hideSobelFilter = this.checked(); } 		// changed function
	);

	_sliderFilterX = createSliderEx(
		"Canny filter in x axis right", 						// title
		610, uiOffset += 20, 									// x, y 
		100, IGNORE, 											// width, height
		0, 60, 30, 												// min, max, value
		function(){ _hideFilterX = this.checked(); }			// changed function
	);

	_sliderFilterY = createSliderEx(
		"Canny filter in y axis right", 						// title
		610, uiOffset += 40,									// x, y 
		100, IGNORE, 											// width, height
		0, 60, 30, 												// min, max, value
		function(){ _hideFilterY = this.checked(); }			// changed function	
	);
	
	_sliderFilterXY = createSliderEx(
		"Canny filter in xy axis right",				 		// title
		610,  uiOffset += 40, 									// x, y 
		100, IGNORE, 											// width, height
		0, 60, 30, 												// min, max, value
		function(){ _hideFilterXY = this.checked();}			// changed function	
	);
	
	_sliderFilterYX = createSliderEx(
		"Canny filter in yx axis right",						// title
		610, uiOffset += 40, 									// x, y
		100, IGNORE, 											// width, height
		0, 60, 30, 												// min, max, value
		function(){ _hideFilterYX = this.checked();}			// changed function
	);

	pixelDensity(1);
	_img.loadPixels();
}

function createSliderEx(title, x, y, width, height, min, max, value, changedFunc) { 
	let titleDiv = createDiv(title);
	titleDiv.position(x, y);

	let slider = createSlider(min, max, value);
	slider.position(x, y + 22);
	slider.style('width', width + 'px');

	let checkbox = createCheckbox('Hide', false);
	checkbox.position(x + width, y + 20);
	checkbox.changed(changedFunc);

	return slider;
}
function createCheckBoxEx(title, x, y, status, changedFunc) { 
	let checkbox = createCheckbox(title, status);
	checkbox.position(x, y);
	checkbox.changed(changedFunc);
}
function draw() {
	clear();

	// Slider values as filter
	let sliderFilterXValue = _sliderFilterX.value();
	let sliderFilterYvalue = _sliderFilterY.value();
	let sliderFilterXYValue = _sliderFilterXY.value();
	let sliderFilterYXvalue = _sliderFilterYX.value();

	loadPixels();



	for (let x = 0; x < _img.width; x += 1) {
		for (let y = 0; y < _img.height; y += 1) {
			// Calculate the 1D location from a 2D grid
			let loc = (x + y * _img.width) * 4;

			// Get the R,G,B values from image
			let r = _img.pixels[loc + 0];
			let g = _img.pixels[loc + 1];
			let b = _img.pixels[loc + 2];

			if(_hideGrayScale && !_hideOriginal) { 
				pixels[loc + 0]= _img.pixels[loc + 0];
				pixels[loc + 1]= _img.pixels[loc + 1];
				pixels[loc + 2]= _img.pixels[loc + 2];
				pixels[loc + 3]= 255
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
				pixels[loc + 0]= gray;
				pixels[loc + 1]= gray;
				pixels[loc + 2]= gray;
				pixels[loc + 3]= 255;
			}
		}
	}

	if(!_hideSobelFilter) {  
		for (let x = 1; x < _img.width - 1; x += 1) {
			for (let y = 1; y < _img.height - 1; y += 1) {
				// Calculate the 1D location from a 2D grid
				let loc = (x + y * _img.width) * 4;
				// canny
				let kernelX = 0;
				let kernelY = 0;
				
				let kernelXY = 0;
				let kernelYX = 0;
				// for([start variablen]; [abbruch bedingdung]; [schritte]) {[code]}
				for (let matrixX = -1; matrixX < 2; matrixX += 1) {
					for (let matrixY = -1; matrixY < 2; matrixY += 1) {
						// Calculate the 1D location from a 2D grid
						let imgLoc = ((x + matrixX) + (y + matrixY) * _img.width) * 4;
						// Get the value form the Kernel
						let xCannyValue = X_CANNY[1 + matrixY][1 + matrixX];
						let yCannyValue = Y_CANNY[1 + matrixY][1 + matrixX];
						
						let xyCannyValue = XY_CANNY[1 + matrixY][1 + matrixX];
						let yxCannyValue = YX_CANNY[1 + matrixY][1 + matrixX];
						// Get the R,G,B values from image
						let grayValue = _grayScaledImg[imgLoc + 0];

						kernelX += xCannyValue * grayValue;
						kernelY += yCannyValue * grayValue;

						kernelXY += xyCannyValue * grayValue;
						kernelYX += yxCannyValue * grayValue;
					}
				}

				//console.log(kernel);
				
				// Make a new color and set pixel in the window
				//Filter
				if (!_hideFilterX & kernelX > sliderFilterXValue) {
					pixels[loc + 0] = 255;
					pixels[loc + 1] = 0;
					pixels[loc + 2] = 0;
					pixels[loc + 3] = 200;
				}
				
				if (!_hideFilterY & kernelY > sliderFilterYvalue) {
					pixels[loc + 0] = 0;
					pixels[loc + 1] = 0;
					pixels[loc + 2] = 255;
					pixels[loc + 3] = 200;
				}
				if (!_hideFilterXY & kernelXY > sliderFilterXYValue) {
					pixels[loc + 0] = 0;
					pixels[loc + 1] = 255;
					pixels[loc + 2] = 0;
					pixels[loc + 3] = 200;
				}
				if (!_hideFilterYX & kernelYX > sliderFilterYXvalue) {
					pixels[loc + 0] = 255;
					pixels[loc + 1] = 0;
					pixels[loc + 2] = 255;
					pixels[loc + 3] = 200;
				}
			}
		}
	} else { 
		pixels = _img.pixels;
	}
	updatePixels();
}
