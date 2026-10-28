import Form from "./Form";
import "./index.css";

export default function Contact() {
  return (
    <div className="w-[700px] h-[896px] p-[47px] flex flex-col contact">
      <h3 className="flex text-[#2E0249] mb-[10px]">I'm interested in...</h3>
      <Form />
    </div>
  );
}
