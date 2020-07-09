function showCreation(object) {
	var isMavisObjects = object instanceof Square;
	if (isMavisObjects) {
		var canvas = object.renderingContext.getContext("2d");
		canvas.beginPath();
		canvas.fillStyle = 0x00ff00;
		canvas.strokeStyle = 0x00ff00;
		var v = object.creationMethod(0);
		canvas.moveTo(v[0], v[1]);
		var t = 0;
		var s = setInterval(function(){
			t += 0.01;
			if (t > 1) {
				clearInterval(s);
			}
			v = object.creationMethod(t);
			canvas.lineTo(v[0], v[1]);
			canvas.stroke();
			canvas.fill();
			// canvas.ellipse(v[0], v[1], 1, 1, 0, Math.PI * 2, Math.PI * 2);
			// canvas.fill()
			// debugger
		}, 0)
		t+= 0.01
		v = object.creationMethod(t);
		canvas.lineTo(v[0], v[1]);
		canvas.stroke();
		canvas.closePath();
	}
}
