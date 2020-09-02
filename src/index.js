const CHARECTERURL = "http://127.0.0.1:3001/characters";
fetchCharecters();
//FETCH
function fetchCharecters() {
  return fetch(CHARECTERURL)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((dataPiece) => {
        rendercharecter(dataPiece);
      });
    });
}

function rendercharecter(image) {
  title = document.querySelector("div#character-bar");
  title.textContent = image.name;

  imageA = document.querySelector("div > img#image");
  imageA.src = image.image;

  likesB = document.querySelector("span#calories");
  likesB.textContent = image.calories;
}
