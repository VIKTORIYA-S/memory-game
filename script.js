let firstCard = null;
let moves = 0;
let pairs = 0;
let isLocked = false;

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    element.classList.add(className);
    element.textContent = text;
    return element;
}

const CARD_IMAGES = [
  "image1.jpg",
  "image2.jpg",
  "image3.png",
  "image4.jpg",
  "image5.png",
  "image6.jpg",
  "image7.png",
  "image8.png",
];

function createDeck() {
  const cards = [...CARD_IMAGES, ...CARD_IMAGES];
  return cards;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createLayout() {
  const header = createElement("header", "header", "");
  const btnNewGame = createElement("button", "btn-new-game", "Новая игра");
  const btnTable = createElement("button", "btn-table", "Таблица лидеров");
  const counter = createElement("div", "counter", "");
  const movesElement = createElement("span", "moves", "Ходы: 0");
  const pairsElement = createElement("span", "pairs", "Пары: 0 из 8");
  const field = createElement("div", "field", "");

  header.append(btnNewGame, btnTable);
  counter.append(movesElement, pairsElement);
  document.body.append(header, counter, field);
  return { field, movesElement, pairsElement };
}

const { field, movesElement, pairsElement } = createLayout();
renderCards(field, shuffle(createDeck()), movesElement, pairsElement);

function renderCards(container, cards, movesElement, pairsElement) {
  cards.forEach((card) => {
    const cardImage = createElement("div", "card", "");
    cardImage.dataset.image = card;
    container.append(cardImage);
    const img = createElement("img", "card-image", "");
    img.src = `images/${card}`;
    cardImage.append(img);

    cardImage.addEventListener("click", () => {
      if (isLocked === true || cardImage.classList.contains("open")) return;

      cardImage.classList.add("open");

      if (firstCard === null) {
        firstCard = cardImage;
      } else {
        moves++;
        movesElement.textContent = `Ходы: ${moves}`;
        if (firstCard.dataset.image === cardImage.dataset.image) {
          pairs++;
          pairsElement.textContent = `Пары: ${pairs} из 8`;
        } else {
          const previousCard = firstCard;
          isLocked = true;
          setTimeout(() => {
            previousCard.classList.remove("open");
            cardImage.classList.remove("open");
            isLocked = false;
          }, 1000);
        }
        firstCard = null;
      }
    });
  });
}

