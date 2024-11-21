// Array para armazenar os produtos no carrinho
let cart = [];

// Adiciona evento aos botões de adicionar ao carrinho quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Gera os produtos
  gerarProdutos();

  // Adiciona event listeners para os botões de adicionar ao carrinho
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      const product = getProductById(productId);
      
      if (product) {
        addToCart(product);
        updateCartDisplay();
      }
    });
  });

  // Adiciona event listener para remoção de produtos do carrinho (delegação de evento)
  document.querySelector('.cart-container').addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-from-cart')) {
      const productId = event.target.getAttribute('data-id');
      removeFromCart(productId);
      updateCartDisplay();
    }
  });
});

// Função para obter o produto pelo ID
function getProductById(id) {
  return produtos.find(product => product.id == id);
}

// Função para adicionar produto ao carrinho
function addToCart(product) {
  // Verifica se o produto já está no carrinho
  const existingProduct = cart.find(item => item.id === product.id);
  
  if (existingProduct) {
    // Se já existir, incrementa a quantidade
    existingProduct.quantity = (existingProduct.quantity || 1) + 1;
  } else {
    // Se não existir, adiciona com quantidade 1
    cart.push({...product, quantity: 1});
  }
}

// Função para remover produto do carrinho
function removeFromCart(productId) {
  const index = cart.findIndex(item => item.id == productId);
  
  if (index !== -1) {
    // Se a quantidade for maior que 1, decrementa
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      // Se for 1, remove completamente do carrinho
      cart.splice(index, 1);
    }
  }
}

// Atualiza a exibição do carrinho
function updateCartDisplay() {
  const cartContainer = document.querySelector('.cart-container');
  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p class="cart-empty-message">Seu cesto está vazio</p>';
  } else {
    cart.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('cart-item');
      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>Custo: ${product.price.toFixed(2)} €</p>
        <p>Quantidade: ${product.quantity}</p>
        <button class="remove-from-cart" data-id="${product.id}">Remover</button>
      `;
      cartContainer.appendChild(productElement);
    });

    const totalPrice = cart.reduce((total, product) => total + (product.price * product.quantity), 0);
    const totalPriceElement = document.createElement('p');
    totalPriceElement.classList.add('cart-total');
    totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;
    cartContainer.appendChild(totalPriceElement);
  }
}

// Função para gerar produtos (mantida igual)
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