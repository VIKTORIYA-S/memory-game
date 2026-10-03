let firstCard = null;
let moves = 0;
let pairs = 0;
let isLocked = false;
let hideTimer = null;

function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) {
      element.classList.add(className);
    }
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

const STORAGE_KEY = "memory-results";

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
  return { field, movesElement, pairsElement, btnNewGame, btnTable };
}

const { field, movesElement, pairsElement, btnNewGame, btnTable } = createLayout();
startGame(field, movesElement, pairsElement);

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

          if (pairs === 8) {
            saveResult(moves);
            showWinModal(moves);
          }
        } else {
          const previousCard = firstCard;
          isLocked = true;
          hideTimer = setTimeout(() => {
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

function startGame(field, movesElement, pairsElement) {
  clearTimeout(hideTimer);
  firstCard = null;
  moves = 0;
  pairs = 0;
  isLocked = false;
  movesElement.textContent = 'Ходы: 0';
  pairsElement.textContent = 'Пары: 0 из 8';
  field.replaceChildren();
  renderCards(field, shuffle(createDeck()), movesElement, pairsElement);
}

btnNewGame.addEventListener("click", () => {
  startGame(field, movesElement, pairsElement);
});


function openModal(content) {
  const overlay = createElement("div", "modal-overlay", "");
  const modal = createElement("div", "modal", "");
  const closeButton = createElement("button", "modal-close", "Закрыть");
  modal.append(content, closeButton);
  overlay.append(modal);
  closeButton.addEventListener("click", closeModal);
  document.body.append(overlay);
  document.body.style.overflow = "hidden";

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeModal();
    }
  });
  document.addEventListener("keydown", handleEscape);
}

btnTable.addEventListener("click", () => {
  const content = createElement("div", "modal-content", "Тест");
  const table = createElement("table", "leaderboard-table", "");

  openModal(content);
});

function closeModal() {
  const overlay = document.querySelector(".modal-overlay");
  if (overlay) overlay.remove();
  document.removeEventListener("keydown", handleEscape);
  document.body.style.overflow = "";
}

function handleEscape(event) {
  document.addEventListener("keydown", handleEscape);
  if (event.key === "Escape") {
    closeModal();
  }
}


function showWinModal(number) {
  const modalTitle = createElement("h2", "modal-title", "Победа!");
  const modalText = createElement("p", "modal-text", `Ходов: ${number}`);
  const modalButton = createElement("button", "modal-button", "Новая игра");
  const winContent = createElement("div", "win-content", "");
  winContent.append(modalTitle, modalText, modalButton);
  modalButton.addEventListener("click", () => {
    closeModal();
    startGame(field, movesElement, pairsElement);
  });

  openModal(winContent);
}


function getResults() {
  try {
    const results = localStorage.getItem(STORAGE_KEY);
    if (!results) {
      return [];
    }
    return JSON.parse(results);
  } catch {
    return [];
  }
}


function saveResult(moves) {
  const list = getResults();
  list.push({ moves, date: Date.now()});
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}