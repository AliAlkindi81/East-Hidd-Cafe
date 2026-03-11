let items = JSON.parse(localStorage.getItem("menuItems")) || [];

const addBtn = document.getElementById("addBtn");

addBtn.onclick = addItem;

function addItem() {

    let name = document.getElementById("name").value;

    let desc = document.getElementById("desc").value;

    let price = document.getElementById("price").value;

    let category = document.getElementById("category").value;

    let offer = document.getElementById("offer").value;

    let imageFile = document.getElementById("image").files[0];

    if (!imageFile) {

        alert("يرجى رفع صورة");

        return;

    }

    let reader = new FileReader();

    reader.onload = function () {

        let item = {

            id: Date.now(),

            name: name,

            desc: desc,

            price: price,

            category: category,

            offer: offer,

            image: reader.result

        };

        items.push(item);

        localStorage.setItem("menuItems", JSON.stringify(items));

        renderItems();

    };

    reader.readAsDataURL(imageFile);

}

function renderItems() {

    let container = document.getElementById("itemsList");

    container.innerHTML = "";

    items.forEach(item => {

        container.innerHTML += `

<div class="item">

<img src="${item.image}">

<div class="item-info">

<b>${item.name}</b>

<p>${item.desc}</p>

<span>${item.price} BD</span>

${item.offer ? `<div style="color:red">${item.offer}</div>` : ""}

</div>

<div class="actions">

<button class="edit" onclick="editItem(${item.id})">تعديل</button>

<button onclick="deleteItem(${item.id})">حذف</button>

</div>

</div>

`;

    });

}

function deleteItem(id) {

    items = items.filter(item => item.id !== id);

    localStorage.setItem("menuItems", JSON.stringify(items));

    renderItems();

}

function editItem(id) {

    let item = items.find(i => i.id === id);

    document.getElementById("name").value = item.name;

    document.getElementById("desc").value = item.desc;

    document.getElementById("price").value = item.price;

    document.getElementById("offer").value = item.offer;

    document.getElementById("category").value = item.category;

    deleteItem(id);

}

renderItems();