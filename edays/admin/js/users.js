document.addEventListener("DOMContentLoaded", getCustomer);


let UserArray = []
const token = localStorage.getItem("token");

if(token === ""){
  window.location.href = "../../../edays/index.html";
}


const logout = document.getElementById("logout");

logout.addEventListener('click', () =>{
  localStorage.setItem("token", "");
  window.location.href = "../../../edays/index.html";
});


function getCustomer() {
  const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
  });

  const requestOptions = {
      method: 'GET',
      headers: headers,
  };

  fetch("http://127.0.0.1:8000/api/admin/user/", requestOptions)
      .then((response) => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then((users) => {
        UserArray = users.data;
          console.log(users.data);
          displayUsers()
      })
      .catch((error) => console.error('Fetch error:', error));
}

function displayUsers() {
    const customerList = document.getElementById("table_body");
    customerList.innerHTML = "";
    UserArray.forEach((user) => {
        const listItem = document.createElement("tr");
      listItem.classList.add('row');
      listItem.innerHTML = `
        
        <td >${user.first_name}</td>
        <td >${user.last_name}</td>
        <td >${user.email}</td>
        <td >${user.phone}</td>
        <td >${user.address}</td>
				<td> <a href="#"  class="delBtn" onclick='removeUser(${user.id})'>Delete</a> </td>
      `;
      customerList.appendChild(listItem)
    })
}


async function removeUser(user_id){
  try{
      const response = await fetch ("http://127.0.0.1:8000/api/admin/user/" + user_id ,{
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
          // getCategories()
          // window.location.href = "../../ecommerce/ecommerce_client/home.html";
      }
      else {
          console.error('Registration failed:', data.message);
        }
  }
  catch(error){
      console.log('There was an error', error);
  }
}