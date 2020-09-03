const CHARECTERURL = "http://127.0.0.1:3001/characters";
const Characterbar = document.querySelector("#character-bar");
const Charactercard = document.querySelector("#detailed-info");

//FUNCTION CALL

fetchallcharacters();
Listentoformcalorisubmit();
//LISTENERS
function Listentoformcalorisubmit() {
  Charactercard.addEventListener("submit", Handleoformcalorisubmit);
}

//HANDLERS

function Handleoformcalorisubmit(event) {
  event.preventDefault();

  const cInput = event.target.calorie;
  const c = cInput.value;

  //   console.log("hiii");
  const newcalories = {
    calories: c,
  };

  fetchPOSTcalori(newcalories);
  cInput.value = "";
}

//FETCHS

function fetchallcharacters() {
  fetch(CHARECTERURL)
    .then((response) => response.json())
    .then((AllCharacters) => rendercharacters(AllCharacters));
}

function fetchPOSTcalori(newcalories) {
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newcalories),
  };
  fetch(`http://127.0.0.1:3001/characters/`, options);
}

//DOM MANIPULATION

function rendercharacters(AllCharacters) {
  AllCharacters.forEach((AllCharacter) => appendCharacter(AllCharacter));
}

function appendCharacter(AllCharacter) {
  Characterbar.innerHTML += barcharacter(AllCharacter);
  Charactercard.innerHTML += cardcharecter(AllCharacter);
}

function barcharacter(AllCharacter) {
  return `<span> ${AllCharacter.name} </span>`;
}

function cardcharecter(AllCharacter) {
  return `<p id="name">${AllCharacter.name}</p>
  <img
    id="image"
    src="${AllCharacter.image}"
  />
  <h4>Total Calories: <span id="calories">${AllCharacter.calories}</span></h4>
  <form class="calories-form">
    <input type="hidden" value="Character's id" id=${AllCharacter.id} />
     
  <input type="text" placeholder="Enter Calories" name="calorie" />
    <input type="submit" value="Add Calories" />
  </form>
  <button id="reset-btn">Reset Calories</button> `;
}
