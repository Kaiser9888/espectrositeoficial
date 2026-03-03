// ===== MAIN.JS - Funções globais e utilitários =====

// Aguardar DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Espectro Bikes - Marketplace carregado!');
    
    // Inicializar componentes
    initMenuMobile();
    initSearch();
    initBanner();
    initCountdown();
    initTooltips();
    initMascaras();
    initNotificacoes();
    initFavoritos();
    initProdutosRecentes();
    
    // Carregar dados mockados
    carregarProdutosRecentes();
    carregarTodosProdutos();
    
    // Atualizar badges
    atualizarBadges();
});

// ===== MENU MOBILE =====
function initMenuMobile() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if(menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            // Animação do ícone
            const icon = this.querySelector('i');
            if(mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Dropdown mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        if(window.innerWidth <= 991) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });
}

// ===== BUSCA =====
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if(searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            realizarBusca(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if(e.key === 'Enter') {
                realizarBusca(this.value);
            }
        });
        
        // Autocomplete (simulado)
        searchInput.addEventListener('input', debounce(function() {
            const termo = this.value.toLowerCase();
            if(termo.length >= 3) {
                sugestoesBusca(termo);
            }
        }, 300));
    }
}

function realizarBusca(termo) {
    if(termo.trim()) {
        console.log('Buscando por:', termo);
        // Salvar termo no histórico
        salvarHistoricoBusca(termo);
        // Redirecionar para página de busca
        window.location.href = `categoria.html?busca=${encodeURIComponent(termo)}`;
    }
}

function salvarHistoricoBusca(termo) {
    let historico = JSON.parse(localStorage.getItem('historicoBusca') || '[]');
    
    // Remover se já existe
    historico = historico.filter(item => item.toLowerCase() !== termo.toLowerCase());
    
    // Adicionar no início
    historico.unshift(termo);
    
    // Manter apenas 10 itens
    historico = historico.slice(0, 10);
    
    localStorage.setItem('historicoBusca', JSON.stringify(historico));
}

function sugestoesBusca(termo) {
    // Aqui seria integrado com API real
    console.log('Sugestões para:', termo);
}

// ===== BANNER =====
function initBanner() {
    const slides = document.querySelectorAll('.banner-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('bannerPrev');
    const nextBtn = document.getElementById('bannerNext');
    
    if(!slides.length) return;
    
    let currentSlide = 0;
    let interval;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    function nextSlide() {
        let next = currentSlide + 1;
        if(next >= slides.length) next = 0;
        showSlide(next);
    }
    
    function prevSlide() {
        let prev = currentSlide - 1;
        if(prev < 0) prev = slides.length - 1;
        showSlide(prev);
    }
    
    // Eventos dos botões
    if(prevBtn) prevBtn.addEventListener('click', prevSlide);
    if(nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    // Eventos dos dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });
    
    // Auto-play
    function startAutoPlay() {
        interval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoPlay() {
        clearInterval(interval);
    }
    
    startAutoPlay();
    
    // Parar auto-play ao interagir
    const banner = document.querySelector('.banner-slider');
    if(banner) {
        banner.addEventListener('mouseenter', stopAutoPlay);
        banner.addEventListener('mouseleave', startAutoPlay);
    }
}

// ===== COUNTDOWN =====
function initCountdown() {
    const countdown = document.getElementById('countdown');
    if(!countdown) return;
    
    // Definir data alvo (24 horas a partir de agora)
    const targetDate = new Date();
    targetDate.setHours(targetDate.getHours() + 24);
    
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        
        if(diff <= 0) {
            document.querySelector('.promo-content').innerHTML = '<h2>Promoção encerrada!</h2>';
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.querySelector('.count-number:first-child').textContent = hours.toString().padStart(2, '0');
        document.querySelector('.count-number:nth-child(2)').textContent = minutes.toString().padStart(2, '0');
        document.querySelector('.count-number:nth-child(3)').textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== TOOLTIPS =====
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    // Já funciona via CSS
}

// ===== MÁSCARAS =====
function initMascaras() {
    // CPF
    document.querySelectorAll('.cpf-mask').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if(value.length <= 11) {
                if(value.length <= 3) {
                    value = value;
                } else if(value.length <= 6) {
                    value = value.replace(/^(\d{3})(\d)/, '$1.$2');
                } else if(value.length <= 9) {
                    value = value.replace(/^(\d{3})(\d{3})(\d)/, '$1.$2.$3');
                } else {
                    value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                }
            }
            e.target.value = value;
        });
    });
    
    // Telefone
    document.querySelectorAll('.tel-mask').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if(value.length <= 11) {
                if(value.length <= 2) {
                    value = '(' + value;
                } else if(value.length <= 6) {
                    value = '(' + value.substring(0,2) + ') ' + value.substring(2);
                } else {
                    value = '(' + value.substring(0,2) + ') ' + value.substring(2,7) + '-' + value.substring(7,11);
                }
            }
            e.target.value = value;
        });
    });
    
    // CEP
    document.querySelectorAll('.cep-mask').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if(value.length > 5) {
                value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    });
    
    // Cartão de crédito
    document.querySelectorAll('.cartao-mask').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        });
    });
    
    // Validade
    document.querySelectorAll('.validade-mask').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if(value.length > 2) {
                value = value.substring(0,2) + '/' + value.substring(2,4);
            }
            e.target.value = value;
        });
    });
    
    // CVV
    document.querySelectorAll('.cvv-mask').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0,4);
            e.target.value = value;
        });
    });
    
    // Preço
    document.querySelectorAll('.preco-mask').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = (parseInt(value) / 100).toFixed(2);
            value = value.replace('.', ',');
            value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            e.target.value = value;
        });
    });
}

// ===== NOTIFICAÇÕES =====
function initNotificacoes() {
    const notifIcon = document.getElementById('notificationIcon');
    const notifDropdown = document.querySelector('.notification-dropdown');
    
    if(notifIcon && notifDropdown) {
        notifIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            notifDropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', function() {
            notifDropdown.classList.remove('active');
        });
        
        notifDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Marcar como lidas
    document.querySelector('.mark-read')?.addEventListener('click', function() {
        document.querySelectorAll('.notification-item.nova').forEach(item => {
            item.classList.remove('nova');
        });
        document.getElementById('notifBadge').textContent = '0';
    });
}

// ===== FAVORITOS =====
function initFavoritos() {
    // Carregar favoritos do localStorage
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    
    // Marcar itens favoritados
    favoritos.forEach(id => {
        const btn = document.querySelector(`.card-favorito[data-id="${id}"]`);
        if(btn) {
            const icon = btn.querySelector('i');
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.classList.add('favoritado');
        }
    });
    
    // Event listeners para botões de favorito
    document.querySelectorAll('.card-favorito').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const id = this.dataset.id || Math.random().toString(36);
            const icon = this.querySelector('i');
            
            if(icon.classList.contains('far')) {
                // Adicionar aos favoritos
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.classList.add('favoritado');
                
                if(!favoritos.includes(id)) {
                    favoritos.push(id);
                }
                
                mostrarNotificacao('Produto adicionado aos favoritos!', 'sucesso');
            } else {
                // Remover dos favoritos
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.classList.remove('favoritado');
                
                favoritos = favoritos.filter(favId => favId !== id);
                
                mostrarNotificacao('Produto removido dos favoritos', 'info');
            }
            
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
        });
    });
}

// ===== PRODUTOS RECENTES =====
function initProdutosRecentes() {
    // Carregar produtos recentes do localStorage
    let recentes = JSON.parse(localStorage.getItem('recentes') || '[]');
    
    // Se estiver na página de produto, adicionar aos recentes
    const produtoId = new URLSearchParams(window.location.search).get('id');
    if(produtoId && !recentes.includes(produtoId)) {
        recentes.unshift(produtoId);
        recentes = recentes.slice(0, 10); // Manter apenas 10
        localStorage.setItem('recentes', JSON.stringify(recentes));
    }
}

// ===== CARREGAR PRODUTOS =====
function carregarProdutosRecentes() {
    const container = document.getElementById('recentProducts');
    if(!container) return;
    
    const recentes = JSON.parse(localStorage.getItem('recentes') || '[]');
    
    if(recentes.length === 0) {
        container.innerHTML = '<p class="sem-produtos">Nenhum produto pesquisado recentemente</p>';
        return;
    }
    
    // Buscar produtos mockados
    const produtos = window.produtosMock || [];
    const produtosRecentes = produtos.filter(p => recentes.includes(p.id.toString()));
    
    renderizarProdutos(produtosRecentes, container);
}

function carregarTodosProdutos() {
    const container = document.getElementById('allProducts');
    if(!container) return;
    
    const produtos = window.produtosMock || [];
    renderizarProdutos(produtos, container);
}

function renderizarProdutos(produtos, container) {
    if(!produtos.length) {
        container.innerHTML = '<p class="sem-produtos">Nenhum produto encontrado</p>';
        return;
    }
    
    let html = '';
    produtos.forEach(produto => {
        html += `
            <div class="produto-card">
                <div class="card-img">
                    <img src="${produto.imagem || 'assets/produtos/default.jpg'}" alt="${produto.nome}">
                    ${produto.condicao === 'novo' ? '<span class="card-badge">Novo</span>' : ''}
                    <button class="card-favorito" data-id="${produto.id}">
                        <i class="${produto.favoritado ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                <div class="card-info">
                    <h3><a href="produto.html?id=${produto.id}">${produto.nome}</a></h3>
                    <div class="card-preco">
                        <span class="preco-atual">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                        <span class="preco-parcela">12x R$ ${(produto.preco/12).toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div class="card-frete">
                        <i class="fas fa-truck"></i> 
                        ${produto.freteGratis ? 'Frete grátis' : `Frete R$ ${produto.frete.toFixed(2).replace('.', ',')}`}
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Re-inicializar favoritos
    initFavoritos();
}

// ===== BADGES =====
function atualizarBadges() {
    // Carrinho
    const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
    const cartBadge = document.getElementById('cartBadge');
    if(cartBadge) {
        cartBadge.textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    }
    
    // Mensagens (mock)
    const msgBadge = document.getElementById('msgBadge');
    if(msgBadge) {
        msgBadge.textContent = '3';
    }
    
    // Notificações (mock)
    const notifBadge = document.getElementById('notifBadge');
    if(notifBadge) {
        notifBadge.textContent = '5';
    }
}

// ===== NOTIFICAÇÕES FLUTUANTES =====
function mostrarNotificacao(mensagem, tipo = 'info') {
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao-flutuante ${tipo}`;
    notificacao.innerHTML = `
        <i class="fas ${tipo === 'sucesso' ? 'fa-check-circle' : 
                        tipo === 'erro' ? 'fa-exclamation-circle' : 
                        'fa-info-circle'}"></i>
        <span>${mensagem}</span>
    `;
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notificacao.classList.remove('show');
        setTimeout(() => {
            notificacao.remove();
        }, 300);
    }, 3000);
}

// ===== DEBOUNCE =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== FORMATAÇÃO =====
function formatarPreco(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}

// ===== VALIDAÇÕES =====
function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if(cpf.length !== 11) return false;
    
    // Validação simples (para exemplo)
    if(/^(\d)\1{10}$/.test(cpf)) return false;
    
    return true;
}

function validarCEP(cep) {
    return /^\d{5}-?\d{3}$/.test(cep);
}

// ===== EXPORT (para uso em outros arquivos) =====
window.utils = {
    formatarPreco,
    formatarData,
    validarEmail,
    validarCPF,
    validarCEP,
    mostrarNotificacao,
    debounce
};