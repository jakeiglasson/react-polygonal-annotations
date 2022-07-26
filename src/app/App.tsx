import React, { useState } from 'react'
import { Image } from './components/Image';
import { ImageUpload } from './components/ImageUpload';
import './css/app.css';

function App() {

  const [image, setImage] = useState('')

  return (
    <div className="App">
      <ImageUpload setImage={setImage} />
      {image && <Image url={image} />}

    </div>
  );
}

export default App;
