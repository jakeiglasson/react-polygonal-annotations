import React from 'react'

import './css/image.css'

type ImageProps = {
  url: string
}

export const Image = ({ url }: ImageProps) => {
  return (
    <img src={url} alt='' className='image' />
  )
}
