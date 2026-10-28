import { Profiler, useState, type ProfilerOnRenderCallback } from "react";
import Account from "./Account";

const onRenderCallback: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime,
) => {
  console.log("🚀 ~ id:", id);
  console.log("🚀 ~ phase:", phase);
  console.log("🚀 ~ actualDuration:", actualDuration);
  console.log("🚀 ~ baseDuration:", baseDuration);
  console.log("🚀 ~ startTime:", startTime);
  console.log("🚀 ~ commitTime:", commitTime);
};

const Information = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Profiler id="Information" onRender={onRenderCallback}>
      <label>
        First Name:
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </label>
      <br />
      <label>
        Last name:
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </label>
      <br />
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>

      <h2>Account information</h2>
      <Account email={email} password={password} />
    </Profiler>
  )
}

export default Information
