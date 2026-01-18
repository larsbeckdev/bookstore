document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "bookapp_books";
  const listEl = document.getElementById("book-card-list");

  // ---------- Helpers ----------
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function formatTime(dateString) {
    if (!dateString) return ""; // falls createdAt fehlt
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return ""; // invalid date absichern

    const diff = Math.floor((Date.now() - date.getTime()) / 1000);

    if (diff < 60) return "gerade eben";
    if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min.`;
    if (diff < 86400) return `vor ${Math.floor(diff / 3600)} Std.`;

    return date.toLocaleDateString("de-DE");
  }

  function normalizeBooks(data) {
    // sorgt dafür, dass alte Kommentare ohne createdAt trotzdem laufen
    for (const b of data) {
      if (!Array.isArray(b.comments)) b.comments = [];
      for (const c of b.comments) {
        if (!c.createdAt) c.createdAt = new Date().toISOString();
      }
      if (typeof b.likes !== "number") b.likes = 0;
      if (typeof b.liked !== "boolean") b.liked = false;
    }
    return data;
  }

  function loadBooks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return normalizeBooks(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  function saveBooks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }

  // ---------- Deine Datenquelle ----------
  // WICHTIG: "books" muss schon existieren (dein Array).
  // Wenn localStorage Daten hat, überschreiben wir initial die books damit:
  const stored = loadBooks();
  if (stored) {
    books = stored; // falls books bei dir als let books = [...] definiert ist
  } else {
    // Falls keine gespeicherten Daten: trotzdem normalisieren + speichern
    books = normalizeBooks(books);
    saveBooks();
  }

  // ---------- Kommentare rendern ----------
  function renderComments(book, container) {
    container.innerHTML = "";

    book.comments.forEach((c) => {
      const li = document.createElement("li");
      li.className = "book-comment";

      li.innerHTML = /* html */ `
        <div class="book-comment-header">
          <strong class="book-comment-name">${escapeHtml(c.name)}</strong>
          <span class="book-comment-time">${escapeHtml(formatTime(c.createdAt))}</span>
        </div>
        <p class="book-comment-text">${escapeHtml(c.comment)}</p>
      `;

      container.appendChild(li);
    });
  }

  // ---------- Kommentar Formular ----------
  function setupCommentForm(book, cardEl) {
    const nameInput = cardEl.querySelector(".book-comment-name-input");
    const textInput = cardEl.querySelector(".book-comment-text-input");
    const submitBtn = cardEl.querySelector(".book-comment-submit");
    const commentsListEl = cardEl.querySelector(".book-comments-list");

    if (!nameInput || !textInput || !submitBtn || !commentsListEl) return;

    // (optional) Enter = senden (ohne Shift) im textarea
    textInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submitBtn.click();
      }
    });

    // Listener setzen (bei deinem aktuellen Ansatz eigentlich nicht nötig,
    // weil du die Buttons bei jedem render neu erzeugst - aber schadet nicht)
    if (submitBtn.dataset.bound === "1") return;
    submitBtn.dataset.bound = "1";

    submitBtn.addEventListener("click", () => {
      const name = nameInput.value.trim();
      const text = textInput.value.trim();
      if (!name || !text) return;

      book.comments.push({
        name,
        comment: text,
        createdAt: new Date().toISOString(),
      });

      saveBooks(); // ✅ localStorage

      nameInput.value = "";
      textInput.value = "";

      renderComments(book, commentsListEl);
    });

    renderComments(book, commentsListEl);
  }

  // ---------- Render Books ----------
  function renderBooks() {
    listEl.innerHTML = "";

    for (let i = 0; i < books.length; i++) {
      listEl.innerHTML += bookCard(books[i], i);
    }

    // nach dem Rendern pro Card: Kommentare + Form anbinden
    const cards = listEl.querySelectorAll(".book-card");
    cards.forEach((cardEl, index) => {
      setupCommentForm(books[index], cardEl);
    });
  }

  // ---------- Like toggle (mit storage) ----------
  window.toggleLike = function toggleLike(index) {
    books[index].liked = !books[index].liked;

    if (books[index].liked) books[index].likes++;
    else books[index].likes--;

    saveBooks(); // ✅ localStorage
    renderBooks();
  };

  // ---------- initial ----------
  renderBooks();
});
