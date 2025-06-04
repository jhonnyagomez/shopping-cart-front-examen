function getUsers(){
    document.getElementById('cardHeader').innerHTML = '<h4>Lista de Usuarios</h4>'
    
    fetch("https://fakestoreapi.com/users", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then((result) =>{
        return result.json().then(
            data => {
                return {
                    status: result.status,
                    body: data
                }
            }
        )
    })
    .then((response) => {
        if(response.status == 200){
                let listUsers = `
                <button type="button" class="btn btn-outline-success" onclick="addUser()"><i class="fa-solid fa-user-plus"></i></button>
                    <table class="table">
                        <thead>
                            <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Username</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Action</th>
                            </tr>
                        </thead>
                      <tbody>
                `
                response.body.forEach(user => {
                    listUsers = listUsers.concat(`
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name.firstname}</td>
                            <td>${user.email}</td>
                            <td>${user.username}</td>
                            <td>${user.phone}</td>
                            <td>
                                <button type="button" class="btn btn-outline-primary" onclick="showInfoUser('${user.id}')">View</button>
                            </td>
                        </tr>
                        `)
                })
                listUsers = listUsers.concat(`
                        </tbody>
                    </table>
                    `)
                    document.getElementById('info').innerHTML = listUsers
        }
        else{
            document.getElementById('info').innerHTML = '<h3>No se encontraron usuarios</h3>'
        }
    }) 
    
}

function showInfoUser(userId){
    fetch("https://fakestoreapi.com/users/"+userId, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then((result) =>{
        return result.json().then(
            data => {
                return {
                    status: result.status,
                    body: data
                }
            }
        )
    })
    .then((response) =>{
        if(response.status === 200){
            showModalUser(response.body)
        }else{
            document.getElementById('info').innerHTML = '<h3>No se Encontro el usuario.</h3>'
        }
    })
}

function showModalUser(user){
    const modalUser = `
        <div class="modal fade" id="modalUser" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-sm">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Show User</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">User Info</h5>
                    <p class="card-text">Username: ${user.name.firstname}</p>
                    <p class="card-text">Email: ${user.email}</p>
                    <p class="card-text">Phone: ${user.phone}</p>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
    `
    document.getElementById('showModal').innerHTML = modalUser

    const modal = new bootstrap.Modal(document.getElementById('modalUser'))
    modal.show()
}

function addUser(){
  const modalUser = `
    <div class="modal fade" id="modalUser" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Add User <i class="fa-solid fa-user-plus"></i></h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="card">
              <div class="card-body">
                <form id="formAddUser">
                  <div class="mb-3">
                    <label for="firstname" class="form-label">First Name</label>
                    <input type="text" class="form-control" id="firstname" placeholder="First Name" required>
                  </div>
                  <div class="mb-3">
                    <label for="lastname" class="form-label">Last Name</label>
                    <input type="text" class="form-control" id="lastname" placeholder="Last Name" required>
                  </div>
                  <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control" id="username" placeholder="Username" required>
                  </div>
                  <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" class="form-control" id="email" placeholder="Email" required>
                  </div>
                  <div class="mb-3">
                    <label for="phone" class="form-label">Phone</label>
                    <input type="text" class="form-control" id="phone" placeholder="Phone" required>
                  </div>
                  <div class="mb-3 text-center">
                    <button type="button" class="btn btn-success" onclick="saveUser()">
                      Save <i class="fa-solid fa-floppy-disk"></i>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `
  document.getElementById('showModal').innerHTML = modalUser
  const modal = new bootstrap.Modal(document.getElementById('modalUser'))
  modal.show()
}

function saveUser(){
  const form = document.getElementById('formAddUser')
  if(form.checkValidity()){
    const userData = {
      email: document.getElementById('email').value,
      username: document.getElementById('username').value,
      password: "123456",
      name: {
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value
      },
      address: {
        city: "Ciudad",
        street: "Calle",
        number: 1,
        zipcode: "00000",
        geolocation: {
          lat: "0.0",
          long: "0.0"
        }
      },
      phone: document.getElementById('phone').value
    }

    fetch("https://fakestoreapi.com/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(userData)
    })
    .then(res => res.json())
    .then(data => {
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalUser'))
      modal.hide()
      getUsers()
    })
    .catch(error => {
      console.error("Error al crear usuario:", error)
      alert("No se pudo crear el usuario.")
    })
  } else {
    form.reportValidity()
  }
}
