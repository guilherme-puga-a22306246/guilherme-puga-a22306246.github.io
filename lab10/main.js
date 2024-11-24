// Variável global para armazenar os produtos
let produtos = [];

// Função para buscar produtos da API
async function fetchProdutos() {
  try {
    // URL da API de produtos
    const url = 'https://deisishop.pythonanywhere.com/products/';
    
    // Realiza a requisição usando fetch
    const resposta = await fetch(url);
    
    // Verifica se a resposta é bem-sucedida
    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }
    
    // Converte a resposta para JSON
    produtos = await resposta.json();
    
    // Gera os produtos na página após carregá-los
    gerarProdutos();
  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro);
    
    // Exibe mensagem de erro para o usuário
    const containerProdutos = document.querySelector('.products-container');
    containerProdutos.innerHTML = `
      <div class="erro-carregamento">
        <p>Não foi possível carregar os produtos.</p>
        <p>Erro: ${erro.message}</p>
        <button onclick="fetchProdutos()">Tentar Novamente</button>
      </div>
    `;
  }
}

// Array para armazenar os produtos no carrinho
let cart = [];

// Carrega o carrinho do localStorage quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
  // Carrega o carrinho salvo no localStorage
  loadCartFromLocalStorage();

  // Busca os produtos da API
  fetchProdutos();

  // Atualiza a exibição do carrinho com os itens salvos
  updateCartDisplay();
});

// Event listener para adicionar ao carrinho (movido para dentro de fetchProdutos())
function setupAddToCartListeners() {
  // Adiciona event listeners para os botões de adicionar ao carrinho
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      const product = getProductById(productId);
      
      if (product) {
        addToCart(product);
        updateCartDisplay();
        // Salva o carrinho atualizado no localStorage
        saveCartToLocalStorage();
      }
    });
  });

  // Adiciona event listener para remoção de produtos do carrinho (delegação de evento)
  document.querySelector('.cart-container').addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-from-cart')) {
      const productId = event.target.getAttribute('data-id');
      removeFromCart(productId);
      updateCartDisplay();
      // Salva o carrinho atualizado no localStorage
      saveCartToLocalStorage();
    }
  });
}

// Função para salvar o carrinho no localStorage
function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Função para carregar o carrinho do localStorage
function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

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
        <img src="${product.imagem}" alt="${product.nome}">
        <h3>${product.nome}</h3>
        <p>Custo: ${product.preco.toFixed(2)} €</p>
        <p>Quantidade: ${product.quantity}</p>
        <button class="remove-from-cart" data-id="${product.id}">Remover</button>
      `;
      cartContainer.appendChild(productElement);
    });

    const totalPrice = cart.reduce((total, product) => total + (product.preco * product.quantity), 0);
    const totalPriceElement = document.createElement('p');
    totalPriceElement.classList.add('cart-total');
    totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;
    cartContainer.appendChild(totalPriceElement);
  }
}

// Função para gerar produtos a partir da API
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
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h2>${produto.nome}</h2>
      <p class="product-price">Custo total: ${produto.preco.toFixed(2)} €</p>
      <p class="product-description">${produto.descricao}</p>
      <button class="add-to-cart-btn" data-id="${produto.id}">Adicionar ao Cesto</button>
    `;
    
    // Adiciona o elemento de produto ao container
    containerProdutos.appendChild(produtoElemento);
  });

  // Configura os listeners de adicionar ao carrinho após gerar os produtos
  setupAddToCartListeners();
}