function fetchPOSTcalori(newcalories) {
  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCalories),
  };
  fetch(`CHARECTERURL/${character.id}`, options);
}
