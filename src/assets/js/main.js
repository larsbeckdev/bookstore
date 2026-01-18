import { renderBooks } from "./books-ui.js";
import { toggleLike } from "./likes.js";

import { loadBooks, saveBooks } from "./storage.js";
import { books as fallbackBooks } from "./books.js";

const books = loadBooks(fallbackBooks);
const listEl = document.getElementById("book-card-list");

// Speichern der Buchliste in localStorage
function persist() {
  saveBooks(books);
}

// Event Delegation für Like-Buttons
listEl?.addEventListener("click", (e) => {
  const target = e.target instanceof Element ? e.target : null;
  const btn = target?.closest("[data-like-index]");
  if (!btn) return;

  const index = Number(btn.dataset.likeIndex);
  if (Number.isNaN(index)) return;

  toggleLike(books, index);
  render();
});

// Rerendern der Buchliste
function render() {
  if (!listEl) return;
  renderBooks(books, listEl, persist);
}

render();
