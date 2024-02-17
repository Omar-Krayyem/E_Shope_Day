document.addEventListener("DOMContentLoaded", getProduct);

const token = localStorage.getItem("token");

let ProductsArray = []

const nbOfProduct = document.getElementById("nbOfProduct");
const nbOfItem = document.getElementById("nbOfItem");
const totalPrice = document.getElementById("totalPrice");


function getProduct() {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    });
  
    const requestOptions = {
        method: 'GET',
        headers: headers,
    };
  
    fetch("http://127.0.0.1:8000/api/cart/", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((products) => {
            ProductsArray = products.data.items;
            console.log(products.data);
            displayProducts()
        })
        .catch((error) => console.error('Fetch error:', error));
}

function displayProducts() {
    const productsList = document.getElementById("table_body");
    productsList.innerHTML = "";

    let totalQuantity = 0;
    let totalItems = 0;
    let total = 0;

    ProductsArray.forEach((product) => {
        const listItem = document.createElement("tr");
        listItem.classList.add('row');

        listItem.innerHTML = `
            <td style="width: 20%;"><img src="../edays_shop_server/public/storage/product_images/${product.product.image}"></td>
			<td style="width: 60%;">
                <h2 onClick="move(${product.product.id})">${product.product.name}</h2>
				<p>${product.product.short_description}</p>
				<br>
				<h3>Price: ${product.product.price}$</h3>
				<br>
				<a href="#" onClick='remove(${product.id})'>x</a> Remove
			</td>
			<td class="qty" style="width: 15%;">
				<input type="number" name="cartNumber" class="cartNumber" readonly value="${product.quantity}">
				<h3>${product.subtotal} $</h3>
			</td>
        `;

        totalQuantity += parseInt(product.quantity);
        totalItems += 1; // Assuming each product is one item
        total += parseFloat(product.subtotal);

        productsList.appendChild(listItem);
    });

    nbOfProduct.innerText = `Number of Products x ${totalItems}`;
    nbOfItem.innerText = `Number of items x ${totalQuantity}`;;
    totalPrice.innerText = total.toFixed(2) + " $";

    localStorage.setItem("totalPrice" ,total )
}


async function remove(item_id){
    event.preventDefault();
    try{
        const response = await fetch ("http://127.0.0.1:8000/api/cart/" + item_id ,{
            method:"DELETE",
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
  
        if (!response.ok) {
            throw new Error('Network response was not ok');
          }
        const data = await response.json();
        console.log(data);
        if (data.status === 'Deleted Successfully') {
            console.log("removed")
            window.location.reload();
        }
        else {
            console.error('Registration failed:', data.message);
          }
    }
    catch(error){
        console.log('There was an error', error);
    }
}

async function move(product_id){
    localStorage.setItem("product_id", product_id);
    window.location.href = "../../edays/product.html";
}