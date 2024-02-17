document.addEventListener("DOMContentLoaded", getOrders);
const token = localStorage.getItem("token");

if(token === ""){
    window.location.href = "../../../edays/index.html";
}


const logout = document.getElementById("logout");

logout.addEventListener('click', () =>{
    localStorage.setItem("token", "");
    window.location.href = "../../../edays/index.html";
});

let OrdersArray = []



function getOrders() {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    });
  
    const requestOptions = {
        method: 'GET',
        headers: headers,
    };
  
    fetch("http://127.0.0.1:8000/api/admin/order/", requestOptions)
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
			<td>${order.user.first_name} ${order.user.last_name}</td>
			<td>${order.total_price}</td>
			<td>${order.order_date}</td>
			<td>${order.address}</td>
			<td>${order.item_count}</td>
      `;
      ordersList.appendChild(listItem)
    })
}