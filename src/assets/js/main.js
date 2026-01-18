import { renderBooks } from "./books-ui.js";
import { toggleLike } from "./likes.js";
import { books as initialBooks } from "./books.js";

const books = initialBooks; 
const listEl = document.getElementById("book-card-list");

function rerender() {
  if (!listEl) return;
  renderBooks(books, listEl);
}

listEl?.addEventListener("click", (e) => {
  const target = e.target instanceof Element ? e.target : null;
  const btn = target?.closest("[data-like-index]");
  if (!btn) return;

  const index = Number(btn.dataset.likeIndex);
  if (Number.isNaN(index)) return;

  toggleLike(books, index);
  rerender();
});

rerender();
