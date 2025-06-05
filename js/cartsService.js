function getCarts(page){
    document.getElementById('cardHeader').innerHTML = '<h3>Lista de Carts</h3>'
    document.getElementById('info').innerHTML =''

    fetch("https://fakestoreapi.com/carts", {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(result => result.json())
    .then(data => {
        let listCarts = `
            <button type="button" class="btn btn-outline-success" onclick="addCart()"><i class="fa-solid fa-cart-plus" style="color: #00ad14;"></i></button>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Date</th>
                        <th scope="col"># Productos</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
        `

        data.forEach(cart => {
            listCarts += `
                <tr>
                    <td>${cart.id}</td>
                    <td>${new Date(cart.date).toLocaleDateString()}</td>
                    <td>${cart.products.length}</td>
                    <td>
                        <button type="button" class="btn btn-outline-primary" onclick="showInfoCart('${cart.id}')"><i class="fa-solid fa-eye"></i></button>
                    </td>
                </tr>
            `
        })

        listCarts += `
                </tbody>
            </table>
        `
        document.getElementById('info').innerHTML = listCarts
    })
    .catch(error => {
        console.error('Error:', error)
        document.getElementById('info').innerHTML = '<h3>No se encontraron carts</h3>'
    })
}

function showInfoCart(cartId){
    fetch("https://fakestoreapi.com/carts/" + cartId, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(result => result.json())
    .then(async cart => {
        const productDetails = await Promise.all(
            cart.products.map(async p => {
                const res = await fetch(`https://fakestoreapi.com/products/${p.productId}`)
                const product = await res.json()
                return {
                    title: product.title,
                    price: product.price,
                    quantity: p.quantity,
                    total: (product.price * p.quantity).toFixed(2)
                }
            })
        )
        showModalCart(cart, productDetails)
    })
    .catch(error => {
        console.error('Error:', error)
        document.getElementById('info').innerHTML = '<h3>No se Encontro el cart.</h3>'
    })
}

function showModalCart(cart, products){
    let productsHtml = ''
    products.forEach(p => {
        productsHtml += `
            <li>
                <strong>${p.title}</strong><br>
                Cantidad: ${p.quantity}<br>
                Precio unitario: $${p.price}<br>
                Total: $${p.total}
            </li><hr>
        `
    })

    const modalCart = `
        <div class="modal fade" id="modalCart" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Carrito ID: ${cart.id}</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p><strong>Usuario ID:</strong> ${cart.userId}</p>
                <p><strong>Fecha:</strong> ${new Date(cart.date).toLocaleDateString()}</p>
                <p><strong>Productos:</strong></p>
                <ul>${productsHtml}</ul>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
    `
    document.getElementById('showModal').innerHTML = modalCart

    const modal = new bootstrap.Modal(document.getElementById('modalCart'))
    modal.show()
}

function addCart(){
    const modalCart = `
      <div class="modal fade" id="modalCart" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Add Cart <i class="fa-solid fa-cart-plus" style="color: #00ad14;"></i></h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="card">
                <div class="card-body">
                  <form id="formAddCart">
                    <div class="mb-3">
                      <label for="userId" class="form-label">User Id</label>
                      <input type="text" class="form-control" id="userId" placeholder="User Id" required>
                    </div>
                    <div class="mb-3">
                      <label for="date" class="form-label">Date</label>
                      <input type="date" class="form-control" id="date" required>
                    </div>
                    <div class="mb-3">
                      <label for="productId" class="form-label">Product Id</label>
                      <input type="text" class="form-control" id="productId" placeholder="Product Id" required>
                    </div>
                    <div class="mb-3">
                      <label for="quantity" class="form-label">Quantity</label>
                      <input type="text" class="form-control" id="quantity" placeholder="Quantity" required>
                    </div>
                    <div class="mb-3 text-center">
                      <button type="button" class="btn btn-success" onclick="saveCart()">
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
    document.getElementById('showModal').innerHTML = modalCart
    const modal = new bootstrap.Modal(document.getElementById('modalCart'))
    modal.show()
  }
  
  function saveCart(){
    const form = document.getElementById('formAddCart')
    if(form.checkValidity()){
      const cartData = {
        userId: document.getElementById('userId').value,
        date: document.getElementById('date').value,
        products: {
          productId: document.getElementById('productId').value,
          quantity: document.getElementById('quantity').value
        }
      }
  
      fetch("https://fakestoreapi.com/carts", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(cartData)
      })
      .then(res => res.json())
      .then(data => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalCart'))
        modal.hide()
        getCarts()
      })
      .catch(error => {
        console.error("Error al crear el cart:", error)
        alert("No se pudo crear el cart.")
      })
    } else {
      form.reportValidity()
    }
  }