const modal = document.getElementById("modal");
const content = document.getElementById("teasing-message");

export function openModal(html, options = []) {
    content.innerHTML = html;

    modal.querySelector(".modal-actions")?.remove();

    if (options.length) {
        const actions = document.createElement("div");
        actions.className = "modal-actions";

        options.forEach(({ label, onClick }) => {
            const btn = document.createElement("button");
            btn.textContent = label;
            btn.addEventListener("click", () => {
                closeModal();
                onClick();
            });
            actions.append(btn);
        });

        modal.querySelector(".modal-box").append(actions);
    }

    modal.hidden = false;
}

export function closeModal() {
    modal.hidden = true;
}

export function isModalOpen() {
    return !modal.hidden;
}

export function initModal() {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
    modal.querySelector(".modal-close").addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });
}