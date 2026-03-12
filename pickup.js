let items = JSON.parse(localStorage.getItem("menuItems")) || [];

// SLIDER
let slides = document.querySelectorAll(".slide");
let index = 0;
setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
}, 3000);

// LOAD MENU
function loadMenu() {
    items.forEach(item => {
        let section = document.getElementById(item.category);
        if (!section) return;

        let html = `
<div class="item">
    <img src="${item.image}">
    <div class="item-info">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        ${item.offer ? `<span style="color:red">${item.offer}</span>` : ""}
        <div class="item-bottom">
            <span class="price">${item.price} BD</span>
            <div class="qty-box">
                <button class="minus">−</button>
                <span class="qty">1</span>
                <button class="plus">+</button>
            </div>
            <button class="add-to-cart" data-name="${item.name}" data-price="${item.price}">
                إضافة
            </button>
        </div>
    </div>
</div>`;
        section.insertAdjacentHTML("beforeend", html);
    });

    initQuantity();
    initCartButtons();
}
loadMenu();

// QUANTITY
function initQuantity() {
    document.querySelectorAll(".item").forEach(item => {
        let qty = 1;
        const plus = item.querySelector(".plus");
        const minus = item.querySelector(".minus");
        const display = item.querySelector(".qty");
        if (!plus || !minus || !display) return;
        plus.onclick = () => { qty++; display.textContent = qty; };
        minus.onclick = () => { if (qty > 1) { qty--; display.textContent = qty; } };
    });
}

// CART
let cart = JSON.parse(localStorage.getItem("cart")) || [];
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCountElem = document.getElementById("cart-count");
    if (cartCountElem) { cartCountElem.textContent = count; }
}
updateCartCount();

// ADD TO CART
function initCartButtons() {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.onclick = function () {
            let item = this.closest(".item");
            let name = this.dataset.name;
            let price = parseFloat(this.dataset.price);
            let qty = parseInt(item.querySelector(".qty").textContent);
            let existing = cart.find(p => p.name === name);
            if (existing) { existing.qty += qty; } else { cart.push({ name, price, qty }); }
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            alert("تمت الإضافة للسلة");
        };
    });
}
