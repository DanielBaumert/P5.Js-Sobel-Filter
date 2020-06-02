let img;
let grayScaledImg = [];

let filterX;
let filterY;

const xCanny = [
	[-1, 0, 1],
	[-2, 0, 2],
	[-1, 0, 1]
];

const yCanny = [
	[-1, -2, -1],
	[+0, +0, +0],
	[+1, +2, +1]
];

function preload() {
	img = loadImage('assets/buntes.jpg');
}

function setup() {
	createCanvas(600, 424);

	filterX = createSlider(0, 60, 30);
	filterX.position(10, 10);
	filterX.style('width', '80px');


	filterY = createSlider(0, 60, 30);
	filterY.position(10, 30);
	filterY.style('width', '80px');

	pixelDensity(1);
	img.loadPixels();
	
}

function draw() {
	clear();

	let filterXValue = filterX.value();
	let filterYvalue = filterY.value();
	
	loadPixels();
	for (let x = 0; x < img.width; x += 1) {
		for (let y = 0; y < img.height; y += 1) {
			// Calculate the 1D location from a 2D grid
			let loc = (x + y * img.width) * 4;

			// Get the R,G,B values from image
			let r = img.pixels[loc + 0];
			let g = img.pixels[loc + 1];
			let b = img.pixels[loc + 2];

			// gray scaling  
			let grayR = r * 0.3;
			let grayG = g * 0.59;
			let grayB = b * 0.11;
			let gray = grayR + grayG + grayB;

			// Make a new color and set pixel in the window
			grayScaledImg[loc + 0] = gray;
			grayScaledImg[loc + 1] = gray;
			grayScaledImg[loc + 2] = gray;
			grayScaledImg[loc + 3] = 255;
		}
	}

	for (let x = 1; x < img.width - 1; x += 1) {
		for (let y = 1; y < img.height - 1; y += 1) {
			// Calculate the 1D location from a 2D grid
			let loc = (x + y * img.width) * 4;
			// canny
			let kernelX = 0;
			let kernelY = 0;
			// for([start variablen]; [abbruch bedingdung]; [schritte]) {[code]}
			for (let matrixX = -1; matrixX < 2; matrixX += 1) {
				for (let matrixY = -1; matrixY < 2; matrixY += 1) {
					// Calculate the 1D location from a 2D grid
					let imgLoc = ((x + matrixX) + (y + matrixY) * img.width) * 4;
					// Get the value form the Kernel
					let xCannyValue = xCanny[1 + matrixY][1 + matrixX];
					let yCannyValue = yCanny[1 + matrixY][1 + matrixX];
					// Get the R,G,B values from image
					let grayValue = grayScaledImg[imgLoc + 0];

					kernelX += xCannyValue * grayValue;
					kernelY += yCannyValue * grayValue;
				}
			}

			//console.log(kernel);


			// Make a new color and set pixel in the window
			//Filter
			if (kernelX > filterXValue) {
				pixels[loc + 0] = 255;
				pixels[loc + 1] = 0;
				pixels[loc + 2] = 0;
				pixels[loc + 3] = 255;
			}

			if (kernelY > filterYvalue) {
				pixels[loc + 0] = 0;
				pixels[loc + 1] = 0;
				pixels[loc + 2] = 255;
				pixels[loc + 3] = 255;
			}
		}
	}
	updatePixels();

	console.log("loop");
}
