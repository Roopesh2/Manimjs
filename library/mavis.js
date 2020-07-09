class mavis {
	container;
	constructor(){
		this.container = document.body;
		this.classList = []
	}

	setContainer(container) {
		this.container = container instanceof HTMLElement ? container : this.container
	}

	installClasses() {
		for (classes in this.classList) {

		}
	}
};


var Mavis = new mavis()
