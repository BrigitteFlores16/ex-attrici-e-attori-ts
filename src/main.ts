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

//Milestone 4
//Crea una funzione getAllActresses che chiama:
//GET /actresses
//La funzione deve restituire un array di oggetti Actress.
//Può essere anche un array vuoto.
async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch("http://localhost:5000/actresses");

    if (!response.ok) {
      console.error(`Errore HTTP: ${response.status}`);
      return [];
    }

    const data = await response.json();

    return Array.isArray(data) ? data.filter(isActress) : [];
  } catch (error) {
    console.error("Errore nella richiesta API:", error);
    return [];
  }
}


  const allActresses = await getAllActresses();
  console.log(allActresses);

// Milestone 5
//Crea una funzione getActresses che riceve un array di numeri (gli id delle attrici).
//Per ogni id nell’array, usa la funzione getActress che hai creato nella Milestone 3 per recuperare l’attrice corrispondente.
//L'obiettivo è ottenere una lista di risultati in parallelo, quindi dovrai usare Promise.all.
//La funzione deve restituire un array contenente elementi di tipo Actress oppure null (se l’attrice non è stata trovata).
async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  return Promise.all(ids.map(getActress));
}

  const multipleActresses = await getActresses([1, 2, 3]);
  console.log(multipleActresses);
  
//BONUS 1
//Crea le funzioni:
//createActress
//updateActress
//Utilizza gli Utility Types:
//Omit: per creare un'attrice senza passare id, che verrà generato casualmente.
//Partial: per permettere l’aggiornamento di qualsiasi proprietà tranne id e name.
// Tipo per la creazione di una nuova attrice, escludendo l'ID che sarà generato


//BONUS 2
//Crea un tipo Actor, che estende Person con le seguenti differenze rispetto ad Actress:
//known_for: una tuple di 3 stringhe
//awards: array di una o due stringhe
//nationality: le stesse di Actress più:
//Scottish, New Zealand, Hong Kong, German, Canadian, Irish.
//Implementa anche le versioni getActor, getAllActors, getActors, createActor, updateActor.


//BONUS 3
//Crea la funzione createRandomCouple che usa getAllActresses e getAllActors per restituire un’array che ha sempre due elementi:
//al primo posto una Actress casuale e al secondo posto un Actor casuale.
