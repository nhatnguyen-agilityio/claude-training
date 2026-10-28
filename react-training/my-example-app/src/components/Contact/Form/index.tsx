import { useState } from "react";
import Tags from "../Tags";
import Input from "./Input";
import Submit from "./Submit";
import "./index.css";

export default function Form() {
  const [tag, setTag] = useState<string>("UI/UX design");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (type: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [type]: value,
    }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", {...formData, tag: tag});
  };

  return (
    <div className="flex flex-col">
      <form className="flex flex-col gap-[20px]" onSubmit={handleSubmit}>
        <Tags onSelectTag={setTag} />
        <Input type={"name"} placeholder={"Your name"} value={formData.name} onChange={handleInputChange} />
        <Input type={"email"} placeholder={"Your email"} value={formData.email} onChange={handleInputChange} />
        <Input type={"message"} placeholder={"Your message"} value={formData.message} onChange={handleInputChange} />
        <Submit />
      </form>
    </div>
  );
}
