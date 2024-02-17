document.addEventListener("DOMContentLoaded", getUser);

const token = localStorage.getItem("token");

const profile_name = document.getElementById("profile_name");
const profile_email = document.getElementById("profile_email");

let OrdersArray = []

/////////////////////////////////////////////////////////logout
if(token === ""){
    window.location.href = "../../../edays/index.html";
  }
  
  
  const logout = document.getElementById("logout");
  
  logout.addEventListener('click', () =>{
    localStorage.setItem("token", "");
    window.location.href = "../../edays/index.html";
  });

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

        profile_name.textContent = `${users.data.first_name} ${users.data.last_name}`;
        profile_email.textContent = users.data.email;  
        getOrders();
    })
}

///////////////////////////////////////////////////////////getOrders
function getOrders() {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    });
  
    const requestOptions = {
        method: 'GET',
        headers: headers,
    };
  
    fetch("http://127.0.0.1:8000/api/order/", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((orders) => {
            OrdersArray = orders.data;
            console.log(orders.data);
            displayOrders()
        })
        .catch((error) => console.error('Fetch error:', error));
  }

  function displayOrders() {
    const ordersList = document.getElementById("table_body");
    ordersList.innerHTML = "";
    OrdersArray.forEach((order) => {
        const listItem = document.createElement("tr");
        listItem.classList.add('row');
        listItem.innerHTML = `
            <td>${order.id}</td>
			<td>${order.total_price}</td>
			<td>${order.order_date}</td>
			<td>${order.address}</td>
			<td>${order.item_count}</td>
            <td><a href="#">View</a></td>
      `;
      ordersList.appendChild(listItem)
    })
}