/** @format */

import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import Swal from "sweetalert2";

function AjouterEleve({ idclasse }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState("");
  const [base64Image, setBase64Image] = useState("");

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
    convertToBase64(selectedImage);
  };

  const convertToBase64 = async (image) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const base64 = await convertToBase64(image);
      const response = await axios.post("http://localhost:3001/upload", {
        firstName,
        lastName,
        image: base64,
        classe_id: idclasse,
      });
      console.log("Student added successfully:", response.data);
      // Reset form fields after successful submission
      setFirstName("");
      setLastName("");
      setImage("");
      setBase64Image("");
      Swal.fire({
        title: "Success!",
        text: `Student ${firstName} ${lastName} added successfully!`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error adding student:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while adding the student.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const openForm = () => {
    const formHtml = ReactDOMServer.renderToString(
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={handleFirstNameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={handleLastNameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            capture="camera"
            required
          />
          {base64Image && (
            <img
              src={base64Image}
              alt="student"
              width={200}
              height={200}
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
        <button type="submit">Add Student</button>
      </form>
    );

    Swal.fire({
      title: "Add Student",
      html: formHtml,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: "Close",
    });
  };

  return (
    <div>
      <button onClick={openForm}>Add Student</button>
    </div>
  );
}

export default AjouterEleve;
