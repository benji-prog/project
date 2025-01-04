window.onload = async function () {

    const modal = document.getElementById('designGuideModal');
    modal.style.display = 'flex';

    document.getElementById('yes').onclick = function () {
      window.open('design/design_guides.pdf', '_blank');
      modal.style.display = 'none';
    };

    document.getElementById('no').onclick = function () {
      modal.style.display = 'none';
    };

    try {
        const response = await fetch('data.json');
        const data = await response.json();

        const eventList = document.querySelector("#esemenyek ul");
        data.events.forEach(event => {
            const li = document.createElement("li");
            li.textContent = event.title;
            li.onclick = function () {
                showEvent(event.title, event.description, event.image, event.moreInfo);
            };
            eventList.appendChild(li);
        });

        const peopleList = document.querySelector("#szemelyek ul");
        data.people.forEach(person => {
            const li = document.createElement("li");
            li.textContent = person.name;
            li.onclick = function () {
                showPerson(person.name, person.description, person.image, person.moreInfo);
            };
            peopleList.appendChild(li);
        });

        const locationList = document.querySelector("#helyszinek ul");
        data.locations.forEach(location => {
            const li = document.createElement("li");
            li.textContent = location.name;

            li.onclick = function () {
                showLocation(location.name, location.description, location.image, location.moreInfo);
                showMap(location.name, location.lat, location.lng);
            };
        
            locationList.appendChild(li);
        });      
        
        
        const listItems = document.querySelectorAll("#section-list li");

        listItems.forEach((item) => {
        item.addEventListener("click", () => {

            listItems.forEach((li) => li.classList.remove("active"));

            item.classList.add("active");
  });
});

    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

function showEvent(title, description, image, moreInfo) {

    document.getElementById("event-title").innerHTML = title;
    document.getElementById("event-description").innerHTML = description;
    document.getElementById("event-image").src = "kepek/" + image;
    document.getElementById("event-image").classList.remove("hidden");
    document.getElementById("event-button").classList.remove("hidden");

    document.getElementById("event-more-details").innerHTML = moreInfo;

    document.getElementById("event-more").classList.remove("show");
}

function toggleMoreInfo() {
    const eventMore = document.getElementById("event-more");
    eventMore.classList.toggle("show");
}

function showPerson(name, description, image, moreInfo) {

    document.getElementById("person-name").innerHTML = name;
    document.getElementById("person-description").innerHTML = description;
    document.getElementById("person-image").src = "kepek/" + image;
    document.getElementById("person-image").classList.remove("hidden");
    document.getElementById("person-button").classList.remove("hidden");

    document.getElementById("person-more-details").innerHTML = moreInfo;

    document.getElementById("person-more").classList.remove("show");
}

function togglePersonMoreInfo() {
    const personMore = document.getElementById("person-more");
    personMore.classList.toggle("show");
}

function showLocation(name, description, image, moreInfo) {

    document.getElementById("location-name").innerHTML = name;
    document.getElementById("location-description").innerHTML = description;
    document.getElementById("location-image").src = "kepek/" + image;
    document.getElementById("location-image").classList.remove("hidden");
    document.getElementById("location-button").classList.remove("hidden");

    document.getElementById("location-more-details").innerHTML = moreInfo;

    document.getElementById("location-more").classList.remove("show");
}

function toggleLocationMoreInfo() {
    const locationMore = document.getElementById("location-more");
    locationMore.classList.toggle("show");
}

let map;

function initializeMap() {
    map = L.map('map').setView([47.497913, 19.040236], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
}

function showMap(name, lat, lng) {
    document.getElementById("map").classList.remove("hidden");
    if (!map) initializeMap();

    map.setView([lat, lng], 13);

    L.marker([lat, lng])
        .addTo(map)
        .bindPopup(`<b>${name}</b><br>Lat: ${lat}, Lng: ${lng}`)
        .openPopup();
}

window.onscroll = function() {
    const button = document.querySelector('.scroll-up');
    
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      button.style.display = "block";
    } else {
      button.style.display = "none";
    }
  };

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.navbar a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      window.scrollTo({
        top: targetElement.offsetTop - document.querySelector('.navbar').offsetHeight,
        behavior: 'smooth'
      });
    });
  });

  const images = [
    "kepek/elszaval.jpg", "kepek/elszaval.jpg",
    "kepek/petofi.jpg", "kepek/petofi.jpg",
    "kepek/12pont.jpg", "kepek/12pont.jpg",
    "kepek/szechenyi.jpg", "kepek/szechenyi.jpg",
];

let shuffledImages = shuffle([...images]);
let flippedCards = [];
let matchedPairs = new Set();
let matchedCards = 0;
let popupDisabled = false;

const gameBoard = document.getElementById("game-board");

shuffledImages.forEach((image, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.index = index;

    const img = document.createElement("img");
    img.src = image;
    card.appendChild(img);

    card.addEventListener("click", () => flipCard(card));

    gameBoard.appendChild(card);
});

function flipCard(card) {
    if (matchedPairs.has(card) || flippedCards.includes(card)) {
        return;
      }

    if (flippedCards.length === 2) return;
    card.classList.add("flipped");
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.querySelector("img").src === secondCard.querySelector("img").src) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        matchedPairs.add(firstCard);
        matchedPairs.add(secondCard);
        matchedCards++;
        flippedCards = [];
        if (matchedCards === images.length / 2) {
            showWinModal();
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            flippedCards = [];
        }, 1000);
    }
}

function showWinModal() { 
    if (!popupDisabled) {
        const modal = document.getElementById("win-modal");
        modal.style.display = "flex";
    } else {
        const belowButton = document.getElementById("play-again-below");
        belowButton.classList.remove("hidden");
        belowButton.classList.add("nothidden");
    }
}

document.getElementById("play-again-button").addEventListener("click", restartGame);

document.getElementById("close-modal").addEventListener("click", () => {
    popupDisabled = true;
    const modal = document.getElementById("win-modal");
    const belowButton = document.getElementById("play-again-below");

    modal.style.display = "none";
    belowButton.classList.remove("hidden");
    belowButton.classList.add("nothidden");
});


document.getElementById("play-again-below").addEventListener("click", () => {
    const belowButton = document.getElementById("play-again-below");
    belowButton.classList.add("hidden");
    belowButton.classList.remove("nothidden");
    restartGame();
    popupDisabled = false;
});


function restartGame() {
    const modal = document.getElementById("win-modal");
    const belowButton = document.getElementById("play-again-below");

    if (modal) {
        modal.style.display = "none";
    }

    belowButton.classList.add("hidden");
    belowButton.classList.remove("nothidden");

    matchedCards = 0;
    flippedCards = [];
    matchedPairs = new Set();

    shuffledImages = shuffle([...images]);

    gameBoard.innerHTML = "";

    shuffledImages.forEach((image, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.index = index;

        const img = document.createElement("img");
        img.src = image;
        card.appendChild(img);

        card.addEventListener("click", () => flipCard(card));

        gameBoard.appendChild(card);
    });
}

function shuffle(array) {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
