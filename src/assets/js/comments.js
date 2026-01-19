import { escapeHtml, formatTime } from "./utils.js";

// Kurzformen für DOM-Methoden
const qs = (el, sel) => el.querySelector(sel);
const now = () => new Date().toISOString();
const id = () =>
  crypto?.randomUUID?.() ??
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const comments = (book) => (book.comments ??= []);

// SVG für das Schließen-Symbol
function closeSvg() {
  return /* html */ `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round"
      class="lucide lucide-x-icon lucide-x close-icon">
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  `;
}

// Einzelnes Kommentar-Item rendern
function commentItem(c) {
  return /* html */ `
    <li class="book-comment">
      <div class="book-comment-header">
        <div class="book-comment-header-info">
          <strong class="book-comment-name">${escapeHtml(c.name)}</strong>
          <span class="book-comment-time">${formatTime(c.createdAt)}</span>
        </div>

        <button type="button" class="book-comment-delete"
          data-comment-id="${escapeHtml(c.id)}" aria-label="Kommentar löschen" title="Löschen">
          ${closeSvg()}
        </button>
      </div>

      <p class="book-comment-text">${escapeHtml(c.comment)}</p>
    </li>
  `;
}

// Alle Kommentare rendern
export function renderComments(book, listEl) {
  const list = comments(book);

  listEl.innerHTML =
    list.length === 0
      ? `<li class="book-comment-empty">Dieses Buch hat bisher noch keinen Kommentar.</li>`
      : list.map(commentItem).join("");
}

// Kommentare holen
function getCommentDom(cardEl) {
  const nameInput = qs(cardEl, ".book-comment-name-input");
  const textInput = qs(cardEl, ".book-comment-text-input");
  const listEl = qs(cardEl, ".book-comments-list");

  if (!nameInput || !textInput || !listEl) return null;

  return { nameInput, textInput, listEl };
}

// alte Kommentare normalisieren und vorbereiten
function normalizeComments(book) {
  let changed = false;

  for (const c of comments(book)) {
    if (!c.id) {
      c.id = id();
      changed = true;
    }
    if (!c.createdAt) {
      c.createdAt = now();
      changed = true;
    }
  }

  return changed;
}

// Kommentare hinzufügen
function handleAddComment({ book, nameInput, textInput, listEl, persist }) {
  const name = nameInput.value.trim();
  const text = textInput.value.trim();
  if (!name || !text) return;

  comments(book).push({
    id: id(),
    name,
    comment: text,
    createdAt: now(),
  });

  nameInput.value = "";
  textInput.value = "";

  persist?.();
  renderComments(book, listEl);
}

// Kommentare löschen
function handleDeleteComment({ book, listEl, idToDelete, persist }) {
  book.comments = comments(book).filter((c) => c.id !== idToDelete);

  persist?.();
  renderComments(book, listEl);
}

// Kommentare delegieren
function bindCommentEvents(cardEl, ctx) {
  cardEl.addEventListener("click", (e) => {
    const delBtn = e.target.closest("[data-comment-id]");
    if (delBtn) {
      handleDeleteComment({
        ...ctx,
        idToDelete: delBtn.dataset.commentId,
      });
      return;
    }

    const addBtn = e.target.closest(".book-comment-submit");
    if (addBtn) {
      handleAddComment(ctx);
    }
  });
}

// Puclic API zum Initialisieren
export function setupCommentForm(book, cardEl, persist) {
  const dom = getCommentDom(cardEl);
  if (!dom) return;

  if (cardEl.dataset.commentsBound === "1") {
    renderComments(book, dom.listEl);
    return;
  }
  cardEl.dataset.commentsBound = "1";

  if (normalizeComments(book)) persist?.();

  const ctx = { book, ...dom, persist };

  bindCommentEvents(cardEl, ctx);
  renderComments(book, dom.listEl);
}
