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
  } else if (event.target.matches(".edit-name")) {
    toggleEditForm(event.target.parentElement.parentElement);
  } else if (event.target.matches("#create-character-toggle")) {
    toggleCreateForm();
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
  } else if (event.target.matches(".edit-form")) {
    event.preventDefault();

    const characterCard = event.target.parentElement;
    const characterId = characterCard.dataset.characterId;
    const characterName = event.target.name.value;

    updateName(characterCard, characterName);
    patchName(characterId, characterName);

    toggleEditForm(characterCard); // Close the character card after submit
  } else if (event.target.matches("#create-character-form")) {
    event.preventDefault();

    const character = {
      name: event.target.name.value,
      calories: 0,
      image: "assets/dummy.gif",
    };

    renderCharacterToCharacterBar(character);
    renderCharacterToDetailedInfo(character);
    postCharacter(character);

    // Clear the input field and reset the form
    event.target.name.value = "";
    // toggleCreateForm(); > commented out for now because there's no toggle button
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

function postCharacter(character) {
  const configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(character),
  };

  fetch("http://localhost:3000/characters/", configObj)
    .then((resp) => resp.json())
    .catch(console.log);
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

function patchName(characterId, name) {
  const configObj = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ name: name }),
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
    <p class="name">${character.name} <button class="edit-name">Edit Name</button></p>
    <form class="edit-form hidden">
      <p></p> <!-- Shh, this is here to make the spacing right -->
      <input type="text" value="${character.name}" placeholder="${character.name}" name="name" />
      <input type="submit" value="Update Name" />
      <button class="edit-name" form="">Close</button>
    </form>
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

function updateName(characterCard, name) {
  const nameElement = characterCard.getElementsByClassName("name")[0];
  const barNameElement = document.querySelector(
    `#character-bar > span[data-character-id="${characterCard.dataset.characterId}"`
  );

  const editButton = document.createElement("button");
  editButton.classList.add("edit-name");
  editButton.textContent = "Edit Name";

  nameElement.textContent = `${name} `;
  nameElement.appendChild(editButton);
  barNameElement.textContent = name;
}

function toggleEditForm(characterCard) {
  const nameElement = characterCard.getElementsByClassName("name")[0];
  const editForm = characterCard.querySelector("form.edit-form");

  if (editForm.classList.contains("hidden")) {
    nameElement.classList.add("hidden");
    editForm.classList.remove("hidden");
  } else {
    nameElement.classList.remove("hidden");
    editForm.classList.add("hidden");
  }
}

// TODO: Create an actual toggle button on the front end
function toggleCreateForm() {
  const createForm = document.getElementById("create-character-form");

  if (createForm.classList.contains("hidden")) {
    createForm.classList.remove("hidden");
  } else {
    createForm.classList.add("hidden");
  }
}
