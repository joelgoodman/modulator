import { h } from "preact";
import { TextBlock, ImageBlock } from "./blocks";

const App = () => {
	const textBlock = new TextBlock("This is a text block");
	const imageBlock = new ImageBlock("path/to/image.jpg");

	return (
		<div>
			<h1>Welcome to Modulator</h1>
			{textBlock.render()}
			{imageBlock.render()}
		</div>
	);
};

export default App;
