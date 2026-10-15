import { useState } from "react";

export default function StateExample() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  return (
  <>
    <label>
      First name:
      <input
        type="text"
        placeholder="Enter your first name"
        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
        value={formData.firstName}
        />
    </label>
    <label>
      Last name:
      <input
        type="text"
        placeholder="Enter your last name"
        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
        value={formData.lastName}
      />
    </label>
      <label>
        Email:
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          value={formData.email}
        />
      </label>
  </>
  );
}
