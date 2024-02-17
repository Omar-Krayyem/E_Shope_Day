document.addEventListener("DOMContentLoaded", getUser);

const token = localStorage.getItem("token");

let id = 0;
const first_name = document.getElementById("first_name");
const last_name = document.getElementById("last_name");
const email = document.getElementById("email");
const address = document.getElementById("address");
const phone = document.getElementById("phone");

const totalPrice = document.getElementById("totalPrice")


const submitBtn = document.getElementById("submitBtn");

////////////////////////////////////////////////////////getuser
function getUser() {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    });
  
    const requestOptions = {
        method: 'GET',
        headers: headers,
    };
  
    fetch("http://127.0.0.1:8000/api/account/", requestOptions)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((users) => {
        UserArray = users.data;
        console.log(users.data);

        totalPrice.innerHTML = `${localStorage.getItem("totalPrice")} $`

        id = users.data.id; 
        first_name.value = users.data.first_name;
        last_name.value = users.data.last_name;
        email.value = users.data.email;
        address.value = users.data.address;
        phone.value = users.data.phone;
    })
}

///////////////////////////////////////////////////////////////add Order
submitBtn.addEventListener('click', (event) => {
    event.preventDefault();
    addOrder();
});

async function addOrder() {
    event.preventDefault();

    if (address.value != '' ){
        const formData = new FormData();
        formData.append("address", address.value); 

        console.log(formData);
        
        try {
            const response = await fetch("http://127.0.0.1:8000/api/order/store", {
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

            if (data.status === 'success') {
                window.location.href = "../../edays/home.html";
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
