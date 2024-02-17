document.addEventListener("DOMContentLoaded", getProducts);
const token = localStorage.getItem("token");

if(token === ""){
    window.location.href = "../../../edays/index.html";
}


const logout = document.getElementById("logout");

logout.addEventListener('click', () =>{
    localStorage.setItem("token", "");
    window.location.href = "../../../edays/index.html";
});

const addbtn = document.querySelector(".add_btn");
let err = document.getElementById("error");
let product_up = 0;

/////////////////////////////////////////////////////////////////////dispaly products and categories

let productsArray = []
let categorytArray = []


function getProducts() {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    });
  
    const requestOptions = {
        method: 'GET',
        headers: headers,
    };
  
    fetch("http://127.0.0.1:8000/api/admin/product/", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((products) => {
            productsArray = products.data;
            console.log(products.data);
            getCategories();
            displayProducts()
        })
        .catch((error) => console.error('Fetch error:', error));
  }

  function displayProducts() {
    const categorytList = document.getElementById("table_body");
    categorytList.innerHTML = "";
    productsArray.forEach((product) => {
        const listItem = document.createElement("tr");
        listItem.classList.add('row');
        listItem.innerHTML = `
            <td> ${product.name}</td>
            <td> ${product.price}</td>
            <td> ${product.category.category}</td>
            <td> <a href="#"  onclick='editProduct(${product.id})'>Edit</i></a> </td >
            <td>
                <a href="#"  onclick='removeProduct(${product.id})'>Delete</i></a> 
            </td>
      `;
      categorytList.appendChild(listItem)
    })
}

function getCategories() {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    });
  
    const requestOptions = {
        method: 'GET',
        headers: headers,
    };
  
    fetch("http://127.0.0.1:8000/api/admin/category/", requestOptions)
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
    const categoryList = document.getElementById("category");
    categoryList.innerHTML = "";
    categorytArray.forEach((category) => {
    categoryList.innerHTML += `
        <option value="${category.id}">${category.category}</option>
        
      `;
    })
  
  }

///////////////////////////////////////////////////////////////////////////////////////////////////////delete product


async function removeProduct(product_id){
    try{
        const response = await fetch ("http://127.0.0.1:8000/api/admin/product/delete/" + product_id ,{
            method:"DELETE",
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log("hi")
  
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////add product

const name = document.querySelector("#name");
const long_description = document.querySelector("#long_description");
const short_description = document.querySelector("#short_description");
const price = document.querySelector("#price");
const imageInput = document.querySelector("#image");

addbtn.addEventListener('click', (event) => {
    event.preventDefault();

    const category = document.querySelector("#category").value;

    if (addbtn.value === "Update") {
        console.log("Update");
        updateProduct(product_up, category);
    } else {
        addProduct(category); 
    }
});

async function addProduct(category) {
    event.preventDefault();

    if (name.value != '' && price.value != '' && short_description.value != '' && long_description.value != '') {
        const formData = new FormData();
        formData.append("name", name.value);
        formData.append("price", price.value);
        formData.append("long_description", long_description.value);
        formData.append("short_description", short_description.value);
        formData.append("category_id", category);
        formData.append("image", imageInput.files[0]); 

        console.log(formData);
        
        try {
            const response = await fetch("http://127.0.0.1:8000/api/admin/product/store", {
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

            if (data.status === 'Product Created Successfully') {
                window.location.reload();
            } else {
                console.error('Registration failed:', data.message);
            }
        } catch (error) {
            console.log('There was an error', error);
        }
    } else {
        err.innerText = "Fill all requirements";
        return false;
    }
}


/////////////////////////////////////////////////////////////////////////////////////////////update product

async function editProduct(product_id){

    product_up = product_id;

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    });
  
    const requestOptions = {
        method: 'GET',
        headers: headers,
    };
  
    fetch("http://127.0.0.1:8000/api/admin/product/" + product_id, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((product) => {
            name.value = product.data.name;
            price.value = product.data.price;
            short_description.value = product.data.short_description;
            long_description.value = product.data.long_description;
            category.value = product.data.category_id
            console.log(product.data);
            addbtn.value = "Update";
        })
        .catch((error) => console.error('Fetch error:', error));
}

async function updateProduct(product_id, category){
    event.preventDefault()

    if (name.value != '' && price.value != '' && short_description.value != '' && long_description.value != '') {
        const formData = new FormData();
        formData.append("id", product_id);
        formData.append("name", name.value);
        formData.append("price", price.value);
        formData.append("long_description", long_description.value);
        formData.append("short_description", short_description.value);
        formData.append("category_id", category);

            try{
                        const response = await fetch("http://127.0.0.1:8000/api/admin/product/update/", {
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
