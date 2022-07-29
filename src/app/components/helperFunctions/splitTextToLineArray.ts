export const splitTextToLineArray = (text: string): { textSplitArray: string[]; maxTextLineWidthIndex: number } => {
	let textArray: string[] = [];
	const maxCharPerLine = 18;
	let maxTextLineWidth = { width: 0, index: 0 };

	if (text.length === maxCharPerLine) {
		return { textSplitArray: [text.trim()], maxTextLineWidthIndex: 0 };
	} else if (text.length > maxCharPerLine) {
		// modifiedText looks for strings within the given string that are longer than the given maxCharPerLine
		// when such a string is found, it divides it into chunks, each chunk has a maximum possible length == maxCharPerLine
		// example: input = '123456789a12345678zzz 123456789a12345678" output: '123456789a12345678 zzz 123456789a12345678'
		// this string is then split on " " into an array so each value can be drawn to new line with canvas
		const modifiedText = text
			.split(" ")
			.map((s, i) => {
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
			.join(" ")
			.replace(/\s\s+/g, " "); // remove extra white spaces, e.g 'the    fox' becomes 'the fox'
		textArray = modifiedText.split(" ");
		textArray.forEach((s, i) => {
			if (s.length > maxTextLineWidth.width) {
				maxTextLineWidth.width = s.length;
				maxTextLineWidth.index = i;
			}
		});
		return { textSplitArray: textArray, maxTextLineWidthIndex: maxTextLineWidth.index };
	} else {
		return { textSplitArray: [text], maxTextLineWidthIndex: 0 };
	}
};
