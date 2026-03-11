let items = JSON.parse(localStorage.getItem("menuItems")) || [];
let editId = null;

const addBtn = document.getElementById("addBtn");
addBtn.onclick = addItem;

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

    // التحقق من الصورة
    if (imageFile) {

        let allowedTypes = ["image/jpeg", "image/png"];

        if (!allowedTypes.includes(imageFile.type)) {
            alert("يسمح فقط بصور JPG أو JPEG أو PNG");
            return;
        }

        // منع الصور الكبيرة
        if (imageFile.size > 2 * 1024 * 1024) {
            alert("حجم الصورة كبير. الحد الأقصى 2MB");
            return;
        }
    }

    // تعديل بدون تغيير الصورة
    if (editId && !imageFile) {

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

        return;
    }

    // إذا لم توجد صورة عند الإضافة
    if (!imageFile && !editId) {
        alert("يرجى رفع صورة");
        return;
    }

    let reader = new FileReader();

    reader.onload = function () {

        if (editId) {

            let item = items.find(i => i.id === editId);

            item.name = name;
            item.desc = desc;
            item.price = price;
            item.category = category;
            item.offer = offer;
            item.image = reader.result;

            editId = null;

        } else {

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
        }

        saveItems();
        renderItems();
        resetForm();
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

    let item = items.find(i => i.id === id);

    let confirmDelete = confirm(`هل أنت متأكد من حذف المنتج ${item.name} ؟`);

    if (!confirmDelete) return;

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

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
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

renderItems();
