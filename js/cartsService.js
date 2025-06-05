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
