let items = []; // menu items array
let editId = null;

const CLOUD_NAME = "dsn8j76qs";
const IMAGE_UPLOAD_PRESET = "East-Hidd-Cafe";
const JSON_UPLOAD_PRESET = "East-Hidd-Cafe-Raw"; // Create a raw upload preset in Cloudinary

document.getElementById("addBtn").onclick = addItem;

// ADD OR EDIT ITEM
function addItem() {
    let name = document.getElementById("name").value.trim();
    let desc = document.getElementById("desc").value.trim();
    let price = document.getElementById("price").value;
    let category = document.getElementById("category").value;
    let offer = document.getElementById("offer").value.trim();
    let imageFile = document.getElementById("image").files[0];

    if (!name || !price) {
        alert("يرجى إدخال اسم المنتج والسعر");
        return;
    }

    if (!imageFile && !editId) {
        alert("يرجى رفع صورة");
        return;
    }

    if (imageFile) {
        // Upload image to Cloudinary
        let formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", IMAGE_UPLOAD_PRESET);

        fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            let imageURL = data.secure_url;
            saveItem(name, desc, price, category, offer, imageURL);
        })
        .catch(err => {
            console.error("Upload error:", err);
            alert("فشل رفع الصورة");
        });
    } else {
        // Edit item without changing image
        let item = items.find(i => i.id === editId);
        item.name = name;
        item.desc = desc;
        item.price = price;
        item.category = category;
        item.offer = offer;

        renderItems();
        resetForm();
        editId = null;
        uploadJSONToCloudinary();
    }
}

// SAVE ITEM (ADD OR EDIT)
function saveItem(name, desc, price, category, offer, imageURL) {
    if (editId) {
        let item = items.find(i => i.id === editId);
        item.name = name;
        item.desc = desc;
        item.price = price;
        item.category = category;
        item.offer = offer;
        item.image = imageURL;
        editId = null;
    } else {
        items.push({
            id: Date.now(),
            name,
            desc,
            price,
            category,
            offer,
            image: imageURL
        });
    }
    renderItems();
    resetForm();
    uploadJSONToCloudinary();
}

// RENDER ITEMS ON ADMIN PAGE
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

// DELETE ITEM
function deleteItem(id) {
    items = items.filter(item => item.id !== id);
    renderItems();
    uploadJSONToCloudinary();
}

// EDIT ITEM
function editItem(id) {
    let item = items.find(i => i.id === id);
    document.getElementById("name").value = item.name;
    document.getElementById("desc").value = item.desc;
    document.getElementById("price").value = item.price;
    document.getElementById("offer").value = item.offer;
    document.getElementById("category").value = item.category;
    editId = id;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// RESET FORM
function resetForm() {
    document.getElementById("name").value = "";
    document.getElementById("desc").value = "";
    document.getElementById("price").value = "";
    document.getElementById("offer").value = "";
    document.getElementById("image").value = "";
    document.getElementById("category").value = "sandwich";
}

// UPLOAD MENU JSON TO CLOUDINARY
function uploadJSONToCloudinary() {
    if (!items.length) return;

    let dataStr = JSON.stringify(items, null, 2);
    let formData = new FormData();
    formData.append("file", new Blob([dataStr], { type: "application/json" }));
    formData.append("upload_preset", JSON_UPLOAD_PRESET);

    fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/raw/upload`, {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => console.log("Menu JSON uploaded:", data.secure_url))
    .catch(err => console.error("Failed to upload JSON:", err));
}

// INITIAL RENDER
renderItems();
