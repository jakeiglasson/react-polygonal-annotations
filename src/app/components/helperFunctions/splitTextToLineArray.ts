export const splitTextToLineArray = (text: string): { textSplitArray: string[]; maxTextLineWidthIndex: number } => {
	let textArray: string[] = [];
	const maxCharPerLine = 18;
	let maxTextLineWidth = { width: 0, index: 0 };

	if (text.length === 18) {
		return { textSplitArray: [text.trim()], maxTextLineWidthIndex: 0 };
	} else if (text.length > maxCharPerLine) {
		if (text.length > maxCharPerLine) {
			const modifiedText = text
				.split(" ")
				.map((s) => {
					if (s.length > 18) {
						let modifiedStringArray: string[] = [];
						const remainder = s.length % maxCharPerLine;
						const multiple = (s.length - remainder) / maxCharPerLine;
						if (multiple === 1) {
							modifiedStringArray.push(s.slice(0, 18));
							modifiedStringArray.push(s.slice(18, s.length));
						} else {
							for (let i = 0; i <= multiple; i++) {
								const slice = s.slice(0 + 18 * i, 18 + 18 * i);
								if (slice) {
									modifiedStringArray.push(slice);
								}
							}
						}
						return modifiedStringArray.join(" ");
					} else {
						return s;
					}
				})
				.join(" ");
			text = modifiedText;
		}
		while (text.length > 18) {
			let spaceIndex;
			for (let i = 0; i < maxCharPerLine + 1; i++) {
				if (text[i] === " " || text[i] === undefined) {
					spaceIndex = i;
				}
				if (i > 0 && (i + 1) % (maxCharPerLine + 1) === 0) {
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
		textArray = textArray.filter((s) => s !== "");
		return { textSplitArray: textArray, maxTextLineWidthIndex: maxTextLineWidth.index };
	} else {
		return { textSplitArray: [text], maxTextLineWidthIndex: 0 };
	}
};
