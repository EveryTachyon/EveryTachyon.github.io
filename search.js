function normalizeSearchText(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase();
}

document.querySelectorAll("[data-search-input]").forEach((input) => {
    const list = document.getElementById(input.getAttribute("aria-controls"));
    if (!list) return;

    const entries = [...list.children].filter((child) => child.matches(".entry"));
    const emptyState = list.querySelector(".search-empty");

    function updateResults() {
        const query = normalizeSearchText(input.value.trim());
        let matchCount = 0;

        entries.forEach((entry) => {
            const matches = normalizeSearchText(entry.textContent).includes(query);
            entry.hidden = !matches;
            if (matches) matchCount++;
        });

        if (!emptyState) return;

        if (entries.length === 0) {
            emptyState.hidden = false;
            emptyState.textContent = emptyState.dataset.emptyMessage;
            return;
        }

        emptyState.hidden = query.length === 0 || matchCount > 0;
        emptyState.textContent = "No matching results found.";
    }

    input.addEventListener("input", updateResults);
    updateResults();
});