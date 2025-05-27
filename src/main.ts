//Milestone 1
//Crea un type alias Person per rappresentare una persona generica.
//Il tipo deve includere le seguenti proprietà:
//id: numero identificativo, non modificabile
//name: nome completo, stringa non modificabile
//birth_year: anno di nascita, numero
//death_year: anno di morte, numero opzionale
//biography: breve biografia, stringa
//image: URL dell'immagine, stringa

type Person = {
  readonly id: number;
  readonly name: string;
  birth_year: number;
  death_year?: number;
  biography: string;
  image: string;
};

//Milestone 2
//Crea un type alias Actress che oltre a tutte le proprietà di Person, aggiunge le seguenti proprietà:
//most_famous_movies: una tuple di 3 stringhe
//awards: una stringa
//nationality: una stringa tra un insieme definito di valori.
//Le nazionalità accettate sono: American, British, Australian, Israeli-American, South African, French, Indian, Israeli, Spanish, South Korean, Chinese.

type Actress = Person & {
  most_famous_movies: [string, string, string];
  awards: string;
  nationality: "American" | "British" | "Australian" | "Israeli-American" | 
              "South African" | "French" | "Indian" | "Israeli" | "Spanish" | 
              "South Korean" | "Chinese";
};
//Milestone 3
//Crea una funzione getActress che, dato un id, effettua una chiamata a:
//GET /actresses/:id
//La funzione deve restituire l’oggetto Actress, se esiste, oppure null se non trovato.
//Utilizza un type guard chiamato isActress per assicurarti che la struttura del dato ricevuto sia corretta.

async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`http://localhost:5000/actresses/${id}`);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return isActress(data) ? data : null;
  } catch (error) {
    console.error("Errore nella richiesta API:", error);
    return null;
  }
}


function isActress(obj: any): obj is Actress {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    typeof obj.birth_year === "number" &&
    (typeof obj.death_year === "number" || obj.death_year === undefined) &&
    typeof obj.biography === "string" &&
    typeof obj.image === "string" &&
    Array.isArray(obj.most_famous_movies) &&
    obj.most_famous_movies.length === 3 && 
    obj.most_famous_movies.every((movie: string) => typeof movie === "string") &&
    typeof obj.awards === "string" &&
    ["American", "British", "Australian", "Israeli-American", "South African", 
     "French", "Indian", "Israeli", "Spanish", "South Korean", "Chinese"]
      .includes(obj.nationality)
  );
}
const actress = await getActress(1);
  console.log(actress);

