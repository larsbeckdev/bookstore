export function heartSvg() {
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
      class="lucide lucide-heart-icon lucide-heart heart-icon"
    >
      <path
        d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
      />
    </svg>
  `;
}

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

export function bookCard(book, index) {
  const cover = book.cover ?? "./src/assets/images/placeholder.png";
  const likedClass = book.liked ? "liked" : "";
  const year = new Date().getFullYear();

  const price = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(book.price);

  return /* html */ `
    <div class="book-card">
      <div class="book-card-header">
        <div class="book-card-header-heading">
          <h3>${book.name}</h3>
          <p>${book.author}</p>
        </div>

        <div class="like-container">
          <button
            type="button"
            class="like-btn ${likedClass}"
            data-like-index="${index}"
            aria-label="Gefällt mir"
          >
            <span>${book.likes}</span>
            ${heartSvg()}
          </button>
        </div>
      </div>

      <div class="book-card-main">
        <div class="book-cover-main-container">
          <div class="book-cover-container">
            <img
              src="${cover}"
              alt="Buchcover von ${book.name}"
              class="book-cover"
            />
          </div>

          <div class="book-copyright-container">
            <p class="book-copyright">
              Copyright © ${year} ${book.author}
            </p>
          </div>
        </div>

        <div class="book-price-container">
          <p class="book-price">${price}</p>
          <span class="currency">${book.currency}</span>
        </div>

        <div class="book-details">
          <p class="book-genre">Kategorie: ${book.genre}</p>
          <p class="book-published-year">
            Veröffentlicht: ${book.publishedYear}
          </p>
        </div>
      </div>

      <div class="book-card-footer">
        <div class="book-card-footer-inner">
          <button type="button" class="add-to-cart-btn">
            In den Warenkorb
          </button>

          <div class="book-comments-section">
            <h4>Kommentare:</h4>

            <ul class="book-comments-list"></ul>

            <div class="book-comment-form">
              <input
                class="book-comment-name-input"
                placeholder="Name"
                autocomplete="name"
              />
              <textarea
                class="book-comment-text-input"
                placeholder="Kommentar"
              ></textarea>
              <button type="button" class="book-comment-submit">
                Absenden
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
