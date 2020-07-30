function showCreation (object) {
	var isObject = object instanceof Square;
	if (isObject) {
		var pos = object.positions;
		for (var i = 0; i < pos.length; i+= 3) {
			var x = pos[i];
			var y = pos[i + 1];
			var z = pos[i + 2];
			var plotX = map (x, );
		}
	}
}
