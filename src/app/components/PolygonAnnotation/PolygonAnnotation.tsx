import React, { useRef } from "react";

import "./css/style.css";

type Props = {
	width: number;
	height: number;
};

type AnnotationsArr = { path: { x: number; y: number }[] }[];

export const PolygonAnnotation = ({ width, height }: Props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const canvasObj = canvasRef.current;
	const canvasContext = canvasObj?.getContext("2d");

	console.log({ width, height });
	const annotations: AnnotationsArr = [];
	let editingAnnotationIndex = -1; //idx in array "annotations", -1 if no annotation is being edited

	const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
		console.log("canvas click");
		if (canvasContext) {
			if (editingAnnotationIndex === -1) {
				editingAnnotationIndex = annotations.length;
				annotations[editingAnnotationIndex] = {
					path: [],
					// text: "",
				};
			}

			// mouse position on canvas
			const mousePosInCanvas = {
				x: e.pageX - canvasContext.canvas.getBoundingClientRect().left, //position().left gets how far from the left start of the viewport the left side of the canvas is
				y: e.pageY - canvasContext.canvas.getBoundingClientRect().top, // position().top gets how far from the top start of the viewport the top side of the canvas is
			};

			annotations[editingAnnotationIndex].path.push(mousePosInCanvas);
			annotations[editingAnnotationIndex].path.push(mousePosInCanvas); // last item is always mouse position
			// renderAnnotations($(this), annotations);
		}
	};

	return (
		<div className='canvasContainer'>
			<canvas ref={canvasRef} width={width} height={height} style={{ width: width + "px", height: height + "px" }} onClick={handleCanvasClick} />
		</div>
	);
};

// todo
// draw canvas on top of image with exact dimension of image

// canvas.attr("width", this.width);
// canvas.attr("height", this.height);
// canvas.css("width", this.width + "px");
// canvas.css("height", this.height + "px");
// annotationDiv.css("height", this.height + "px");
