document.addEventListener("DOMContentLoaded", getProduct);
const token = localStorage.getItem("token");

const name = document.getElementById("name");
const long_description = document.getElementById("long_description");
const short_description = document.getElementById("short_description");
const price = document.getElementById("price");
const image = document.getElementById("image");
const category = document.getElementById("category");

const cartNumber = document.getElementById("cartNumber");
const addToCart = document.getElementById("addToCart");
const favorite = document.getElementById("favorite");

async function getProduct(){
    product_id = localStorage.getItem("product_id");
    console.log(product_id)

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    });
  
    const requestOptions = {
        method: 'GET',
        headers: headers,
    };
  
    fetch("http://127.0.0.1:8000/api/product/" + product_id, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((product) => {
            console.log(product.data);
            name.innerHTML = product.data.name;
            getProducts()

            product_id = product.data.id;
            price.innerHTML = `${product.data.price} $`;
            short_description.innerHTML = product.data.short_description;
            long_description.innerHTML = product.data.long_description;
            category.innerHTML = `<b>Category: </b> ${product.data.category.category}`
            image.src = `../edays_shop_server/public/storage/product_images/${product.data.image}`
            cartNumber.max = product.data.stock_quantity;
            if (product.data.is_favorite) {
                favorite.checked = true;
            } else {
                favorite.checked = false;
            }
        })
        .catch((error) => console.error('Fetch error:', error));
}

//////////////////////////////////////////////////////////////get recommended
let recomProductArray = []


function getProducts() {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    });
  
    const requestOptions = {
        method: 'GET',
        headers: headers,
    };
  
    fetch("http://127.0.0.1:8000/api/home/", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((products) => {
            recomProductArray = products.data.recommended;
            console.log(recomProductArray);
            displayProducts()
        })
        .catch((error) => console.error('Fetch error:', error));
  }

function displayProducts() {
    const prodList = document.getElementById("Recommend");
    
    prodList.innerHTML = "";
    recomProductArray.forEach((product) => {
        const listItem = document.createElement("div");
        listItem.classList.add('product');
        listItem.innerHTML = `
            <a href="#"  onclick='goToShop(${product.id})'>
                <img src="../edays_shop_server/public/storage/product_images/${product.image}">
			</a>
			<div class="product-detail" data-product-id="${product.id}">
				<h3>${product.category.category}</h3>
				<h2>${product.name}</h2>
                <a href="" onclick='addFavorite(${product.id})'>Add to Favorite</a>
				<p>${product.price} $</p>
                
			</div>		
        `;
        prodList.appendChild(listItem)

    })

}


function goToShop(product_id){
    localStorage.setItem("product_id", product_id);
    window.location.href = "../../edays/product.html";
}

////////////////////////////////////////////////////////add to favorite
favorite.addEventListener('click', ()=>{
    product_id = localStorage.getItem("product_id");
    if (favorite.checked) {
        console.log("Adding to favorites:", product_id);
        addFavorite(product_id);
    } else {
        console.log("Removing from favorites:", product_id);
        remove(product_id);
    }
})

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
        if (data.status === 'Favorite Added Successfully' || data.status === 'Favorite already exists') {
            console.log("added")
            favorite.checked = true
        }
        else {
            console.error('Registration failed:', data.message);
          }
    }
    catch(error){
        console.log('There was an error', error);
    }
}

//////////////////////////////////////////////////////////////////////////remove from favorite
async function remove(product_id){
    event.preventDefault();
    try{
        const response = await fetch ("http://127.0.0.1:8000/api/favorite/" + product_id ,{
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
            favorite.checked = false
        }
        else {
            console.error('Registration failed:', data.message);
          }
    }
    catch(error){
        console.log('There was an error', error);
    }
}
////////////////////////////////////////////////////////////////////add to cart
const error = document.getElementById("error")

addToCart.addEventListener('click', () => {
    addProduct()
})

async function addProduct() {
    event.preventDefault();
    product_id = localStorage.getItem("product_id");
    if (cartNumber.value != '') {
        const formData = new FormData();
        formData.append("quantity", cartNumber.value);
        formData.append("product_id", product_id);
        

        console.log(formData);
        
        try {
            const response = await fetch("http://127.0.0.1:8000/api/cart/store", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data);

            if (data.status === 'Added Successfully') {
                error.innerText = "Added Successfully";
            } else if (data.status === 'Already exist') {
                error.innerText = "Product already in the cart";
            } else {
                console.error('Adding to cart failed:', data.message);
                error.innerText = "Adding to cart failed";
            }

            setTimeout(() => {
                error.innerText = "";
            }, 2000);
            
        } catch (error) {
            console.log('There was an error', error);
        }
    } else {
        err.innerText = "Fill all requirements";
        return false;
    }
}