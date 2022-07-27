import React, { useRef } from "react";

import "./css/style.css";

type Props = {
	width: number;
	height: number;
};

type AnnotationsArr = { path: { x: number; y: number }[] }[];

export const PolygonAnnotation = ({ width, height }: Props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const getCanvasContext = () => canvasRef.current?.getContext("2d");

	const annotations: AnnotationsArr = [];
	let editingAnnotationIndex = -1; //idx in array "annotations", -1 if no annotation is being edited

	const renderAnnotations = () => {
		const canvasContext = getCanvasContext();
		if (canvasContext) {
			canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
			canvasContext.fillStyle = "rgba(255, 255, 255, 0.2)";
			canvasContext.strokeStyle = "#ffcc33";
			canvasContext.lineWidth = 2;
			for (var i = 0; i < annotations.length; i++) {
				var path = annotations[i].path;
				canvasContext.beginPath();
				canvasContext.moveTo(path[0].x, path[0].y);
				for (var j = 1; j < path.length; j++) {
					canvasContext.lineTo(path[j].x, path[j].y);
				}
				canvasContext.fill();
				canvasContext.stroke();
			}
		}
	};

	const getMousePosOnCanvas = ({
		e,
		canvasContext,
	}: {
		e: React.MouseEvent<HTMLCanvasElement, MouseEvent>;
		canvasContext: CanvasRenderingContext2D;
	}) => {
		return {
			x: e.pageX - canvasContext.canvas.getBoundingClientRect().left, //position().left gets how far from the left start of the viewport the left side of the canvas is
			y: e.pageY - canvasContext.canvas.getBoundingClientRect().top, // position().top gets how far from the top start of the viewport the top side of the canvas is
		};
	};

	const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
		const canvasContext = getCanvasContext();
		if (canvasContext) {
			if (editingAnnotationIndex === -1) {
				editingAnnotationIndex = annotations.length;
				annotations[editingAnnotationIndex] = {
					path: [],
					// text: "",
				};
			}

			const mousePosInCanvas = getMousePosOnCanvas({ e, canvasContext });

			annotations[editingAnnotationIndex].path.push(mousePosInCanvas);
			annotations[editingAnnotationIndex].path.push(mousePosInCanvas); // last item is always mouse position

			renderAnnotations();
		}
	};

	const handleDoubleClickOnCanvas = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
		const canvasContext = getCanvasContext();
		if (canvasContext) {
			if (editingAnnotationIndex != -1) {
				const mousePosInCanvas = getMousePosOnCanvas({ e, canvasContext });

				annotations[editingAnnotationIndex].path.push(mousePosInCanvas);
				annotations[editingAnnotationIndex].path.push(annotations[editingAnnotationIndex].path[0]); //add first point again to end selection, tells canvas where to draw the last line to

				editingAnnotationIndex = -1;

				renderAnnotations();
			}
		}
	};

	const handleMouseMoveOnCanvas = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
		const canvasContext = getCanvasContext();
		if (canvasContext) {
			const mousePosInCanvas = getMousePosOnCanvas({ e, canvasContext });

			if (editingAnnotationIndex != -1) {
				var lastItem = annotations[editingAnnotationIndex].path.length - 1;
				annotations[editingAnnotationIndex].path[lastItem] = mousePosInCanvas;
				renderAnnotations();
			}
		}
	};

	return (
		<div className='canvasContainer'>
			<canvas
				ref={canvasRef}
				width={width}
				height={height}
				style={{ width: width + "px", height: height + "px" }}
				onClick={handleCanvasClick}
				onDoubleClick={handleDoubleClickOnCanvas}
				onMouseMove={handleMouseMoveOnCanvas}
			/>
		</div>
	);
};
