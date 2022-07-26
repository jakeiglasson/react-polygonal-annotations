// Note: code related to qtip is removed see readme for more info
// in the html, there is the following div: <div id="annotation"></div>
// JQuery declares a function called annotation which takes in two options {image: url, editable: boolean}
// JQuery calls the annotation function on the div rendered with id="annotation"

// ---

// Jquery creates an image inside the the div rendered with id="annotation"
// Jquery pass this newly created img element to the function preventSelectionOnDbClick, likely to prevent users from highlighting the image like you can with text by double clicking, although by investigating double clicking images it seems you cannot highlight images like this anyway. Therefore I have removed this function call.
// Once the image has loaded JQuery executes a function (imageLoadFunction) to set the canvas to the same size as the image
// The way images are handled, rendered via JQuery is cumbersome and not needed, therefore all code related to it has been removed.
// The imageLoadFunction is left as it contains code that will need to be checked later to get images to work

const preventSelectionOnDbClick = ({ element }) => {
	element.css("-moz-user-select", "none");
	element.css("-khtml-user-select", "none");
	element.css("-webkit-user-select", "none");
	element.css("-o-user-select", "none");
	element.css("user-select", "none");
};

// on image load, set the canvas to match the width and height of the image
const imageLoadFunction = ({ canvas, annotationDiv, options, annotations, renderAnnotations }) => {

  // Set canvas width and height using react methods instead of this
	canvas.attr("width", this.width);
	canvas.attr("height", this.height);
	canvas.css("width", this.width + "px");
	canvas.css("height", this.height + "px");
	annotationDiv.css("height", this.height + "px");

  // I believe this renders the annotations when an image is loaded and already has annotations present
  // The jsfiddle doesn't have this option because it doesn't save annotations
  // implement custom method to handle this
	if (options.annotationsJSON) {
		annotations = JSON.parse(options.annotationsJSON);
		renderAnnotations(canvas, annotations);
	}
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
		// if not already editing / creating a selection, insert a new empty object to create a new selection
		// can be replaced with annotations.push({
		// 	path: [],
		// 	text: "",
		// };)
		// text can be omitted for now, it was used with Qtip which has been removed
		annIdxEditing = annotations.length;
		annotations[annIdxEditing] = {
			path: [],
			// text: "",
		};
	}

	var p = getMousePosOnCanvas({ canvas: $(this), evt: e });
	annotations[annIdxEditing].path.push(p);
	// an event listener exists on the canvas for when the mouse moves
  // whenever the mouse moves, if the user is editing a selection it overwrites the last pos stored in annotations
  // this is why the initial position is stored twice so it is not overwritten
	annotations[annIdxEditing].path.push(p); // last item is always mouse position
	renderAnnotations($(this), annotations);
};

const annotation = (options) => {
	// some globals used all over... TODO: use params instead
	var annotations = [];
  //idx in array "annotations" or 
  // -1 if no annotation is being edited
  var annIdxEditing = -1;
  // not entirely sure what this was used for
  // removing it doesn't seem to affect functionality in anyway
  // googling seems to suggest it might be used for submitting data with a form that users cant see or edit
  var hiddenInputId = $("#" + options.hiddenInputId);
  
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
	// image: "https://raw.githubusercontent.com/zembaalbert/jquery-polygon-annotation-on-images/master/img.jpg",
	editable: true,
});
