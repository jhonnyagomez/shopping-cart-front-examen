function getProducts(){
    document.getElementById('cardHeader').innerHTML = '<h3>Lista de Productos</h3>'
    document.getElementById('info').innerHTML =''

     fetch("https://fakestoreapi.com/products", {
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
                 let listProducts = `
                 <button type="button" class="btn btn-outline-success" onclick="addProduct()"><i class="fa-regular fa-square-plus" style="color: #00ad42;"></i></button>
                     <table class="table">
                         <thead>
                             <tr>
                             <th scope="col">Id</th>
                             <th scope="col">Title</th>
                             <th scope="col">Price</th>
                             <th scope="col">Category</th>
                             <th scope="col">Image</th>
                             <th scope="col">Action</th>
                             </tr>
                         </thead>
                       <tbody>
                 `
                 response.body.forEach(product => {
                     listProducts = listProducts.concat(`
                         <tr>
                             <td>${product.id}</td>
                             <td>${product.title}</td>
                             <td>${product.price}</td>
                             <td>${product.category}</td>
                             <td><img src="${product.image}" class="img-thumbnail" alt="Imagen del producto"></td>
                             <td>
                                <button type="button" class="btn btn-outline-primary" onclick="showInfoProduct('${product.id}')"><i class="fa-solid fa-eye"></i></button>
                            </td>
                         </tr>
                         `)
                 })
                 listProducts = listProducts.concat(`
                         </tbody>
                     </table>
                     `)
                     document.getElementById('info').innerHTML = listProducts
         }
         else{
             document.getElementById('info').innerHTML = '<h3>No se encontraron productos</h3>'
         }
     }) 
 }

 function showInfoProduct(productId){
  fetch("https://fakestoreapi.com/products/"+productId, {
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
            showModalProduct(response.body)
        }else{
            document.getElementById('info').innerHTML = '<h3>No se Encontro el producto.</h3>'
        }
    })
}

function showModalProduct(product){
    const modalProduct = `
        <div class="modal fade" id="modalProduct" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-sm">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Show Product</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="card">
                  <img src="${product.image}" class="card-img-top" alt="productImage">
                  <div class="card-body">
                    <h5 class="card-title">Product Info</h5>
                    <p class="card-text">Titulo: ${product.title}</p>
                    <p class="card-text">Category: ${product.category}</p>
                    <p class="card-text">Price: ${product.price}</p>
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
    document.getElementById('showModal').innerHTML = modalProduct

    const modal = new bootstrap.Modal(document.getElementById('modalProduct'))
    modal.show()
}

function addProduct(){
  const modalProduct = `
    <div class="modal fade" id="modalProduct" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Add Product <i class="fa-solid fa-boxes-stacked" style="color: #00ad42;"></i></h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="card">
              <div class="card-body">
                <form id="formAddProduct">
                  <div class="mb-3">
                    <label for="tittle" class="form-label">Tittle</label>
                    <input type="text" class="form-control" id="tittle" placeholder="Tittle" required>
                  </div>
                  <div class="mb-3">
                    <label for="price" class="form-label">Price</label>
                    <input type="text" class="form-control" id="price" placeholder="Price" required>
                  </div>
                  <div class="mb-3">
                    <label for="category" class="form-label">Category</label>
                    <input type="text" class="form-control" id="category" placeholder="Category" required>
                  </div>
                  <div class="mb-3 text-center">
                    <button type="button" class="btn btn-success" onclick="saveProduct()">
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
  document.getElementById('showModal').innerHTML = modalProduct
  const modal = new bootstrap.Modal(document.getElementById('modalProduct'))
  modal.show()
}

function saveProduct(){
  const form = document.getElementById('formAddProduct')
  if(form.checkValidity()){
    const productData = {
      tittle: document.getElementById('tittle').value,
      price: document.getElementById('price').value,
      category: document.getElementById('category').value,
      description: document.getElementById('description').value
    }

    fetch("https://fakestoreapi.com/products", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(productData)
    })
    .then(res => res.json())
    .then(data => {
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalProduct'))
      modal.hide()
      getProducts()
    })
    .catch(error => {
      console.error("Error al crear producto:", error)
      alert("No se pudo crear el producto.")
    })
  } else {
    form.reportValidity()
  }
}
