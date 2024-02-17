document.addEventListener("DOMContentLoaded", getProducts);

const token = localStorage.getItem("token");

let ProductsArray = []

function getProducts() {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    });
  
    const requestOptions = {
        method: 'GET',
        headers: headers,
    };
  
    fetch("http://127.0.0.1:8000/api/shop/", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((products) => {
            console.log(products.data);
            getCategories()
            ProductsArray = products.data;
            displayProducts()

        })
        .catch((error) => console.error('Fetch error:', error));
  }

  function displayProducts() {
    
    const productList = document.getElementById("product-content");
    
    productList.innerHTML = "";
    ProductsArray.forEach((product) => {
        const listItem = document.createElement("div");
        listItem.classList.add('product');
        listItem.innerHTML = `
            <a href="#" onclick='goToShop(${product.id})'>
                <img src="../edays_shop_server/public/storage/product_images/${product.image}">
			</a>
			<div class="product-detail" data-product-id="${product.id}">
				<h3>${product.category.category}</h3>
				<h2>${product.name}</h2>
                <a href="" onclick='addFavorite(${product.id})'>Add to Favorite</a>
				<p>${product.price} $</p>
			</div>		
        `;
        productList.appendChild(listItem)
    })
}

///////////////////////////////////////////////////////////////////////go to product
function goToShop(product_id){
    localStorage.setItem("product_id", product_id);
    window.location.href = "../../edays/product.html";
}

/////////////////////////////////////////////////////////////////////////////////add favorite
async function addFavorite(product_id){
    event.preventDefault();
    const product = {
        product_id: product_id,
    }
    try{
        const response = await fetch ("http://127.0.0.1:8000/api/favorite/store",{
            method:"POST",
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
          }

        const data = await response.json();
        console.log(data);
        if (data.status === 'Favorite Added Successfully') {
            console.log("hi")
            displayNotification("Added to Favorites", product_id);

        }
        if (data.status === 'Favorite already exists') {
            console.log("hi")
            displayNotification("already exists", product_id);

        }
        else {
            console.error('Registration failed:', data.message);
          }
    }
    catch(error){
        console.log('There was an error', error);
    }
}

function displayNotification(message, product_id) {
    const productDetail = document.querySelector(`.product-detail[data-product-id="${product_id}"]`);

    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.textContent = message;

    productDetail.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

/////////////////////////////////////////////////////////////get category
function getCategories() {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    });
  
    const requestOptions = {
        method: 'GET',
        headers: headers,
    };
  
    fetch("http://127.0.0.1:8000/api/category/", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((categories) => {
            categorytArray = categories.data;
            console.log(categories.data);
            displayCategory()
        })
        .catch((error) => console.error('Fetch error:', error));
  }

function displayCategory() {
    const categorytList = document.getElementById("category");
    categorytList.innerHTML = "";
    categorytArray.forEach((category) => {
        const listItem = document.createElement("li");
        listItem.classList.add('row');
        listItem.innerHTML = `
            <a href="#" onclick='getProductCategory(${category.id})'>${category.category}</a>
        `;
      categorytList.appendChild(listItem)
    })
}

function getProductCategory($category_id) {
    event.preventDefault();
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    });
      
    const requestOptions = {
        method: 'GET',
        headers: headers,
    };

    console.log($category_id)
      
    fetch("http://127.0.0.1:8000/api/shop/category/" + $category_id, requestOptions)
    .then((response) => {
        if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((products) => {
            ProductsArray = products.data;
            console.log(products.data)
            displayProducts()
        })
        .catch((error) => console.error('Fetch error:', error));
}