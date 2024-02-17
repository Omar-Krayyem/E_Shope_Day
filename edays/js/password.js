document.addEventListener("DOMContentLoaded", getUser);

const token = localStorage.getItem("token");

const profile_name = document.getElementById("profile_name");
const profile_email = document.getElementById("profile_email");

const error = document.getElementById("error");

const updateBtn = document.getElementById("update_pass");

const new_password = document.getElementById("new_password");
const confirm_password = document.getElementById("confirm_password");

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
    })
}


///////////////////////////////////////////////////////////update
updateBtn.addEventListener('click', () => {
    updatePassword()
});

async function updatePassword(){
    event.preventDefault()
        if (confirm_password.value != '' && new_password.value != '' ){
            if(confirm_password.value === new_password.value){
                const password = {
                    password: new_password.value,
                }
                try{
                    const response = await fetch ("http://127.0.0.1:8000/api/account/password",{
                        method:"POST",
                        headers:{
                            'Authorization': `Bearer ${token}`,
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify(password)
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
                error.innerText = "Password and Confirm Password do not match. Please make sure they are the same."
                return false;
            }
            
        }
        else{
            error.innerText = "Fill all requirement"
            return false;
        }
}