let cart = [];

// Adiciona produto ao carrinho
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productId = button.dataset.id;
    const product = getProductById(productId);
    addToCart(product);
    updateCartDisplay();
  });
});

// Atualiza a exibição do carrinho
function updateCartDisplay() {
  const cartContainer = document.querySelector('.cart-container');
  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Seu cesto está vazio</p>';
  } else {
    cart.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('cart-item');
      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>Custo: ${product.price.toFixed(2)} €</p>
        <button class="remove-from-cart" data-id="${product.id}">Remover</button>
      `;
      cartContainer.appendChild(productElement);
    });

    const totalPrice = cart.reduce((total, product) => total + product.price, 0);
    const totalPriceElement = document.createElement('p');
    totalPriceElement.classList.add('cart-total');
    totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;
    cartContainer.appendChild(totalPriceElement);
  }
}

// Função auxiliar para obter o produto pelo ID
function getProductById(id) {
  return produtos.find(product => product.id == id);
}

// Adiciona o produto ao carrinho
function addToCart(product) {
  cart.push(product);
}

function gerarProdutos() {
  const containerProdutos = document.querySelector('.products-container');
  
  // Limpa o container antes de adicionar os produtos
  containerProdutos.innerHTML = '';

  // Itera sobre cada produto no array
  produtos.forEach(produto => {
    // Cria um novo elemento de artigo para cada produto
    const produtoElemento = document.createElement('article');
    produtoElemento.classList.add('product');
    
    produtoElemento.innerHTML = `
      <img src="${produto.image}" alt="${produto.title}">
      <h2>${produto.title}</h2>
      <p class="product-price">Custo total: ${produto.price.toFixed(2)} €</p>
      <p class="product-description">${produto.description}</p>
      <button class="add-to-cart-btn" data-id="${produto.id}">Adicionar ao Cesto</button>
    `;
    
    // Adiciona o elemento de produto ao container
    containerProdutos.appendChild(produtoElemento);
  });
}

// Chama a função quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', gerarProdutos);