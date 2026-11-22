const modal = document.getElementById("modal");
const content = document.getElementById("teasing-message");

export function openModal(html) {
    content.innerHTML = html;
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