document.getElementById("formLogin").addEventListener('submit', function(e){
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    login(username, password)

})


function login (username, password){
    let message  = ''
    let alertType = ''
    localStorage.removeItem('token')
    const credentials = { username, password };
    fetch("https://fakestoreapi.com/auth/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    .then((response) =>{
        if(response.status === 200){
            alertType = 'success'
            message='Bienvenido'
            console.log('200 OK, responde bien' + response)
            alertBuilder(alertType, message)
            response.json().then((data) => {
                localStorage.setItem('token', data.token)
            })
            setTimeout(() => {
                location.href = 'admin/dashboard.html'
            }, 500) //equivalente a dos segundos de espera
        }
        else{
            alertType = 'danger'
            message = 'Correo o contraseña incorrectos.'
            alertBuilder(alertType, message)
        }
    })
    .catch((error) => {
        alertType = 'danger'
        message = 'Error inesperado.'
        console.error(error)
    })
    .then(data => console.log(data));
    
    
}

function alertBuilder(alertType, message){
    const alert = `
        <div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    document.getElementById('alert').innerHTML= alert;
}