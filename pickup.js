// SLIDER
let slides = document.querySelectorAll(".slide");
let index = 0;
setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
}, 3000);

// QUANTITY HANDLER
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
initQuantity();

// CART
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartCountElem = document.getElementById("cart-count");
    if (cartCountElem) cartCountElem.textContent = count;
}
updateCartCount();

// ADD TO CART BUTTONS
function initCartButtons() {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.onclick = function () {

            // حماية: لا تضيف إذا الزر معطل
            if (this.disabled) return;

            const itemElem = this.closest(".item");
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            const qty = parseInt(itemElem.querySelector(".qty").textContent);

            const existing = cart.find(p => p.name === name);

            if (existing) existing.qty += qty;
            else cart.push({ name, price, qty });

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            alert("تمت الإضافة للسلة");
        };
    });
}
initCartButtons();

// CART CLICK
const cartIcon = document.querySelector(".cart");
if (cartIcon) {
    cartIcon.style.cursor = "pointer";
    cartIcon.addEventListener("click", () => {
        window.location.href = "cart.html";
    });
}

// SEARCH
const searchInput = document.querySelector(".search-box input");
if (searchInput) {
    searchInput.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();
        document.querySelectorAll(".item").forEach(item => {
            const name = item.querySelector("h3").textContent.toLowerCase();
            const desc = item.querySelector("p").textContent.toLowerCase();
            item.style.display =
                (name.includes(value) || desc.includes(value)) ? "flex" : "none";
        });
    });
}

// CATEGORY FILTER
const buttons = document.querySelectorAll(".categories button");
const sections = document.querySelectorAll(".category-section");

buttons.forEach(button => {
    button.addEventListener("click", () => {
        buttons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const category = button.dataset.category;

        sections.forEach(sec => {
            sec.style.display =
                (category === "all" || sec.id === category) ? "block" : "none";
        });
    });
});

// DATE
function updateDate() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const todayDateElem = document.getElementById("today-date");

    if (todayDateElem) {
        todayDateElem.textContent = today.toLocaleDateString("ar-BH", options);
    }
}
updateDate();

// SIDE MENU
const menuButton = document.getElementById("menu-button");
const sideMenu = document.getElementById("side-menu");
const closeBtn = document.querySelector(".close-btn");

if (menuButton && sideMenu) {
    menuButton.onclick = () => sideMenu.style.width = "250px";
}

if (closeBtn && sideMenu) {
    closeBtn.onclick = () => sideMenu.style.width = "0";
}

// LIGHTBOX
const lightbox = document.createElement("div");
lightbox.classList.add("lightbox");
lightbox.innerHTML = `<span class="close-lightbox">&times;</span><img src="" alt="Preview">`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector("img");
const closeLightbox = lightbox.querySelector(".close-lightbox");

document.querySelectorAll(".item img").forEach(img => {
    img.style.cursor = "pointer";
    img.onclick = () => {
        lightbox.style.display = "flex";
        lightboxImg.src = img.src;
    };
});

closeLightbox.onclick = () => lightbox.style.display = "none";

lightbox.onclick = (e) => {
    if (e.target === lightbox) lightbox.style.display = "none";
};

// PRODUCT STATUS + OVERLAY
document.querySelectorAll('.item').forEach(item => {
    const status = item.dataset.status;
    const note = item.querySelector('.item-note');
    const button = item.querySelector('.add-to-cart');

    // حذف overlay القديم
    const oldOverlay = item.querySelector('.overlay');
    if (oldOverlay) oldOverlay.remove();

    // الحالة الافتراضية (إذا ما فيه status)
    if (!status || status === "available") {
        if (note) note.textContent = "🔥 متوفر اليوم";
        if (button) {
            button.disabled = false;
            button.style.opacity = "1";
        }
        return;
    }

    // إنشاء overlay
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    if (status === "unavailable") {
        if (note) note.textContent = "❌ غير متوفر";
        overlay.textContent = "غير متوفر";
    } 
    
    else if (status === "coming") {
        if (note) note.textContent = "⏳ سيتوفر قريبًا";
        overlay.textContent = "سيتوفر قريبًا";
    }

    if (button) {
        button.disabled = true;
        button.style.opacity = "0.5";
    }

    item.appendChild(overlay);
});
