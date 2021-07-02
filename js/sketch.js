let _img;
let _grayScaledImg = [];

// checkboxes
let _hideOriginal;
let _hideGrayScale;
let _hideSobelFilter;

// Sliders
let _sliderFilterL2R;
let _sliderFilterR2L;
let _sliderFilterT2B;
let _sliderFilterB2T;
let _sliderFilterTL2BR;
let _sliderFilterBR2TL;
let _sliderFilterBL2TR;
let _sliderFilterTR2BL;

// checkboxes
let _hideFilterL2R;
let _hideFilterR2L;
let _hideFilterT2B;
let _hideFilterB2T;
let _hideFilterTL2BR;
let _hideFilterBR2TL;
let _hideFilterBL2TR;
let _hideFilterTR2BL;

const IGNORE = -1;
// filter
const SOBEL_L2R = [
	[-1,  0,  1],
	[-2,  0,  2],
	[-1,  0,  1]
];
const SOBEL_R2L = [
	[1,  0,  -1],
	[2,  0,  -2],
	[1,  0,  -1]
];
const SOBEL_T2B= [
	[-1, -2, -1],
	[ 0,  0,  0],
	[ 1,  2,  1]
];
const SOBEL_B2T = [
	[ 1,  2,  1],
	[ 0,  0,  0],
	[-1, -2, -1]
];
const SOBEL_TL2BR = [
	[-2, -1,  0],
	[-1,  0,  1],
	[ 0,  1,  2]
];
const SOBEL_BR2TL = [
	[ 2,  1,  0],
	[ 1,  0, -1],
	[ 0, -1, -2]
];
const SOBEL_BL2TR = [
	[ 0,  1,  2],
	[-1,  0,  1],
	[-2, -1,  0]
];
const SOBEL_TR2BL = [
	[ 0, -1, -2],
	[ 1,  0, -1],
	[ 2,  1,  0]
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

	_sliderFilterL2R = createSliderEx(
		"Sobel filter from left to right", 						// title
		610, uiOffset += 20, 									// x, y 
		100, IGNORE, 											// width, height
		0, 60, 30, 												// min, max, value
		function(){ _hideFilterL2R = this.checked(); }			// changed function
	);

	_sliderFilterR2L = createSliderEx(
		"Sobel filter from right to letf", 						// title
		610, uiOffset += 40, 									// x, y 
		100, IGNORE, 											// width, height
		0, 60, 30, 												// min, max, value
		function(){ _hideFilterR2L = this.checked(); }			// changed function
	);
	
	_sliderFilterT2B = createSliderEx(
		"Sobel filter from top to bottom", 						// title
		610, uiOffset += 40,									// x, y 
		100, IGNORE, 											// width, height
		0, 60, 30, 												// min, max, value
		function(){ _hideFilterT2B = this.checked(); }			// changed function	
	);
	
	_sliderFilterB2T = createSliderEx(
		"Sobel filter from bottom to top", 						// title
		610, uiOffset += 40,									// x, y 
		100, IGNORE, 											// width, height
		0, 60, 30, 												// min, max, value
		function(){ _hideFilterB2T = this.checked(); }			// changed function	
	);

	_sliderFilterTL2BR = createSliderEx(
		"Sobel filter from top left to bottom right", 			// title
		610,  uiOffset += 40, 									// x, y 
		100, IGNORE, 											// width, height
		0, 60, 30, 												// min, max, value
		function(){ _hideFilterTL2BR = this.checked();}			// changed function	
	);

	_sliderFilterBR2TL = createSliderEx(
		"Sobel filter from bottom right to top left", 			// title
		610,  uiOffset += 40, 									// x, y 
		100, IGNORE, 											// width, height
		0, 60, 30, 												// min, max, value
		function(){ _hideFilterBR2TL = this.checked();}			// changed function	
	);
	
	_sliderFilterBL2TR = createSliderEx(
		"Sobel filter bottom left to top right",				// title
		610, uiOffset += 40, 									// x, y
		100, IGNORE, 											// width, height
		0, 60, 30, 												// min, max, value
		function(){ _hideFilterBL2TR = this.checked();}			// changed function
	);

	_sliderFilterTR2BL = createSliderEx(
		"Sobel filter top right to bottom left",				// title
		610, uiOffset += 40, 									// x, y
		100, IGNORE, 											// width, height
		0, 60, 30, 												// min, max, value
		function(){ _hideFilterTR2BL = this.checked();}			// changed function
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
	let sliderFilterL2RValue = _sliderFilterL2R.value();
	let sliderFilterR2LValue = _sliderFilterR2L.value();
	let sliderFilterT2Bvalue = _sliderFilterT2B.value();
	let sliderFilterB2Tvalue = _sliderFilterB2T.value();
	let sliderFilterTL2BRValue = _sliderFilterTL2BR.value();
	let sliderFilterBR2TLValue = _sliderFilterBR2TL.value();
	let sliderFilterBL2TRvalue = _sliderFilterBL2TR.value();
	let sliderFilterTR2BLvalue = _sliderFilterTR2BL.value();

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
				let kernelL2R = 0;
				let kernelR2L = 0;
				let kernelT2B = 0;
				let kernelB2T = 0;
				let kernelTL2BR = 0;
				let kernelBR2TL = 0;
				let kernelBL2TR = 0;
				let kernelTR2BL = 0;

				// for([start variablen]; [abbruch bedingdung]; [schritte]) {[code]}
				for (let matrixX = -1; matrixX < 2; matrixX += 1) {
					for (let matrixY = -1; matrixY < 2; matrixY += 1) {
						// Calculate the 1D location from a 2D grid
						let imgLoc = ((x + matrixX) + (y + matrixY) * _img.width) * 4;
						// Get the value form the Kernel
						let sobelValueL2R = SOBEL_L2R[1 + matrixY][1 + matrixX];
						let sobelValueR2L = SOBEL_R2L[1 + matrixY][1 + matrixX];
						let sobelValueT2B = SOBEL_T2B[1 + matrixY][1 + matrixX];
						let sobelValueB2T = SOBEL_B2T[1 + matrixY][1 + matrixX];
						let sobelValueTL2BR = SOBEL_TL2BR[1 + matrixY][1 + matrixX];
						let sobelValueBR2TL = SOBEL_BR2TL[1 + matrixY][1 + matrixX];
						let sobelValueBL2TR = SOBEL_BL2TR[1 + matrixY][1 + matrixX];
						let sobelValueTR2BL = SOBEL_TR2BL[1 + matrixY][1 + matrixX];
						
						// Get the R,G,B values from image
						let grayValue = _grayScaledImg[imgLoc + 0];

						kernelL2R += sobelValueL2R * grayValue;
						kernelR2L += sobelValueR2L * grayValue;
						kernelT2B += sobelValueT2B * grayValue;
						kernelB2T += sobelValueB2T * grayValue;
						kernelTL2BR += sobelValueTL2BR * grayValue;
						kernelBR2TL += sobelValueBR2TL * grayValue;
						kernelBL2TR += sobelValueBL2TR * grayValue;
						kernelTR2BL += sobelValueTR2BL * grayValue;	
					}
				}

				//console.log(kernel);
				
				// Make a new color and set pixel in the window
				//Filter
				
				if (!_hideFilterL2R & kernelL2R > sliderFilterL2RValue){ 
					pixels[loc + 0] = 255;
					pixels[loc + 1] = 0;
					pixels[loc + 2] = 0;
					pixels[loc + 3] = 200; // transparency
				}
				if (!_hideFilterR2L & kernelR2L > sliderFilterR2LValue){ 
					pixels[loc + 0] = 255;
					pixels[loc + 1] = 255;
					pixels[loc + 2] = 0;
					pixels[loc + 3] = 200; // transparency
				}
				if (!_hideFilterT2B & kernelT2B > sliderFilterT2Bvalue){ 
					pixels[loc + 0] = 0;
					pixels[loc + 1] = 255;
					pixels[loc + 2] = 0;
					pixels[loc + 3] = 200; // transparency
				}
				if (!_hideFilterB2T & kernelB2T > sliderFilterB2Tvalue){ 
					pixels[loc + 0] = 0;
					pixels[loc + 1] = 255;
					pixels[loc + 2] = 255;
					pixels[loc + 3] = 200; // transparency
				}
				if (!_hideFilterTL2BR & kernelTL2BR > sliderFilterTL2BRValue){ 
					pixels[loc + 0] = 0;
					pixels[loc + 1] = 0;
					pixels[loc + 2] = 255;
					pixels[loc + 3] = 200; // transparency
				}
				if (!_hideFilterBR2TL & kernelBR2TL > sliderFilterBR2TLValue){ 
					pixels[loc + 0] = 255;
					pixels[loc + 1] = 0;
					pixels[loc + 2] = 255;
					pixels[loc + 3] = 200; // transparency
				}
				if (!_hideFilterBL2TR & kernelBL2TR > sliderFilterBL2TRvalue){ 
					pixels[loc + 0] = 255;
					pixels[loc + 1] = 125;
					pixels[loc + 2] = 255;
					pixels[loc + 3] = 200; // transparency
				}
				if (!_hideFilterTR2BL & kernelTR2BL > sliderFilterTR2BLvalue){ 
					pixels[loc + 0] = 125;
					pixels[loc + 1] = 255;
					pixels[loc + 2] = 125;
					pixels[loc + 3] = 200; // transparency
				}
			}
		}
	} else { 
		pixels = _img.pixels;
	}
	updatePixels();
}
