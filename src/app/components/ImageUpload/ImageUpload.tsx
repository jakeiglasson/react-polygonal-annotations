import React, { useState } from "react";
import { httpGet } from "../../helperFunctions/httpGet";
import "./css/ImageUpload.css";

// eslint-disable-next-line no-useless-escape
const validImageUrl = new RegExp("(https?://.*.(?:png|jpg|webp))");

type ImageUploadProps = {
  setImage: (img: string) => void;
};

type StatusMessageProps = {
  type: "error" | "success" | "";
  message: string;
};

export const ImageUpload = ({ setImage }: ImageUploadProps) => {
  const [imageUrlInput, setImageUrlInput] = useState("");

  const [statusMessage, setStatusMessage] = useState<StatusMessageProps>({ type: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (imageUrlInput === "") {
      return;
    }
    if (validImageUrl.test(imageUrlInput) && httpGet(imageUrlInput).status === 200) {
      setImage(imageUrlInput);
      statusMessage && setStatusMessage({ type: "success", message: "success" });
    } else {
      setStatusMessage({ type: "error", message: "Invalid URL" });
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className='upload-form'>
      <p>Add image via url (supports jpg, png, webp)</p>
      {statusMessage && <p className={`${statusMessage.type === "error" ? "errorMessage" : "successMessage"}`}>{statusMessage.message}</p>}
      {!statusMessage.message && <p>&nbsp;</p>}
      <input type='text' value={imageUrlInput} onChange={handleChange} />
      <input type='submit' value='Submit' />
    </form>
  );
};
