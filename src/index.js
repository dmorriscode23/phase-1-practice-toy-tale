let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const toyForm = document.querySelector('.add-toy-form');
  const toyCollection = document.getElementById("toy-collection");

  

  // Fetch and display toys
  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => createToyCard(toy));
      });
  }

  // Function to create and append toy card
  function createToyCard(toy) {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="like-${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(div);

    // Add event listener to like button
    div.querySelector('.like-btn').addEventListener('click', () => increaseLikes(toy));
  }

  // Function to add a new toy
  toyForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = event.target.name.value;
    const image = event.target.image.value;

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name,
        image,
        likes: 0
      })
    })
    .then(response => response.json())
    .then(toy => createToyCard(toy));
  });

  // Function to increase likes
  function increaseLikes(toy) {
    const newLikes = toy.likes + 1;
    
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
      })
    })
    .then(response => response.json())
    .then(updatedToy => {
      document.querySelector(`#like-${toy.id}`).parentNode.querySelector('p').textContent = `${newLikes} Likes`;
      toy.likes = newLikes; // Update the likes in the local toy object to ensure consistency
    });
  }

  fetchToys();
});
