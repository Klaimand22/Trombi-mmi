import { useState } from "react";

function App() {
  // state
  const [fruits, setFruits] = useState([
    { id: 1, name: "Pomme" },
    { id: 2, name: "Poire" },
    { id: 3, name: "Fraise" },
    { id: 4, name: "Banane" },
    { id: 5, name: "Cerise" },
    { id: 6, name: "Orange" },
    { id: 7, name: "Kiwi" },
  ]);

  const [nouveauFruit, setNouveauFruit] = useState("");

  // comportement

  const handleDelete = (id) => {
    console.log("Suppression");
    console.log(id);
    //1 copie du state
    const fruitsCopy = [...fruits];

    //2 modifier la copie

    const fruitsCopyUpdated = fruitsCopy.filter((fruit) => fruit.id !== id);

    //3 remplacement du state

    setFruits(fruitsCopyUpdated);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    //1 copie du state
    const fruitsCopy = [...fruits];

    //2 modifier la copie

    const id = new Date().getTime();
    const name = nouveauFruit;
    fruitsCopy.push({ id, name });

    //3 remplacement du state

    setFruits(fruitsCopy);
    setNouveauFruit("");
  };
  const handleChange = (event) => {
    setNouveauFruit(event.target.value);
  };
  // affichage

  return (
    <div>
      <h1>Listes de fruits</h1>
      <ul>
        {fruits.map((fruit) => (
          <li key={fruit.id}>
            {fruit.name}
            <button onClick={() => handleDelete(fruit.id)}>Supprimer</button>
          </li>
        ))}
      </ul>

      <form action="sumbit" onSubmit={handleSubmit}>
        <input
          value={nouveauFruit}
          type="text"
          placeholder="Ajouter un fruit"
          onChange={handleChange}
        />
        <button>Ajouter</button>
      </form>
    </div>
  );
}

export default App;
