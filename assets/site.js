(() => {
  const printButton = document.querySelector("[data-print]");
  if (printButton) {
    printButton.addEventListener("click", () => window.print());
  }

  const searchInput = document.querySelector("#recipe-search");
  const cards = [...document.querySelectorAll("[data-recipe-card]")];
  const count = document.querySelector(".recipe-count");
  const categoryButtons = [...document.querySelectorAll("[data-category-filter]")];
  let activeCategory = "all";

  if (!searchInput || cards.length === 0) {
    return;
  }

  const readCategoryFromHash = () => {
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    const category = params.get("category");
    return category || "all";
  };

  const writeCategoryToHash = () => {
    if (activeCategory === "all") {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      return;
    }

    const params = new URLSearchParams();
    params.set("category", activeCategory);
    history.replaceState(null, "", `#${params.toString()}`);
  };

  const setActiveButton = () => {
    for (const button of categoryButtons) {
      const isActive = button.dataset.categoryFilter === activeCategory;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    }
  };

  const update = () => {
    const query = searchInput.value.trim().toLowerCase();
    let visible = 0;

    for (const card of cards) {
      const haystack = card.dataset.search || "";
      const categoryMatch = activeCategory === "all" || card.dataset.category === activeCategory;
      const searchMatch = query === "" || haystack.includes(query);
      const match = categoryMatch && searchMatch;
      card.hidden = !match;
      if (match) visible += 1;
    }

    if (count) {
      count.textContent = `${visible}件`;
    }
  };

  if (categoryButtons.length > 0) {
    const initialCategory = readCategoryFromHash();
    if (categoryButtons.some((button) => button.dataset.categoryFilter === initialCategory)) {
      activeCategory = initialCategory;
    }

    setActiveButton();

    for (const button of categoryButtons) {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.categoryFilter || "all";
        setActiveButton();
        writeCategoryToHash();
        update();
      });
    }

    window.addEventListener("hashchange", () => {
      const nextCategory = readCategoryFromHash();
      activeCategory = categoryButtons.some((button) => button.dataset.categoryFilter === nextCategory)
        ? nextCategory
        : "all";
      setActiveButton();
      update();
    });
  }

  searchInput.addEventListener("input", update);
  update();
})();
