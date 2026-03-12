let items = JSON.parse(localStorage.getItem("menuItems")) || [];
let editId = null;

const CLOUD_NAME = "dsn8j76qs";
const UPLOAD_PRESET = "East-Hidd-Cafe";

document.getElementById("addBtn").onclick = addItem;

function addItem() {
    let name = document.getElementById("name").value.trim();
    let desc = document.getElementById("desc").value.trim();
    let price = document.getElementById("price").value;
    let category = document.getElementById("category").value;
    let offer = document.getElementById("offer").value.trim();
    let imageFile = document.getElementById("image").files[0];

    if (!name || !price) { alert("يرجى إدخال اسم المنتج والسعر"); return; }
    if (!imageFile && !editId) { alert("يرجى رفع صورة"); return; }

    if (imageFile) {
        let formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", UPLOAD_PRESET);

        fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            let imageURL = data.secure_url;
            saveItem(name, desc, price, category, offer, imageURL);
        })
        .catch(err => { console.error("Upload error:", err); alert("فشل رفع الصورة"); });
    } else {
        // edit without changing image
        let item = items.find(i => i.id === editId);
        item.name = name;
        item.desc = desc;
        item.price = price;
        item.category = category;
        item.offer = offer;

        saveItems();
        renderItems();
        resetForm();
        editId = null;
    }
}

function saveItem(name, desc, price, category, offer, imageURL) {
    if (editId) {
        let item = items.find(i => i.id === editId);
        item.name = name; item.desc = desc; item.price = price;
        item.category = category; item.offer = offer; item.image = imageURL;
        editId = null;
    } else {
        items.push({ id: Date.now(), name, desc, price, category, offer, image: imageURL });
    }
    saveItems();
    renderItems();
    resetForm();
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
</div>`;
    });
}

function deleteItem(id) {
    items = items.filter(item => item.id !== id);
    saveItems();
    renderItems();
}

function editItem(id) {
    let item = items.find(i => i.id === id);
    document.getElementById("name").value = item.name;
    document.getElementById("desc").value = item.desc;
    document.getElementById("price").value = item.price;
    document.getElementById("offer").value = item.offer;
    document.getElementById("category").value = item.category;
    editId = id;
}

function resetForm() {
    document.getElementById("name").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("price").value = "";
    document.getElementById("offer").value = "";
    document.getElementById("image").value = "";
    document.getElementById("category").value = "sandwich";
}

function saveItems() {
    localStorage.setItem("menuItems", JSON.stringify(items));
}

// initial render
renderItems();
