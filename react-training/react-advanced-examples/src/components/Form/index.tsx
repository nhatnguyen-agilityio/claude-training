import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAcceptPolicy, setIsAcceptPolicy] = useState(false);
  const [hobby, setHobby] = useState(["music", "reading"]);
  const [description, setDescription] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    navigate("/markdown");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name:
        <input type="text" name="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      <br />
      <label>
        Last Name:
        <input type="text" name="lastName" value={lastName} onChange={e => setLastname(e.target.value)} />
      </label>
      <br />
      <label>
        Phone Number:
        <input type="number" name="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
      </label>
      <br />
      <label>
        Email:
        <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <br />
      <label>
        Select your hobby:
        <select name="hobby" multiple={true} value={hobby} onChange={e => setHobby(Array.from(e.target.selectedOptions, option => option.value))}>
          <option value="sports">Sports</option>
          <option value="reading">Reading</option>
          <option value="music">Music</option>
          <option value="cooking">Cooking</option>
          <option value="traveling">Traveling</option>
        </select>
      </label>
      <br />
      <label>
        Description:
        <textarea name="description" value={description} onChange={e => setDescription(e.target.value)} />
      </label>
      <br />
      <label>
        Accept policy:
        <input type="checkbox" name="acceptPolicy" checked={isAcceptPolicy} onChange={e => setIsAcceptPolicy(e.target.checked)} />
      </label>
      <hr />
      <button type="submit">Submit</button>
    </form>
  )
}

export default Form
