import { escapeHtml, formatTime } from "./utils.js";

export function closeSvg() {
  return /* html */ `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round" 
      class="lucide lucide-x-icon lucide-x close-icon">
      <path d="M18 6 6 18"/>
      <path d="m6 6 12 12"/>
    </svg>
  `;
}

function ensureCommentIds(book) {
  if (!Array.isArray(book.comments)) book.comments = [];
  let changed = false;

  for (const c of book.comments) {
    if (!c.id) {
      c.id =
        crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      changed = true;
    }
  }

  return changed;
}

export function renderComments(book, container) {
  container.innerHTML = "";

  (book.comments ?? []).forEach((c) => {
    const li = document.createElement("li");
    li.className = "book-comment";

    li.innerHTML = /* html */ `
      <div class="book-comment-header">
        <div class="book-comment-header-info">
          <strong class="book-comment-name">${escapeHtml(c.name)}</strong>
          <span class="book-comment-time">${formatTime(c.createdAt)}</span>
        </div>

        <button
          type="button"
          class="book-comment-delete"
          data-comment-id="${escapeHtml(c.id)}"
          data-comment-id="${escapeHtml(c.id)}"
          aria-label="Kommentar löschen"
          title="Löschen"
        >
          ${closeSvg()}
        </button>
      </div>

      <p class="book-comment-text">${escapeHtml(c.comment)}</p>
    `;

    container.appendChild(li);
  });
}

//  @param {object} book - das Buchobjekt (Referenz aus books[])
//  @param {HTMLElement} cardEl - Card DOM
//  @param {(updatedBooks?: any)=>void} persist - Callback zum Speichern in localStorage

export function setupCommentForm(book, cardEl, persist) {
  const nameInput = cardEl.querySelector(".book-comment-name-input");
  const textInput = cardEl.querySelector(".book-comment-text-input");
  const submitBtn = cardEl.querySelector(".book-comment-submit");
  const commentsListEl = cardEl.querySelector(".book-comments-list");

  if (!nameInput || !textInput || !submitBtn || !commentsListEl) return;

  // IDs nachziehen
  const idsChanged = ensureCommentIds(book);
  if (idsChanged) persist?.();

  // einmalig binden
  if (cardEl.dataset.commentsBound === "1") {
    renderComments(book, commentsListEl);
    return;
  }
  cardEl.dataset.commentsBound = "1";

  // Kommentar hinzufügen
  submitBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    if (!name || !text) return;

    if (!Array.isArray(book.comments)) book.comments = [];

    book.comments.push({
      id:
        crypto?.randomUUID?.() ??
        `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      comment: text,
      createdAt: new Date().toISOString(),
    });

    nameInput.value = "";
    textInput.value = "";

    persist?.();
    renderComments(book, commentsListEl);
  });

  // Kommentar löschen
  commentsListEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-comment-id]");
    if (!btn) return;

    const id = btn.dataset.commentId;
    if (!id || !Array.isArray(book.comments)) return;

    book.comments = book.comments.filter((c) => c.id !== id);

    persist?.();
    renderComments(book, commentsListEl);
  });

  renderComments(book, commentsListEl);
}
