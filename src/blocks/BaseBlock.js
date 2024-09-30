class BaseBlock {
	constructor(type, content) {
		this.type = type;
		this.content = content;
	}

	render() {
		throw new Error("Render method should be implemented by subclasses");
	}
}

export default BaseBlock;
