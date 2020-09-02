let characterBar = document.querySelector('#character-bar')
let characterInfo = document.querySelector(".characterInfo")
let detailedInfo = document.querySelector("#detailed-info")




const fetchAllCharacters = () => {
fetch('http://localhost:3000/characters')
.then(res => res.json())
.then(json => json.forEach(characters => allCharacters(characters)))
}
fetchAllCharacters()

const allCharacters = (characters) => {
    let span = document.createElement('span')
  span.setAttribute("id", `${characters.id}`)
    span.innerHTML = `
    <td> ${characters.name}</td>
    `
    let name = document.querySelector('#name')
    let image = document.querySelector('#image')
    let h4 = document.querySelector('#calories') 
  

    name.innerText = characters.name
    image.src = characters.image
    h4.innerText = characters.calories
   
    characterBar.appendChild(span)

    span.addEventListener('click', (e) => switchChar(e, characters))
}
const switchChar = (e, characters) => {
    detailedInfo.innerHTML = `
    <p id="name">${characters.name}</p>
    <img id="image" src="${characters.image}">
    <h4>Total Calories: <span id="calories">${characters.calories}</span> </h4>
    <form id="calories-form">
    <input type="hidden" value="Character's id" id="characterId"/> <!-- Assign character id as a value here -->
    <input type="text" placeholder="Enter Calories" name="calories"/>
    <input type="submit" value="Add Calories"/>
</form>
<button id="reset-btn">Reset Calories</button>
     `
       let form = document.querySelector('#calories-form')
        console.log(form)
       form.addEventListener('submit', (e) => (addCalories(e, calories)))
    
}


const addCalories = (e, calories) => {
    e.preventDefault()
   let updatedcalories =  e.target.calories.value
    console.log(updatedcalories)
      fetch(`http://localhost:3000/characters/:id`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(calories)
    })
    .then(res => res.json())
    .then(json => console.log(json))
    
}

 
