/** @format */

import React, { useEffect, useState } from "react";
import axios from "axios";

function Trombinoscope({ formationId, classId }) {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    const formationId = 1;
    const classId = 1;
    axios

      .get(`http://localhost:3001/trombinoscope/${formationId}/${classId}`)
      .then((response) => {
        setPersons(response.data);
        console.log("response.data", response.data);
        console.log("Information récupérée avec succès !", response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        console.log("Error fetching data:", error);
      });
  }, [formationId, classId]);

  return (
    <div>
      <h2>Trombinoscope</h2>
      <div className="person-list">
        {persons.map((person) => (
          <div key={person.person_id}>
            <img src={person.photo_url} alt={person.name} />
            <p>{person.name}</p>
            <p>{person.position}</p>
            <p>{person.class_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trombinoscope;
