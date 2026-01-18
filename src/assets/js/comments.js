import { escapeHtml, formatTime } from "./utils.js";

export function renderComments(book, container) {
  container.innerHTML = "";

  (book.comments ?? []).forEach((c) => {
    const li = document.createElement("li");
    li.className = "book-comment";

    li.innerHTML = /* html */ `
      <div class="book-comment-header">
        <strong class="book-comment-name">${escapeHtml(c.name)}</strong>
        <span class="book-comment-time">${formatTime(c.createdAt)}</span>
      </div>
      <p class="book-comment-text">${escapeHtml(c.comment)}</p>
    `;

    container.appendChild(li);
  });
}

export function setupCommentForm(book, cardEl) {
  const nameInput = cardEl.querySelector(".book-comment-name-input");
  const textInput = cardEl.querySelector(".book-comment-text-input");
  const submitBtn = cardEl.querySelector(".book-comment-submit");
  const commentsListEl = cardEl.querySelector(".book-comments-list");

  if (!nameInput || !textInput || !submitBtn || !commentsListEl) return;

  if (submitBtn.dataset.bound === "1") return;
  submitBtn.dataset.bound = "1";

  submitBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    if (!name || !text) return;

    if (!Array.isArray(book.comments)) book.comments = [];

    book.comments.push({
      name,
      comment: text,
      createdAt: new Date().toISOString(),
    });

    nameInput.value = "";
    textInput.value = "";

    renderComments(book, commentsListEl);
  });

  renderComments(book, commentsListEl);
}
