document.addEventListener("DOMContentLoaded", getProducts);

const addbtn = document.querySelector(".add_btn");
let err = document.getElementById("error");

const token = localStorage.getItem("token");

if(token === ""){
    window.location.href = "../../../edays/index.html";
}


const logout = document.getElementById("logout");

logout.addEventListener('click', () =>{
    localStorage.setItem("token", "");
    window.location.href = "../../../edays/index.html";
});


let productsArray = []


function getProducts() {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    });
  
    const requestOptions = {
        method: 'GET',
        headers: headers,
    };
  
    fetch("http://127.0.0.1:8000/api/admin/stock/", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((products) => {
            productsArray = products.data;
            console.log(products.data);
            displayProducts()
        })
        .catch((error) => console.error('Fetch error:', error));
  }

  function displayProducts() {
    const productList = document.getElementById("table_body");
    productList.innerHTML = "";
    productsArray.forEach((product) => {
        const listItem = document.createElement("tr");
        listItem.classList.add('row');
        listItem.innerHTML = `
            <td> ${product.name}</td>
            <td> ${product.category.category}</td>
            <td> ${product.price}</td>
            <td> ${product.stock_quantity}</td>
      `;
      productList.appendChild(listItem)

    const prodtList = document.getElementById("product");
    prodtList.innerHTML = "";
    productsArray.forEach((product) => {
        prodtList.innerHTML += `
        <option value="${product.id}">${product.name}</option>
        
      `;
    })
    })
}
const stock = document.querySelector("#stock");

addbtn.addEventListener('click', (event) => {
    event.preventDefault();

    const product = document.querySelector("#product").value;

    updateStock(product);
});

async function updateStock(product_id){
    event.preventDefault()

    if (stock.value !== 0) {
        const formData = new FormData();
        formData.append("id", product_id);
        formData.append("stock_quantity", stock.value);

            try{
                const response = await fetch("http://127.0.0.1:8000/api/admin/stock/update", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

                if (!response) {
                    throw new Error('Network response was not ok');
                  }

                const data = await response.json();
                console.log(data);
                if (data.status === 'Product Updated Successfully') {
                    window.location.reload();
                }
                else {
                    console.error('Registration failed:', data.message);
                  }
            }
            catch(error) {
                console.log('There was an error:', error);
                if (error.response) {
                    console.log('Response status:', error.response.status);
                    console.log('Response data:', error.response.data);
                } else if (error.request) {
                    console.log('No response received:', error.request);
                } else {
                    console.log('Error during request setup:', error.message);
                }
            }
        }
        else{
            err.innerText = "Fill all requirement"
            return false;
        }
}