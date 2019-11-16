window.onload = function() {

	var file = document.getElementById("thefile");
	var audio = document.getElementById("audio");

	file.onchange = function() {
		var files = this.files;
		audio.src = URL.createObjectURL(files[0]);
		audio.load();
		audio.play();
		var context = new AudioContext();
		var src = context.createMediaElementSource(audio);
		var analyser = context.createAnalyser();

		var canvas = document.getElementById("canvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		var ctx = canvas.getContext("2d");

		src.connect(analyser);
		analyser.connect(context.destination);

		analyser.fftSize = 256;

		var bufferLength = analyser.frequencyBinCount;
		console.log(bufferLength);

		var dataArray = new Uint8Array(bufferLength);
		console.log(dataArray.length);

		var WIDTH = canvas.width;
		var HEIGHT = canvas.height;

		var barWidth = (WIDTH / bufferLength) * 2.5;
		var barHeight;
		var x = 0;

		function renderFrame() {
			requestAnimationFrame(renderFrame);

			x = 0;

			analyser.getByteFrequencyData(dataArray);

			ctx.fillStyle = "#000";
			ctx.fillRect(0, 0, WIDTH, HEIGHT);
			var centerWidth = WIDTH/2
			var centerHeight = HEIGHT/2

			for (var i = 0; i < bufferLength; i++) {
				barHeight = dataArray[i];

				var r = barHeight + (25 * (i/bufferLength));
				var g = 250 * (i/bufferLength);
				var b = 255;
				ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";

				// the triangle
				ctx.beginPath();
				ctx.moveTo(centerWidth, centerHeight - barHeight );
				ctx.lineTo(centerWidth - barHeight, centerHeight + barHeight);
				ctx.lineTo(centerWidth + barHeight, centerHeight + barHeight);
				ctx.closePath();

				if (dataArray[i] > 80 && dataArray[i] < 180) {
					ctx.fillStyle = "rgb(0,0,0)";
				}

				if (dataArray[i] > 180) {
					ctx.fillStyle = "rgb(255,255,255)";
				}
				ctx.fill();
				// ctx.fillRect(x,HEIGHT - barHeight - i*10, barWidth,  barHeight - i*10);
				x += barWidth + 1;

			}
		}

		audio.play();
		renderFrame();
	};
};
