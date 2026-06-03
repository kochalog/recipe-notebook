(() => {
  const printButton = document.querySelector("[data-print]");
  if (printButton) {
    printButton.addEventListener("click", () => window.print());
  }

  const searchInput = document.querySelector("#recipe-search");
  const cards = [...document.querySelectorAll("[data-recipe-card]")];
  const count = document.querySelector(".recipe-count");

  if (!searchInput || cards.length === 0) {
    return;
  }

  const update = () => {
    const query = searchInput.value.trim().toLowerCase();
    let visible = 0;

    for (const card of cards) {
      const haystack = card.dataset.search || "";
      const match = query === "" || haystack.includes(query);
      card.hidden = !match;
      if (match) visible += 1;
    }

    if (count) {
      count.textContent = `${visible}件`;
    }
  };

  searchInput.addEventListener("input", update);
})();
