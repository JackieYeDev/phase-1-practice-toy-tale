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

  const submitButton = document.querySelector('div form input.submit');
  document.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.querySelector('[name="name"]').value;
    const image = document.querySelector('[name="image"]').value;
    const array = []
    fetch('http://localhost:3000/toys/', POSTConfiguration(name, image))
      .catch((error) => console.error(error))
      .then((res) => res.json())
      // TODO
      // For some reason calling createCard creates a blank card.
      // Need to fix for a more elegant solution.
      //.then((data) => createCard(array.push(data)))
      .then((data) => {
        const toyCollection = document.querySelector('div#toy-collection');
        const card = document.createElement('div');
        const h2 = document.createElement('h2');
        const img = document.createElement('img');
        const p = document.createElement('p');
        const button = document.createElement('button');

        card.className = "card";
        img.className = "toy-avatar";
        h2.innerText = data.name;
        img.src = data.image;
        p.innerText = `${data.likes} Likes`;
        button.setAttribute('id', `${data.id}`);
        button.className = 'like-btn'
        button.innerText = `Like ❤️`;

        // Add event listener to button
        button.addEventListener('click', () => {
          const currentNumberOfLikes = parseInt(p.innerText.split(" ")[0])
          fetch(`http://localhost:3000/toys/${button.id}`, PATCHConfiguration(currentNumberOfLikes + 1))
            .then((res) => res.json())
            .then((data) =>  p.innerText = `${data['likes']} Likes`)
        });

        card.appendChild(h2)
        card.appendChild(img)
        card.appendChild(p)
        card.appendChild(button);
        toyCollection.append(card);
      });
  })

  fetch('http://localhost:3000/toys/')
    .catch((error) => console.error(error))
    .then((res) => res.json())
    .then((data) => createCard(data))
});

function createCard(data) {
  // Unpack data
  const response = Object.values(data)
  const toyCollection = document.querySelector('div#toy-collection')
  response.forEach(element => {
    // Create elements
    const card = document.createElement('div');
    const h2 = document.createElement('h2');
    const img = document.createElement('img');
    const p = document.createElement('p');
    const button = document.createElement('button');

    // Add attributes
    card.className = "card";
    img.className = "toy-avatar";
    h2.innerText = element.name;
    img.src = element.image;
    p.innerText = `${element.likes} Likes`;
    button.setAttribute('id', `${element.id}`);
    button.className = 'like-btn'
    button.innerText = `Like ❤️`;

    // Add event listener to button
    button.addEventListener('click', () => {
      const currentNumberOfLikes = parseInt(p.innerText.split(" ")[0])
      fetch(`http://localhost:3000/toys/${button.id}`, PATCHConfiguration(currentNumberOfLikes + 1))
        .then((res) => res.json())
        .then((data) =>  p.innerText = `${data['likes']} Likes`)
    })

    // Append elements
    card.appendChild(h2)
    card.appendChild(img)
    card.appendChild(p)
    card.appendChild(button);
    toyCollection.appendChild(card);
  });
};

/* 
"name": "Jessie",
"image": "https://vignette.wikia.nocookie.net/p__/images/8/88/Jessie_Toy_Story_3.png/revision/latest?cb=20161023024601&path-prefix=protagonist",
"likes": 0,
*/

const POSTConfiguration = function(name, image){
  return {
    method: "POST",  
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },

    body: JSON.stringify({
      "name": name,
      "image": image,
      "likes": 0
    })
  }
};

const PATCHConfiguration = function (newNumberOfLikes) {
  return {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "applicaiton/json"
    },
    body: JSON.stringify({
      "likes": newNumberOfLikes
    })
  }
};