document.addEventListener("DOMContentLoaded", getUser);

const token = localStorage.getItem("token");

let id = 0;
const first_name = document.getElementById("first_name");
const last_name = document.getElementById("last_name");
const email = document.getElementById("email");
const address = document.getElementById("address");
const phone = document.getElementById("phone");

const profile_name = document.getElementById("profile_name");
const profile_email = document.getElementById("profile_email");

const updateBtn = document.getElementById("update");

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

        id = users.data.id; 
        first_name.value = users.data.first_name;
        last_name.value = users.data.last_name;
        email.value = users.data.email;
        address.value = users.data.address;
        phone.value = users.data.phone;

        profile_name.textContent = `${users.data.first_name} ${users.data.last_name}`;
        profile_email.textContent = users.data.email;  
    })
}


///////////////////////////////////////////////////////////update
updateBtn.addEventListener('click', () => {
    updateProfile()
});

async function updateProfile(){
    event.preventDefault()
        if (first_name.value != '' && last_name.value != '' && address.value != '' && phone.value != '') {
            const user = {
                first_name: first_name.value,
                last_name: last_name.value,
                address: address.value,
                phone: phone.value,
                email: email.value
            }
            try{
                const response = await fetch ("http://127.0.0.1:8000/api/account/",{
                    method:"POST",
                    headers:{
                        'Authorization': `Bearer ${token}`,
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify(user)
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