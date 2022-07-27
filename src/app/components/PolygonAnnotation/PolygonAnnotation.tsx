import React from 'react'

import './css/style.css'

type Props = {
  width: number;
  height: number
}

export const PolygonAnnotation = ({ width, height }: Props) => {
  console.log({ width, height })
  return (
    <div className='canvasContainer' >
      <canvas width={width} height={height} style={{ width: width + 'px', height: height + 'px' }} />
    </div>
  )
}

// todo
// draw canvas on top of image with exact dimension of image

// canvas.attr("width", this.width);
// canvas.attr("height", this.height);
// canvas.css("width", this.width + "px");
// canvas.css("height", this.height + "px");
// annotationDiv.css("height", this.height + "px");