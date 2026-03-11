// SIDE MENU
const menuButton = document.getElementById("menu-button");
const sideMenu = document.getElementById("side-menu");
const closeBtn = document.querySelector(".close-btn");

menuButton.onclick = () => sideMenu.style.width = "250px";
closeBtn.onclick = () => sideMenu.style.width = "0";

// DATE
const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById("today-date").textContent = today.toLocaleDateString("ar-BH", options);

// CART
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartContainer = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");

// Render cart items
function renderCart() {
    cartContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p class="empty-cart">السلة فارغة</p>`;
    }

    cart.forEach((item, index) => {
        total += item.price * item.qty;

        cartContainer.innerHTML += `
<div class="cart-item">

    <div class="item-info">
        <b>${item.name}</b><br>
        ${item.price.toFixed(3)} BD
    </div>

    <div class="qty-controls">
        <button onclick="decreaseQty(${index})">−</button>
        <span>${item.qty}</span>
        <button onclick="increaseQty(${index})">+</button>
    </div>

    <button class="delete-btn" onclick="deleteItem(${index})">
        حذف
    </button>

</div>
`;
    });

    totalPriceElement.textContent = total.toFixed(3);
    document.getElementById("cart-count").textContent = cart.reduce((sum, i) => sum + i.qty, 0);
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Increase quantity
function increaseQty(index) {
    cart[index].qty++;
    renderCart();
}

// Decrease quantity
function decreaseQty(index) {
    if (cart[index].qty > 1) {
        cart[index].qty--;
    }
    renderCart();
}

// Delete item
function deleteItem(index) {
    cart.splice(index, 1);
    renderCart();
}

// Initial render
renderCart();

// SEND ORDER VIA WHATSAPP
document.getElementById("send-order").onclick = function () {
    let name = document.getElementById("customer-name").value.trim();
    let phone = document.getElementById("customer-phone").value.trim();
    let note = document.getElementById("customer-note").value.trim();

    if (name === "" || phone === "") {
        alert("يرجى إدخال الاسم ورقم الهاتف");
        return;
    }

    if (cart.length === 0) {
        alert("السلة فارغة!");
        return;
    }

    // Build the message as a normal string
    let message = "طلب جديد:\n";
    cart.forEach(item => {
        message += `${item.name} × ${item.qty}\n`;
    });
    message += `\nالمجموع: ${totalPriceElement.textContent} BD`;
    message += `\nالاسم: ${name}`;
    message += `\nالهاتف: ${phone}`;
    message += `\nملاحظات: ${note}`;

    // Encode the message for URL
    let encodedMessage = encodeURIComponent(message);

    // WhatsApp number in international format without symbols
    let phoneNumber = "97337746477";
    let url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(url);

    // Clear cart after sending
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    alert("تم إرسال الطلب! يمكنك الآن الاستمرار بالتسوق.");
};