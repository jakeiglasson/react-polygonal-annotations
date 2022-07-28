export const splitTextToLineArray = (text: string): { textSplitArray: string[]; maxTextLineWidthIndex: number } => {
	let textArray: string[] = [];
	const maxCharPerLine = 18;
	let maxTextLineWidth = { width: 0, index: 0 };

	if (text.length === 18) {
		return { textSplitArray: [text.trim()], maxTextLineWidthIndex: 0 };
	} else if (text.length > maxCharPerLine) {
		while (text.length >= 18) {
			console.log("text: ", text);
			let spaceIndex;
			for (let i = 0; i < maxCharPerLine; i++) {
				if (text[i] === " ") {
					spaceIndex = i;
				}
				if (i > 0 && (i + 1) % maxCharPerLine === 0) {
					if (spaceIndex || spaceIndex === 0) {
						textArray.push(text.slice(0, spaceIndex + 1));
					} else {
						textArray.push(text.slice(0));
					}
					if (textArray[textArray.length - 1].length > maxTextLineWidth.width) {
						maxTextLineWidth.width = textArray[textArray.length - 1].length;
						maxTextLineWidth.index = textArray.length - 1;
					}
					const startIndex = textArray[textArray.length - 1].length;
					text = text.slice(startIndex);
				}
			}
		}
		if (text.length > maxTextLineWidth.width) {
			maxTextLineWidth.width = text.length;
			maxTextLineWidth.index = textArray.length;
		}
		textArray.push(text);
		textArray.forEach((v, i) => (textArray[i] = v.trim()));
		console.log("splitTextArray = ", textArray);
		return { textSplitArray: textArray, maxTextLineWidthIndex: maxTextLineWidth.index };
	} else {
		return { textSplitArray: [""], maxTextLineWidthIndex: 0 };
	}
};
