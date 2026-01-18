import { bookCard } from "./templates.js";
import { setupCommentForm } from "./comments.js";

export function renderBooks(books, listEl) {
  listEl.innerHTML = "";

  for (let i = 0; i < books.length; i++) {
    listEl.innerHTML += bookCard(books[i], i);
  }

  const cards = listEl.querySelectorAll(".book-card");
  cards.forEach((cardEl, index) => {
    setupCommentForm(books[index], cardEl);
  });
}
