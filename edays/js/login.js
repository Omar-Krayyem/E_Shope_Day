document.addEventListener("DOMContentLoaded", async function (){
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let err = document.getElementById("error");
    const login_btn = document.getElementById('loginbtn');

    login_btn.addEventListener("click", async()=>{
        event.preventDefault()
        if ( email.value != '' && password.value != '') {
            const user = {
                email: email.value,
                password: password.value
            }
            try{
                const response = await fetch ("http://127.0.0.1:8000/api/login",{
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify(user)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                const data = await response.json();
                console.log(data);
                if (data.status === 'success') {
                    console.log(data.authorisation.token);
                    localStorage.setItem("user_id", data.user.id);
                    localStorage.setItem("token", data.authorisation.token);
                    if(data.user.user_type_id == 2){
                        window.location.href = "../../edays/home.html";
                    }
                    else{
                        window.location.href = "admin/index.html";
                    }
                    
                }
                else {
                    console.error('Registration failed:', data.message);
                    err.innerText = "incorrect email or password";
                  }
            }
            catch(error){
                console.log('There was an error', error);
                err.innerText = "incorrect email or password";
            }
        }
        else{
            err.innerText = "Fill all requirement"
        }
    });
})