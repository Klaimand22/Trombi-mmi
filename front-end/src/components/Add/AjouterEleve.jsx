import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
const params = new URLSearchParams(window.location.search);

function AjouterEleve() {
  const { idclasse } = useParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState("");
  const [base64Image, setBase64Image] = useState("");
  // récuperer classe_name dans l'url

  const classe_name = params.get("classe_name");
  console.log("classe_name", classe_name);
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleImageChange = async (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
    const compressedImage = await compressImage(selectedImage);
    convertToBase64(compressedImage);
  };

  const compressImage = (image) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg",
            0.8
          );
        };
      };
    });
  };

  const convertToBase64 = async (image) => {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const base64 = reader.result;
      setBase64Image(base64);
    };
    reader.onerror = (error) => {
      console.error("Error converting image to base64:", error);
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!firstName || !lastName || !image) {
      Swal.fire({
        title: "Erreur !",
        text: "Veuillez remplir tous les champs requis.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/upload", {
        firstName,
        lastName,
        image: base64Image,
        classe_id: idclasse,
      });

      console.log("Étudiant ajouté avec succès :", response.data);
      setFirstName("");
      setLastName("");
      setImage("");
      setBase64Image("");
      Swal.fire({
        title: "Succès !",
        text: `L'étudiant ${firstName} ${lastName} a été ajouté avec succès !`,
        icon: "success",
        confirmButtonText: "OK",
      });
      window.location.href = `/classes/${idclasse}`;
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'étudiant :", error);
      Swal.fire({
        title: "Erreur !",
        text: "Une erreur s'est produite lors de l'ajout de l'étudiant.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="app-size">
      <h1>Ajouter un étudiant dans la classe {classe_name}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">Prénom :</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={handleFirstNameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Nom :</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={handleLastNameChange}
            required
          />
        </div>
        <div>
          <label htmlFor="image">Image :</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
          {base64Image && (
            <img
              src={base64Image}
              alt="étudiant"
              width={200}
              height={200}
              style={{ objectFit: "cover" }}
            />
          )}
        </div>
        <button type="submit">Ajouter l'étudiant</button>
      </form>
      <a href={`/classes/${idclasse}`}>Retour à la liste des étudiants</a>
    </div>
  );
}

export default AjouterEleve;
