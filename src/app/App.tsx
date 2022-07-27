import React, { useState } from "react";
import { PolygonalImage } from "./components/PolygonalImage";
import { ImageUpload } from "./components/ImageUpload";
import "./css/app.css";

function App() {
	const [image, setImage] = useState("");

	return (
		<div className='App'>
			<ImageUpload setImage={setImage} />
			{image && <PolygonalImage url={image} />}
		</div>
	);
}

export default App;
