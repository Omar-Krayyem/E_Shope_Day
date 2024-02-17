document.addEventListener("DOMContentLoaded", async function (){
    let first_name = document.getElementById('first_name');
    let last_name = document.getElementById('last_name');
    let email = document.getElementById('email');
    let address = document.getElementById('address');
    let phone = document.getElementById('phone');
    let password = document.getElementById('password');
    let err = document.getElementById("error");
    const signup_btn = document.getElementById('signupbtn');

    signup_btn.addEventListener("click", async()=>{
        event.preventDefault()
        if (first_name.value != '' && last_name.value != '' && email.value != '' && password.value != '' && phone.value != '' && address.value != '') {
            const newUser = {
                email: email.value,
                first_name: first_name.value,
                last_name: last_name.value,
                address: address.value,
                phone: phone.value,
                password: password.value
            }
            try{
                const response = await fetch ("http://127.0.0.1:8000/api/register",{
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify(newUser)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                const data = await response.json();
                console.log(data);
                if (data.status === 'success') {
                    window.location.href = "../../edays/home.html";
                }
                else {
                    console.error('Registration failed:', data.message);
                    err.innerText = data.message;
                  }
            }
            catch(error){
                console.log('There was an error', error);
                err.innerText = error;
            }
        }
        else{
            err.innerText = "Fill all requirement"
        }
    });
})