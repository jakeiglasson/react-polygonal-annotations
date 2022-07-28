import React, { useEffect, useRef, useState } from "react";
import { splitTextToLineArray } from "../helperFunctions";
import { SimpleInputForm } from "../SimpleInputForm";

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

type AnnotationsObj = { path: Coord[]; textArray: string[]; maxTextLineWidthIndex: number };

type AnnotationsArr = AnnotationsObj[];

export const PolygonAnnotation = ({ width, height, editable = true }: Props) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const getCanvasContext = () => canvasRef.current?.getContext("2d");

	const [annotations, setAnnotations] = useState<AnnotationsArr>([]);
	let editingAnnotationIndex = -1; //idx in array "annotations", -1 if no annotation is being edited

	const fontSize = 16;
	const fontFamily = "Arial";
	// space between lines for 16px fontsize is 16 + 4, this double for every extra 16px
	const lineSpace = 4 * (fontSize / 16);
	// const maxCharPerLine = 18;
	const textTopOffset = 8;
	const textLeftOffset = 12;

	const [currentAnnotationTextInput, setCurrentAnnotationTextInput] = useState("");
	const [renderAnnotationInput, setRenderAnnotationInput] = useState(false);

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
			x: e.pageX - canvasContext.canvas.getBoundingClientRect().left,
			y: e.pageY - canvasContext.canvas.getBoundingClientRect().top,
		};
	};

	const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
		if (editable) {
			const canvasContext = getCanvasContext();
			if (canvasContext) {
				if (editingAnnotationIndex === -1) {
					editingAnnotationIndex = annotations.length;
					setAnnotations((annotationsArray) => {
						annotationsArray[editingAnnotationIndex] = {
							path: [],
							textArray: [],
							maxTextLineWidthIndex: 0,
						};
						return annotationsArray;
					});
				}

				const mousePosInCanvas = getMousePosOnCanvas({ e, canvasContext });

				setAnnotations((annotationsArray) => {
					annotationsArray[editingAnnotationIndex].path.push(mousePosInCanvas);
					annotationsArray[editingAnnotationIndex].path.push(mousePosInCanvas); // last item is always mouse position
					return annotationsArray;
				});

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
					setAnnotations((annotationsArray) => {
						annotationsArray[editingAnnotationIndex].path.push(mousePosInCanvas);
						annotationsArray[editingAnnotationIndex].path.push(annotations[editingAnnotationIndex].path[0]); //add first point again to end selection, tells canvas where to draw the last line to
						return annotationsArray;
					});
					renderAnnotations();
					setRenderAnnotationInput(true);
				}
			}
		}
	};

	const renderToolTip = (mousePosInCanvas: Coord, annotation: AnnotationsObj) => {
		const canvasContext = getCanvasContext();
		if (annotation.textArray.length === 0 || (annotation.textArray.length === 1 && annotation.textArray[0] === "")) {
			return;
		}
		if (canvasContext) {
			const maxTextWidth = canvasContext.measureText(annotation.textArray[annotation.maxTextLineWidthIndex]);
			const rectangleDimensions = [
				{ x: mousePosInCanvas.x, y: mousePosInCanvas.y },
				{
					x: maxTextWidth.width + textLeftOffset * 2,
					y: textTopOffset * 2 + fontSize * annotation.textArray.length + lineSpace,
				},
			];

			// border fill rect
			canvasContext.fillStyle = "#f5f5dc";
			canvasContext.fillRect(rectangleDimensions[0].x, rectangleDimensions[0].y, rectangleDimensions[1].x, rectangleDimensions[1].y);
			// fill rect
			canvasContext.strokeStyle = "#ffe4c4";
			canvasContext.strokeRect(rectangleDimensions[0].x, rectangleDimensions[0].y, rectangleDimensions[1].x, rectangleDimensions[1].y);
			// text
			annotation.textArray.forEach((text, i) => {
				canvasContext.fillStyle = "#000000";
				canvasContext.font = `${fontSize}px ${fontFamily}`;
				canvasContext.fillText(text, mousePosInCanvas.x + textLeftOffset, mousePosInCanvas.y + fontSize + textTopOffset + fontSize * i);
			});
		}
	};

	function showToolTipIfPointInPath(mousePosInCanvas: Coord) {
		const canvasContext = getCanvasContext();

		if (canvasContext && canvasContext) {
			if (editingAnnotationIndex === -1) {
				for (var i = annotations.length - 1; i >= 0; i--) {
					var path = annotations[i].path;

					canvasContext.beginPath();
					canvasContext.moveTo(path[0].x, path[0].y);
					for (var j = 1; j < path.length; j++) {
						canvasContext.lineTo(path[j].x, path[j].y);
					}

					if (canvasContext.isPointInPath(mousePosInCanvas.x, mousePosInCanvas.y)) {
						canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
						renderAnnotations();
						renderToolTip(mousePosInCanvas, annotations[i]);
						break;
					} else {
						canvasContext.clearRect(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
						renderAnnotations();
					}
				}
			}
		}
	}

	const handleMouseMoveOnCanvas = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
		const canvasContext = getCanvasContext();
		if (canvasContext) {
			const mousePosInCanvas = getMousePosOnCanvas({ e, canvasContext });

			if (editingAnnotationIndex !== -1) {
				var lastItem = annotations[editingAnnotationIndex].path.length - 1;

				setAnnotations((annotationsArray) => {
					annotationsArray[editingAnnotationIndex].path[lastItem] = mousePosInCanvas;
					return annotationsArray;
				});

				renderAnnotations();
			}

			showToolTipIfPointInPath(mousePosInCanvas);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCurrentAnnotationTextInput(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setAnnotations((annotationsArray) => {
			const { textSplitArray, maxTextLineWidthIndex } = splitTextToLineArray(currentAnnotationTextInput);
			annotationsArray[annotationsArray.length - 1].textArray = textSplitArray;
			annotationsArray[annotationsArray.length - 1].maxTextLineWidthIndex = maxTextLineWidthIndex;
			return annotationsArray;
		});

		setCurrentAnnotationTextInput("");
		setRenderAnnotationInput(false);
	};

	const handleCancel = () => {
		setRenderAnnotationInput(false);
		setAnnotations((annotationsArray) => {
			annotationsArray = annotationsArray.slice(0, annotationsArray.length - 1);
			return annotationsArray;
		});
	};

	useEffect(() => {
		renderAnnotations();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [annotations.length]);

	const formContent = (
		<>
			<p className='annotationInputTitle'>Annotation Name</p>
		</>
	);

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
			{renderAnnotationInput && (
				<div className='selectionInput' style={{ width: width + "px", height: height + "px" }}>
					<SimpleInputForm
						handleSubmit={handleSubmit}
						handleChange={handleChange}
						content={formContent}
						inputType={"textarea"}
						inputValue={currentAnnotationTextInput}
					/>
					<button onClick={handleCancel}>cancel</button>
				</div>
			)}
		</div>
	);
};
