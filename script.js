import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://endorsement-app-61aa8-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings); // Initialize app - funkcija iz firebase baze funkcija. Inicijalizacija aka provjera aplikacije i za parametar dodajemo URL nase aplikacije
const database = getDatabase(app); // baza podataka kojoj smo kao parametar dodali našu applikaciju
const endInDB = ref(database, "Endorsement"); // referenca na nasu bazu podataka koju smo nazvali Endorsement

let textEl = document.getElementById("area");
const btnPublish = document.getElementById("publish");
let endEl = document.getElementById("endEl");
const deleteBtn = document.getElementById("delete");

// Funkcije
function resetTextArea() {
  textEl.value = "";
}

function addText(item) {
  // endEl.innerHTML += `<p>${text}</p>`; - ukoliko zelimo dodavat na taj element eventListener moramo koristit document.createElement
  let endID = item[0];
  let endValue = item[1];
  let newEnd = document.createElement("p"); // ide na document objekt
  newEnd.textContent = endValue; // prikaz nam je ono sta dodamo u parametar, tj currEndorsement koji je u onValue funkciji
  newEnd.addEventListener("dblclick", function () {
    // kad kliknemo na dodani tekst izbrisat ce se
    let exactLocationOfEndorsementDB = ref(database, `Endorsement/${endID}`);
    remove(exactLocationOfEndorsementDB);
  });
  endEl.append(newEnd);
}

function clearEndEl() {
  endEl.innerHTML = "";
}

/* ----------------------------------------------------------------------------------------------------*/
// Event listeneri
btnPublish.addEventListener("click", function () {
  let endorsement = textEl.value;

  push(endInDB, endorsement);

  resetTextArea();
});

deleteBtn.addEventListener("click", function () {
  endEl.innerHTML = "<p>No endorsements added yet</p>";
});

/* ----------------------------------------------------------------------------------------------------*/

onValue(endInDB, function (snapshot) {
  // funkcija onValue  u real timeu prati promjene u nasoj bazi podataka(Pokrece se prilikom svake promjene).Kao parametre umnosimo referencu na nasu bazu podataka
  // kada izbrisemo zadnji idtem da nam ne vraca error jer vise nema nicega nego tekst
  if (snapshot.exists()) {
    // snapshot.exists je firebase metoda za provjeru jel ima item u bazi podataka
    let endArray = Object.entries(snapshot.val()); // snapshot nam vraca objekt i pretvaramo ga u array da bi mogli loopat kroz njega.Object.values ( mozemo jos koristit keys, entries) ( ode stavljamo objekt koji pretvaramo)
    clearEndEl(); // cisti div s endorsementima nakon dodavanja endorsementa tako da se ne stackaju prilikom promjene
    for (let i = 0; i < endArray.length; i++) {
      let currEndorsement = endArray[i]; // object.entries nam dohvaca cili array tj ID i vrijednost
      let currEndID = currEndorsement[0]; // index 0 je ID
      let currEndValue = currEndorsement[1]; // index 1 je value
      addText(currEndorsement);
    }
  } else {
    endEl.innerHTML = "<p>No endorsements added yet</p>";
  }
});
