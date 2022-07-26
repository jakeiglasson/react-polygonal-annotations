const preventSelectionOnDbClick = ({ element }) => {
	element.css("-moz-user-select", "none");
	element.css("-khtml-user-select", "none");
	element.css("-webkit-user-select", "none");
	element.css("-o-user-select", "none");
	element.css("user-select", "none");
};

const getMousePosOnCanvas = ({ canvas, evt }) => {
	var p = {
		x: evt.pageX - canvas.position().left,
		y: evt.pageY - canvas.position().top,
	};
	return p;
};

const renderAnnotations = (canvas, annotations) => {
	var ctx = canvas.get(0).getContext("2d");
	ctx.clearRect(0, 0, canvas.get(0).width, canvas.get(0).height);
	ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
	ctx.strokeStyle = "#ffcc33";
	ctx.lineWidth = 2;

	for (var i = 0; i < annotations.length; i++) {
		var path = annotations[i].path;

		ctx.beginPath();
		ctx.moveTo(path[0].x, path[0].y);
		for (var j = 1; j < path.length; j++) {
			ctx.lineTo(path[j].x, path[j].y);
		}
		ctx.fill();
		ctx.stroke();
	}
};

const handleMouseMoveOnCanvas = ({ e, annIdxEditing, annotations }) => {
	var p = getMousePosOnCanvas({ canvas: $(this), evt: e });

	if (annIdxEditing != -1) {
		var lastItem = annotations[annIdxEditing].path.length - 1;
		annotations[annIdxEditing].path[lastItem] = p;
		renderAnnotations($(this), annotations);
	}
};

const handleDoubleClickOnCanvas = ({ e, annIdxEditing, annotations }) => {
	if (annIdxEditing != -1) {
		var p = getMousePosOnCanvas({ canvas: $(this), evt: e });
		annotations[annIdxEditing].path.push(p);
		annotations[annIdxEditing].path.push(annotations[annIdxEditing].path[0]);

		annIdxEditing = -1;

		renderAnnotations($(this), annotations);
	}
};

const handleCanvasClick = ({ e, annIdxEditing, annotations }) => {
	if (annIdxEditing == -1) {
		annIdxEditing = annotations.length;
		annotations[annIdxEditing] = {
			path: [],
			// text: "",
		};
	}

	var p = getMousePosOnCanvas({ canvas: $(this), evt: e });
	annotations[annIdxEditing].path.push(p);
	annotations[annIdxEditing].path.push(p); // last item is always mouse position
	renderAnnotations($(this), annotations);
};

const annotation = (options) => {
	// some globals used all over... TODO: use params instead
	var annotations = [];
	//idx in array "annotations" or
	// -1 if no annotation is being edited
	var annIdxEditing = -1;

	var annotationDiv = $(this);

	preventSelectionOnDbClick({ element: annotationDiv });

	var canvas = $('<canvas id="annotation-canvas">');
	canvas.css("position", "absolute");
	canvas.appendTo(this);

	if (options.editable) {
		canvas.click((e) => handleCanvasClick({ e, annIdxEditing, annotations }));
		canvas.dblclick((e) => handleDoubleClickOnCanvas({ e, annIdxEditing, annotations }));
	}
	canvas.mousemove((e) => handleMouseMoveOnCanvas({ e, annIdxEditing, annotations }));
};

$("#annotation").annotation({
	editable: true,
});
