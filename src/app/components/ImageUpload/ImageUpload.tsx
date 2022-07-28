import React, { useState } from "react";
import { httpGet } from "../helperFunctions/httpGet";
import { SimpleInputForm } from "../SimpleInputForm";
import "./css/style.css";

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
	const [imageUrlInput, setImageUrlInput] = useState("https://cdn.mos.cms.futurecdn.net/VRv8ab66tAfezxvXdXVpfe-970-80.jpg.webp");

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

	const formContent = (
		<>
			<p>Add image via url (supports jpg, png, webp)</p>
			<p>https://cdn.mos.cms.futurecdn.net/VRv8ab66tAfezxvXdXVpfe-970-80.jpg.webp</p>
			{statusMessage && <p className={`${statusMessage.type === "error" ? "errorMessage" : "successMessage"}`}>{statusMessage.message}</p>}
			{!statusMessage.message && <p>&nbsp;</p>}
		</>
	);

	return (
		<SimpleInputForm handleSubmit={handleSubmit} handleChange={handleChange} content={formContent} inputType={"text"} inputValue={imageUrlInput} />
	);
};
