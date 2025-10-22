// frontend/src/components/TestComponent.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const TestComponent = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}test/`)
      .then(res => setMessage(res.data.message))
      .catch(err => console.error(err));
  }, []);

  return <h1>{message || "Loading..."}</h1>;
};

export default TestComponent;
