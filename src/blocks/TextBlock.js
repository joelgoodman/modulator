import { h } from "preact";
import BaseBlock from "./BaseBlock";

class TextBlock extends BaseBlock {
	constructor(content) {
		super("text", content);
	}

	render() {
		return <div className="text-block">{this.content}</div>;
	}
}

export default TextBlock;
