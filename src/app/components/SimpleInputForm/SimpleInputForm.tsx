import React, { InputHTMLAttributes } from "react";

type Props = {
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	handleChange: (e: React.ChangeEvent<any>) => void;
	content: JSX.Element;
	inputType: React.HTMLInputTypeAttribute | "textarea";
	inputValue: string | ReadonlyArray<string> | number | undefined;
};

export const SimpleInputForm = ({ handleSubmit, handleChange, content, inputType = "text", inputValue }: Props) => {
	return (
		<form onSubmit={(e) => handleSubmit(e)} className='upload-form'>
			{content}
			{inputType === "textarea" ? (
				<textarea value={inputValue} onChange={(e) => handleChange(e)} />
			) : (
				<input type={inputType} value={inputValue} onChange={(e) => handleChange(e)} />
			)}
			<input type='submit' value='Submit' />
		</form>
	);
};
