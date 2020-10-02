/**
 * convert hex to RGBA
 * @param {string} color hex string
 * @return {string} rgba string
 */
function hexToRgba (color) {
	color = (color||"#000000").replace("#","");
	var r = "0",
		g = "0",
		b = "0",
		a = "0";
	if(color.length === 3){
		r = color[0] + color[0];
		g = color[1] + color[1];
		b = color[2] + color[2];
	}else if(color.length === 4){
		r = color[0] + color[0];
		g = color[1] + color[1];
		b = color[2] + color[2];
		a = color[3] + color[3];
	}else if(color.length === 6){
		r = color[0] + color[1];
		g = color[2] + color[3];
		b = color[4] + color[5];
	}else if(color.length === 8){
		r = color[0] + color[1];
		g = color[2] + color[3];
		b = color[4] + color[5];
		a = color[6] + color[7];
	}
	return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16), parseInt(a, 16)];
}
