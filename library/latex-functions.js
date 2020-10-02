function svgToImage (svgElem) {
	var svgString = new XMLSerializer().serializeToString(svgElem);
	var DOMURL = self.URL || self.webkitURL || self;
	var img = new Image();
	var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
	var url = DOMURL.createObjectURL(svg);
	img.src = url;
	return img;
}

async function texToImg (tex) {
	var str = "https://latex.codecogs.com/svg.latex?"+tex;
	var request = await fetch(str);
	return request;
}

const latexToImg = function (formula) {
  return new Promise((resolve, reject) => {
    let wrapper = MathJax.tex2svg(`${formula}`, {em: 10, ex: 5,display: true})
    let output = { svg: "", img: "" }
    let mjOut = wrapper.getElementsByTagName("svg")[0]
    // mjOut.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    output.svg = mjOut.outerHTML
    var image = new Image()
    image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(output.svg)));
    image.onload = function() {
      var canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0);
      output.img = canvas.toDataURL('image/png');
      resolve(output.img)
    }
    image.onerror = function() {
      reject()
    }
  })
}