import { h } from "preact";
import BaseBlock from "./BaseBlock";

class ImageBlock extends BaseBlock {
	constructor(content) {
		super("image", content);
	}

	render() {
		return (
			<figure className="image-block">
				<img src={this.content} alt="" title="" />
			</figure>
		);
	}
}

export default ImageBlock;
