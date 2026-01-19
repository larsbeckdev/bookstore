import { renderBooks } from "./books-ui.js";
import { toggleLike } from "./likes.js";
import { loadBooks, saveBooks } from "./storage.js";
import { books as fallbackBooks } from "./books.js";

let books;
let listEl;

// Bücher speichern
function persist() {
  saveBooks(books);
}

// Bücher rendern
function render() {
  if (!listEl) return;
  renderBooks(books, listEl, persist);
}

// Bücher initialisieren
window.initBooks = function () {
  books = loadBooks(fallbackBooks);
  listEl = document.getElementById("book-card-list");

  // Likes delegieren
  listEl?.addEventListener("click", (e) => {
    const target = e.target instanceof Element ? e.target : null;
    const btn = target?.closest("[data-like-index]");
    if (!btn) return;

    const index = Number(btn.dataset.likeIndex);
    if (Number.isNaN(index)) return;

    toggleLike(books, index);
    persist();
    render();
  });

  render();
};
