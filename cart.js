// SIDE MENU

const menuButton = document.getElementById("menu-button");
const sideMenu = document.getElementById("side-menu");
const closeBtn = document.querySelector(".close-btn");

menuButton.onclick = () => sideMenu.style.width = "250px";
closeBtn.onclick = () => sideMenu.style.width = "0";


// DATE HEADER

const today = new Date();
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

document.getElementById("today-date").textContent =
    today.toLocaleDateString("ar-BH", options);


// CART DATA

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartContainer = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");


// RENDER CART

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

<input
class="item-note"
type="text"
placeholder="ملاحظة للمنتج"
value="${item.note || ''}"
onchange="updateNote(${index}, this.value)">

</div>

<div class="qty-controls">

<button onclick="decreaseQty(${index})">−</button>
<span>${item.qty}</span>
<button onclick="increaseQty(${index})">+</button>

</div>

<button class="delete-btn"
onclick="deleteItem(${index})">
حذف
</button>

</div>

`;

    });

    totalPriceElement.textContent = total.toFixed(3);

    document.getElementById("cart-count").textContent =
        cart.reduce((sum, i) => sum + i.qty, 0);

    localStorage.setItem("cart", JSON.stringify(cart));

}


// QUANTITY FUNCTIONS

function increaseQty(index) {

    cart[index].qty++;

    renderCart();

}

function decreaseQty(index) {

    if (cart[index].qty > 1) {

        cart[index].qty--;

    }

    renderCart();

}


// DELETE ITEM

function deleteItem(index) {

    cart.splice(index, 1);

    renderCart();

}


// UPDATE NOTE

function updateNote(index, value) {

    cart[index].note = value;

    localStorage.setItem("cart", JSON.stringify(cart));

}


renderCart();


// SEND ORDER

document.getElementById("send-order").onclick = function () {

    let name = document.getElementById("customer-name").value.trim();
    let phone = document.getElementById("customer-phone").value.trim();
    let pickupDate = document.getElementById("pickup-date").value;
    let pickupTime = document.getElementById("pickup-time").value;
    let note = document.getElementById("customer-note").value.trim();

    if (name === "" || phone === "") {

        alert("يرجى إدخال الاسم ورقم الهاتف");
        return;

    }

    if (cart.length === 0) {

        alert("السلة فارغة!");
        return;

    }


    // CREATE MESSAGE

    let message = "طلب جديد - East Hidd Cafe\n\n";

    cart.forEach(item => {

        message += item.name + " × " + item.qty;

        if (item.note && item.note !== "") {
            message += " (ملاحظة: " + item.note + ")";
        }

        message += "\n";

    });

    message += "\nالمجموع: " + totalPriceElement.textContent + " BD";


    // OPTIONAL PICKUP TIME

    if (pickupDate !== "") {
        message += "\nتاريخ الاستلام: " + pickupDate;
    }

    if (pickupTime !== "") {
        message += "\nوقت الاستلام: " + pickupTime;
    }

    message += "\nالاسم: " + name;
    message += "\nالهاتف: " + phone;

    if (note !== "") {
        message += "\nملاحظات: " + note;
    }


    // WHATSAPP LINK

    let encoded = encodeURIComponent(message);

    let whatsapp = "97333277422";

    let url = "https://wa.me/" + whatsapp + "?text=" + encoded;


    // CLEAR CART AFTER ORDER

    cart = [];
    localStorage.removeItem("cart");


    // REDIRECT

    window.location.href = url;

};