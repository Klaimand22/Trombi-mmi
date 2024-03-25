import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AjouterEleve = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [image, setImage] = useState('');
  const [base64Image, setBase64Image] = useState('');
  const { idclasse } = useParams();

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

  const convertToBase64 = (image) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      setBase64Image(reader.result);
    };
    reader.onerror = (error) => {
      console.error('Error converting image to base64: ', error);
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/upload', {
        firstName,
        lastName,
        image: base64Image,
        classe_id: idclasse,
      });
      console.log('Student added successfully:', response.data);
      // Reset form fields after successful submission
      setFirstName('');
      setLastName('');
      setImage('');
      setBase64Image('');
      alert(`l'élève ${firstName} ${lastName} a été ajouté avec succès !`);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  return (
    <div>
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
          capture="camera" // Ajout de l'attribut capture pour utiliser la caméra
          required
        />

        {/* Ajouter un aperçu de l'image */}
        {base64Image && (
          <img
            src={base64Image}
            alt="student"
            width={200}
            height={200}
            style={{ objectFit: 'cover' }}
          />
        )}
      </div>
      <button type="submit">Add Student</button>
    </form>
    <a href={`/classes/${idclasse}`}> Retour à la classe</a>
    </div>
  );
};

export default AjouterEleve;
