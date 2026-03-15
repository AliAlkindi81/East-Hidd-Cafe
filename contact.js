// SIDE MENU
const menuButton = document.getElementById("menu-button");
const sideMenu = document.getElementById("side-menu");
const closeBtn = document.querySelector(".close-btn");

menuButton.onclick = () => sideMenu.style.width = "250px";
closeBtn.onclick = () => sideMenu.style.width = "0";

// DATE
const today = new Date();
const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};
const todayDateElem = document.getElementById("today-date");
if (todayDateElem) {
    todayDateElem.textContent = today.toLocaleDateString("ar-BH", options);
}

// CART COUNT
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartCountElem = document.getElementById("cart-count");
if (cartCountElem) {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountElem.textContent = count;
}

const cartIcon = document.querySelector(".cart");
if (cartIcon) {
    cartIcon.style.cursor = "pointer";
    cartIcon.addEventListener("click", () => {
        window.location.href = "cart.html";
    });
}
