import React, { useRef } from "react";

import "./css/style.css";

type Props = {
	width: number;
	height: number;
	editable?: boolean; //default true
};

type Coord = {
	x: number;
	y: number;
};

type AnnotationsArr = { path: Coord[]; text: string }[];

export const PolygonAnnotation = ({ width, height, editable = true }: Props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const getCanvasContext = () => canvasRef.current?.getContext("2d");

	const textCanvasRef = useRef<HTMLCanvasElement>(null);
	const getTextCanvasContext = () => textCanvasRef.current?.getContext("2d");

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
		if (editable) {
			const canvasContext = getCanvasContext();
			if (canvasContext) {
				if (editingAnnotationIndex === -1) {
					editingAnnotationIndex = annotations.length;
					annotations[editingAnnotationIndex] = {
						path: [],
						text: "",
					};
				}

				const mousePosInCanvas = getMousePosOnCanvas({ e, canvasContext });

				annotations[editingAnnotationIndex].path.push(mousePosInCanvas);
				annotations[editingAnnotationIndex].path.push(mousePosInCanvas); // last item is always mouse position

				renderAnnotations();
			}
		}
	};

	const handleDoubleClickOnCanvas = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
		if (editable) {
			const canvasContext = getCanvasContext();
			if (canvasContext) {
				if (editingAnnotationIndex !== -1) {
					const mousePosInCanvas = getMousePosOnCanvas({ e, canvasContext });

					annotations[editingAnnotationIndex].path.push(mousePosInCanvas);
					annotations[editingAnnotationIndex].path.push(annotations[editingAnnotationIndex].path[0]); //add first point again to end selection, tells canvas where to draw the last line to

					editingAnnotationIndex = -1;

					renderAnnotations();
				}
			}
		}
	};

	const renderToolTip = (mousePosInCanvas: Coord) => {
		const textCanvasContext = getTextCanvasContext();
		if (textCanvasContext) {
			console.log("should be visible");

			const fontSize = 48;
			const fontFamily = "Arial";
			// space between lines for 16px fontsize is 16 + 4, this double for every extra 16px
			const lineSpace = 4 * (fontSize / 16);
			const textWidth = textCanvasContext.measureText("test").width;
			const textTopOffset = 8;
			const textLeftOffset = 12;
			const textLengthMaxWidth = 253;
			const rectanglePadding = 0;

			//rectangle width is the length of the text + 32, equates to 16px padding both sides
			const rectangleDimensions = [
				{ x: mousePosInCanvas.x, y: mousePosInCanvas.y },
				{ x: textWidth + textLeftOffset * 2, y: textTopOffset * 2 + fontSize + lineSpace },
			];

			// space between lines for 16px fontsize is 16 + 4

			// const getTextWidth = (txt: string, font: string) => {
			// 	textCanvasContext.font = font;
			// 	const tsize = { width: textCanvasContext.measureText(txt).width, height: parseInt(textCanvasContext.font) };
			// 	return tsize;
			// };
			// const tsize = get_text_size("test", `${fontSize}px ${fontFamily}`);
			// console.log("tsize", tsize);
			// console.log("Calculated width " + tsize["width"] + "; Calculated height " + tsize["height"]);

			// border fill rect
			textCanvasContext.fillStyle = "#f5f5dc";
			textCanvasContext.fillRect(rectangleDimensions[0].x, rectangleDimensions[0].y, rectangleDimensions[1].x, rectangleDimensions[1].y);
			// fill rect
			textCanvasContext.strokeStyle = "#ffe4c4";
			textCanvasContext.strokeRect(rectangleDimensions[0].x, rectangleDimensions[0].y, rectangleDimensions[1].x, rectangleDimensions[1].y);
			// text
			textCanvasContext.fillStyle = "#000000";
			textCanvasContext.font = `${fontSize}px ${fontFamily}`;
			textCanvasContext.fillText("test", mousePosInCanvas.x + textLeftOffset, mousePosInCanvas.y + fontSize + textTopOffset, textLengthMaxWidth);

			// shouldBeVisible = true;
			// canvasContext.qtip("option", "content.text", annotations[i].text.replace(/\n/g, "<br>"));
		}
	};

	function showToolTipIfPointInPath(mousePosInCanvas: Coord) {
		const canvasContext = getCanvasContext();
		const textCanvasContext = getTextCanvasContext();
		if (canvasContext && textCanvasContext) {
			// var shouldBeVisible = false;
			if (
				// !isDialogOpen &&
				editingAnnotationIndex == -1
			) {
				for (var i = 0; i < annotations.length; i++) {
					var path = annotations[i].path;

					canvasContext.beginPath();
					canvasContext.moveTo(path[0].x, path[0].y);
					for (var j = 1; j < path.length; j++) {
						canvasContext.lineTo(path[j].x, path[j].y);
					}

					textCanvasContext.clearRect(0, 0, textCanvasContext.canvas.width, textCanvasContext.canvas.height);
					if (canvasContext.isPointInPath(mousePosInCanvas.x, mousePosInCanvas.y)) {
						renderToolTip(mousePosInCanvas);
					}
				}
			}
			// if (shouldBeVisible) {
			// 	$(".qtip-annotation").show();
			// } else {
			// 	$(".qtip-annotation").hide();
			// }
		}
	}

	const handleMouseMoveOnCanvas = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
		console.log("mouse move on canvas");
		const canvasContext = getCanvasContext();
		if (canvasContext) {
			const mousePosInCanvas = getMousePosOnCanvas({ e, canvasContext });

			if (editingAnnotationIndex !== -1) {
				var lastItem = annotations[editingAnnotationIndex].path.length - 1;
				annotations[editingAnnotationIndex].path[lastItem] = mousePosInCanvas;
				renderAnnotations();
			}

			showToolTipIfPointInPath(mousePosInCanvas);
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
			<canvas ref={textCanvasRef} className={"textCanvas"} width={width} height={height} style={{ width: width + "px", height: height + "px" }} />
			{/* <div className='selectionInput' style={{ width: width + "px", height: height + "px" }}></div> */}
		</div>
	);
};

// function showQtipIfPointInPath(canvas, point) {
// 	var shouldBeVisible = false;
// 	if (!isDialogOpen && annIdxEditing == -1) {
// 		var ctx = canvas.get(0).getContext("2d");

// 		for (var i = 0; i < annotations.length; i++) {
// 			var path = annotations[i].path;

// 			ctx.beginPath();
// 			ctx.moveTo(path[0].x, path[0].y);
// 			for (var j = 1; j < path.length; j++) {
// 				ctx.lineTo(path[j].x, path[j].y);
// 			}

// 			if (ctx.isPointInPath(point.x, point.y)) {
// 				shouldBeVisible = true;
// 				canvas.qtip("option", "content.text", annotations[i].text.replace(/\n/g, "<br>"));
// 			}
// 		}
// 	}

// 	if (shouldBeVisible) {
// 		$(".qtip-annotation").show();
// 	} else {
// 		$(".qtip-annotation").hide();
// 	}
// }
