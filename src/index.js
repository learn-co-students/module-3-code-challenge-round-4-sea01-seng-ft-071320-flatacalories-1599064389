// Onload functions
fetchAndRenderAllCharacters();
initMouseUpEvent();
initSubmitEvent();

// Event handling
function initMouseUpEvent() {
  // MouseUp replaces click here for performance speed
  document.addEventListener("mouseup", handleMouseUpEvent);
}

function initSubmitEvent() {
  document.addEventListener("submit", handleSubmitEvent);
}

function handleMouseUpEvent(event) {
  if (event.target.matches("#character-bar > span")) {
    displayCharacter(event.target.dataset.characterId);
  } else if (event.target.matches(".reset-calories")) {
    const characterCard = event.target.parentElement;
    const characterId = characterCard.dataset.characterId;

    updateCalories(characterCard, 0);
    patchCalories(characterId, 0);
  }
}

function handleSubmitEvent(event) {
  if (event.target.matches(".calories-form")) {
    event.preventDefault();

    const characterCard = event.target.parentElement;
    const characterId = characterCard.dataset.characterId;
    const caloriesSubmitted = +event.target.calories.value;
    const currentCalories = +characterCard
      .getElementsByClassName("calories")[0]
      .textContent.split(" ")[0];
    const newCalories = caloriesSubmitted + currentCalories;

    event.target.calories.value = ""; // Clear the input field on submit

    updateCalories(characterCard, newCalories); // Update front end
    patchCalories(characterId, newCalories); // Update back end
  }
}

// Basic functionality
function displayCharacter(characterId) {
  const characterDiv = document.querySelector(
    `#detailed-info > div[data-character-id="${characterId}"]`
  );

  const currentCharacter = document.getElementsByClassName("shown")[0];

  if (!!currentCharacter) {
    currentCharacter.classList.remove("shown");
    currentCharacter.classList.add("hidden");
  }

  characterDiv.classList.remove("hidden");
  characterDiv.classList.add("shown");
}

// API call handling
function fetchAndRenderAllCharacters() {
  fetch("http://localhost:3000/characters")
    .then((resp) => resp.json())
    .then(renderCharacters);
}

function patchCalories(characterId, calories) {
  // Would be better to build custom handling for this to send a request
  //   to INCREASE the current calories instead of just bare updating calories
  //   in case someone sends multiple requests and they're processed out of order
  const configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ calories: calories }),
  };

  fetch(`http://localhost:3000/characters/${characterId}`, configObj)
    .then((resp) => resp.json())
    .catch(console.log);
}

// Front end rendering and updating
function renderCharacters(characters) {
  for (character of characters) {
    renderCharacterToCharacterBar(character);
    renderCharacterToDetailedInfo(character);
  }

  displayCharacter(1);
}

function renderCharacterToCharacterBar(character) {
  const characterBar = document.getElementById("character-bar");

  const characterName = document.createElement("span");
  characterName.dataset.characterId = character.id;
  characterName.textContent = character.name;

  characterBar.appendChild(characterName);
}

function renderCharacterToDetailedInfo(character) {
  const detailedInfo = document.getElementById("detailed-info");

  const characterInfo = document.createElement("div");
  characterInfo.dataset.characterId = character.id;
  characterInfo.className = "hidden";

  characterInfo.innerHTML = `
    <p id="name">${character.name}</p>
    <img
      class="image"
      src="${character.image}"
    />
    <h4>Total Calories: <span class="calories">${character.calories} Calories</span></h4>
    <form class="calories-form">
      <input type="hidden" value="Character's id" id="${character.id}" />
      <input type="text" placeholder="Enter Calories" name="calories" />
      <input type="submit" value="Add Calories" />
    </form>
    <button class="reset-calories">Reset Calories</button>
  `;

  detailedInfo.appendChild(characterInfo);
}

function updateCalories(characterCard, calories) {
  const caloriesSpan = characterCard.getElementsByClassName("calories")[0];

  caloriesSpan.textContent = `${calories} Calories`;
}
