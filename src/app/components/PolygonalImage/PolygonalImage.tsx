import React, { useState } from "react";
import { PolygonAnnotation } from "../PolygonAnnotation";

import "./css/style.css";

type Props = {
	url: string;
};

type DimensionProps = {
	width?: number;
	height?: number;
};

export const PolygonalImage = ({ url }: Props) => {
	const [dimensions, setDimensions] = useState<DimensionProps>({ width: undefined, height: undefined });
	const handleSetDimensions = (e: React.SyntheticEvent<HTMLImageElement, Event>) =>
		setDimensions({ width: e.currentTarget.offsetWidth, height: e.currentTarget.offsetHeight });

	return (
		<div className='polygonalAnnotationImageContainer' style={{ width: dimensions.width + "px", height: dimensions.height + "px" }}>
			<img src={url} alt='' className='image' onLoad={handleSetDimensions} />
			{dimensions.width && dimensions.height && <PolygonAnnotation width={dimensions.width} height={dimensions.height} />}
		</div>
	);
};
