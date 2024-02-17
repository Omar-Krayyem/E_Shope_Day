document.addEventListener("DOMContentLoaded", getCategories);

const addbtn = document.querySelector(".add_btn");
const category_input = document.querySelector("#category_input") 
let err = document.getElementById("error");
let category_up = 0;

addbtn.addEventListener('click', () =>{
    event.preventDefault()
    if(addbtn.value === "Update"){
        console.log("Update");
        updateCategory(category_up);
    }
    else{
        addCategory();
    }
    
})

let categorytArray = []
const token = localStorage.getItem("token");

if(token === ""){
    window.location.href = "../../../edays/index.html";
}


const logout = document.getElementById("logout");

logout.addEventListener('click', () =>{
    localStorage.setItem("token", "");
    window.location.href = "../../../edays/index.html";
});


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
    const categorytList = document.getElementById("table_body");
    categorytList.innerHTML = "";
    categorytArray.forEach((category) => {
        const listItem = document.createElement("tr");
        listItem.classList.add('row');
        listItem.innerHTML = `
            <td> ${category.id}</td>
            <td> ${category.category}</td>
            <td> <a href="#"  onclick='editCategory(${category.id})'>Edit</i></a> </td >
            <td>
                <a href="#"  onclick='removeCategory(${category.id})'>Delete</i></a> 
            </td>
      `;
      categorytList.appendChild(listItem)
    })
}

async function editCategory(cat_id){

    category_up = cat_id;

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    });
  
    const requestOptions = {
        method: 'GET',
        headers: headers,
    };
  
    fetch("http://127.0.0.1:8000/api/admin/category/" + cat_id, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((categories) => {
            console.log(categories.data.category);
            category_input.value = categories.data.category;
            addbtn.value = "Update";
        })
        .catch((error) => console.error('Fetch error:', error));
}


async function removeCategory(cat_id){
    try{
        const response = await fetch ("http://127.0.0.1:8000/api/admin/category/delete/" + cat_id ,{
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


async function addCategory(){
    event.preventDefault()
        if (category_input.value != '') {
            const newCategory = {
                category: category_input.value,
            }
            try{
                const response = await fetch ("http://127.0.0.1:8000/api/admin/category/store",{
                    method:"POST",
                    headers:{
                        'Authorization': `Bearer ${token}`,
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify(newCategory)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }

                const data = await response.json();
                console.log(data);
                if (data.status === 'Category created successfully') {
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
        else{
            err.innerText = "Fill all requirement"
            return false;
        }
}

async function updateCategory(cat_id){
    event.preventDefault()
        if (category_input.value != '') {
            const newCategory = {
                category: category_input.value,
            }
            try{
                const response = await fetch ("http://127.0.0.1:8000/api/admin/category/update/" + cat_id,{
                    method:"POST",
                    headers:{
                        'Authorization': `Bearer ${token}`,
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify(newCategory)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }

                const data = await response.json();
                console.log(data);
                if (data.status === 'Updated Successfully') {
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
        else{
            err.innerText = "Fill all requirement"
            return false;
        }
}