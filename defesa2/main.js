// Variável global para armazenar os produtos
let produtos = [];

// Função para buscar produtos da API
async function fetchProdutos() {
    try {
        const resposta = await fetch('https://deisishop.pythonanywhere.com/products/');
        
        if (!resposta.ok) {
            throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        
        produtos = await resposta.json();
        console.log('Produtos recebidos:', produtos);
        
        if (!Array.isArray(produtos) || produtos.length === 0) {
            throw new Error('Dados de produtos inválidos ou vazios');
        }
        
        filterProducts(); // Alterado de gerarProdutos() para filterProducts()
    } catch (erro) {
        console.error('Erro ao buscar produtos:', erro);
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

    // Adiciona listeners para os filtros
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('orderFilter').addEventListener('change', filterProducts);
    document.getElementById('searchInput').addEventListener('input', filterProducts);

    document.querySelector('.checkout-form').addEventListener('submit', (event) => {
        event.preventDefault();
        processPurchase(event);
    });
    const botaoComprar = document.querySelector('#botao-comprar');
    if (botaoComprar) {
        botaoComprar.addEventListener('click', realizarCompra);
    }
});

function adicionarTodos() {
    const botaoAdicionar = document.querySelector('#botao-adicionar-todos');

    
}

// Event listener para adicionar ao carrinho
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
            const preco = product.price || 0;
            const productElement = document.createElement('div');
            productElement.classList.add('cart-item');
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>Custo: ${preco.toFixed(2)} €</p>
                <p>Quantidade: ${product.quantity}</p>
                <button class="remove-from-cart" data-id="${product.id}">Remover</button>
            `;
            cartContainer.appendChild(productElement);
        });

        const totalPrice = cart.reduce((total, product) => total + ((product.price || 0) * product.quantity), 0);
        const totalPriceElement = document.createElement('p');
        totalPriceElement.classList.add('cart-total');
        totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)} €`;
        cartContainer.appendChild(totalPriceElement);
    }
}

// Função para gerar produtos a partir da API
function filterProducts() {
  const categoryFilter = document.getElementById('categoryFilter').value.toLowerCase();
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const orderFilter = document.getElementById('orderFilter').value;

  console.log('Categoria selecionada:', categoryFilter); // Debug log

  let filteredProducts = [...produtos];

  if (orderFilter === 'price-asc') {
    filteredProducts.sort((a, b) => (a.rating || 0) - (b.rating || 0));
} else if (orderFilter === 'price-desc') {
    filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

  // Aplica filtro por categoria
  if (categoryFilter !== 'all') {
      filteredProducts = filteredProducts.filter(product => {
          const productCategory = product.category ? product.category.toLowerCase() : '';
          console.log('Comparando:', productCategory, 'com', categoryFilter); // Debug log
          
          // Mapeamento de categorias
          if (categoryFilter === 'tshirt') {
              return productCategory.includes('t-shirt') || 
                     productCategory.includes('tshirt') ||
                     productCategory.includes('t shirt');
          }
          
          return productCategory.includes(categoryFilter);
      });
  }

    // Aplica filtro de busca
    if (searchInput) {
        filteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(searchInput) ||
            product.description.toLowerCase().includes(searchInput)
        );
    }

    // Aplica ordenação por preço
    if (orderFilter === 'price-asc') {
        filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (orderFilter === 'price-desc') {
        filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    // Atualiza a exibição dos produtos
    const containerProdutos = document.querySelector('.products-container');
    containerProdutos.innerHTML = '';

    if (filteredProducts.length === 0) {
        containerProdutos.innerHTML = '<p class="no-results">Nenhum produto encontrado</p>';
        return;
    }

    filteredProducts.forEach(produto => {
        const nome = produto.title || 'Produto sem nome';
        const preco = produto.price || 0;
        const descricao = produto.description || 'Sem descrição';
        const imagem = produto.image || 'caminho/para/imagem/padrao.jpg';
        const id = produto.id;

        const produtoElemento = document.createElement('article');
        produtoElemento.classList.add('product');
        
        produtoElemento.innerHTML = `
            <img src="${imagem}" alt="${nome}" onerror="this.src='caminho/para/imagem/padrao.jpg'">
            <h2>${nome}</h2>
            <p class="product-price">Custo total: ${preco.toFixed(2)} €</p>
            <p class="product-description">${descricao}</p>
            <button class="add-to-cart-btn" data-id="${id}">Adicionar ao Cesto</button>
        `;
        
        containerProdutos.appendChild(produtoElemento);
    });

    setupAddToCartListeners();
}

async function realizarCompra() {
    // Usar o array cart em vez dos elementos DOM
    if (cart.length === 0) {
        mostrarErro('Carrinho vazio');
        return;
    }

    // Criar array de IDs considerando a quantidade de cada item
    const productIds = cart.reduce((ids, item) => {
        for (let i = 0; i < item.quantity; i++) {
            ids.push(item.id);
        }
        return ids;
    }, []);

    console.log('IDs dos produtos:', productIds); // Debug

    const requestData = {
        products: productIds,
        student: document.querySelector('#deisi-checkbox').checked,
        address: document.querySelector('#address').textContent,
        coupon: document.querySelector('#discount-input').value || null
    };

    try {
        const response = await fetch('https://deisishop.pythonanywhere.com/buy/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();

        if (response.ok) {
            mostrarSucesso(data);
            // Limpar o carrinho após compra bem-sucedida
            cart = []; // Adicionado para limpar o carrinho
            saveCartToLocalStorage(); // Adicionado para salvar o carrinho vazio no localStorage
            updateCartDisplay(); // Atualiza a exibição do carrinho
        } else {
            // Se houver erro, mas ainda houver itens que podem ser comprados, apenas exiba o total
            const totalCost = data.totalCost; // Total retornado da API
            const finalTotal = data.finalTotal; // Total com desconto retornado pela API

            // Mostrar o total final na página
            mostrarTotal(finalTotal);
        }

    } catch (error) {
        // Se ocorrer um erro de rede, exiba uma mensagem de erro
        mostrarErro('Erro ao processar a compra');
    }
}

// Função para mostrar o total na página
function mostrarTotal(total) {
    const totalDisplay = document.querySelector('#total-display');
    totalDisplay.innerHTML = `Total com desconto: ${total.toFixed(2)}€`;
}


function mostrarSucesso(data) {
    const resultadoCompra = document.querySelector('#resultado-compra');
    resultadoCompra.innerHTML = `
        <p class="final-price">Total a pagar: ${data.totalCost}€</p>
        <p class="payment-reference">Referência de pagamento: ${data.reference}</p>
        <p class="address">Morada: ${data.address}</p>
    `;
    resultadoCompra.className = 'purchase-result success';
    resultadoCompra.style.display = 'block';
}

function mostrarErro(mensagem) {
    const resultadoCompra = document.querySelector('#resultado-compra');
    resultadoCompra.innerHTML = `<p>${mensagem}</p>`;
    resultadoCompra.className = 'purchase-result error';
    resultadoCompra.style.display = 'block';
}




function limparCarrinho() {
    const cartContainer = document.querySelector('.cart-container');
    cartContainer.innerHTML = '<p class="cart-empty-message">Seu carrinho está vazio</p>';
}