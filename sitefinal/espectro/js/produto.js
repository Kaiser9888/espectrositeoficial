// ===== PRODUTO.JS - Gerenciamento da página de produto =====

// Classe da página de produto
class ProdutoPage {
    constructor() {
        this.produtoId = null;
        this.produto = null;
        this.imagemAtual = 0;
        this.init();
    }

    // Inicializar
    init() {
        // Pegar ID da URL
        const urlParams = new URLSearchParams(window.location.search);
        this.produtoId = urlParams.get('id');
        
        if (this.produtoId) {
            this.carregarProduto();
            this.initEventListeners();
        }
    }

    // Carregar dados do produto
    async carregarProduto() {
        try {
            // Tentar carregar da API
            if (window.ProductAPI) {
                this.produto = await window.ProductAPI.getById(this.produtoId);
            } else {
                // Carregar dos dados mockados
                this.produto = window.produtosMock?.find(p => p.id == this.produtoId);
            }

            if (this.produto) {
                this.renderizarProduto();
                this.renderizarAvaliacoes();
                this.renderizarRelacionados();
                this.initGaleria();
                this.atualizarHistorico();
            } else {
                this.mostrarErro('Produto não encontrado');
            }
        } catch (error) {
            console.error('Erro ao carregar produto:', error);
            this.mostrarErro('Erro ao carregar produto');
        }
    }

    // Renderizar produto
    renderizarProduto() {
        // Título
        document.querySelector('.produto-titulo').textContent = this.produto.nome;

        // Preços
        if (this.produto.precoAntigo) {
            document.querySelector('.preco-antigo').textContent = 
                `R$ ${this.produto.precoAntigo.toFixed(2).replace('.', ',')}`;
        }

        document.querySelector('.preco-atual').textContent = 
            `R$ ${this.produto.preco.toFixed(2).replace('.', ',')}`;

        const parcela = this.produto.preco / 12;
        document.querySelector('.preco-parcela').innerHTML = 
            `em até 12x de <strong>R$ ${parcela.toFixed(2).replace('.', ',')}</strong> sem juros`;

        if (this.produto.precoAntigo) {
            const economia = this.produto.precoAntigo - this.produto.preco;
            const percentual = (economia / this.produto.precoAntigo * 100).toFixed(0);
            document.querySelector('.preco-desconto').textContent = 
                `Economize R$ ${economia.toFixed(2).replace('.', ',')} (${percentual}% OFF)`;
        }

        // Condição
        const condicaoMap = {
            'novo': 'Produto novo',
            'seminovo': 'Produto seminovo',
            'usado': 'Produto usado',
            'recondicionado': 'Produto recondicionado'
        };
        document.querySelector('.produto-condicao span').textContent = 
            `${condicaoMap[this.produto.condicao] || 'Produto novo'} | Em estoque (${this.produto.estoque} unidades)`;

        // Avaliações
        const mediaAvaliacoes = this.calcularMediaAvaliacoes();
        const estrelas = this.renderizarEstrelas(mediaAvaliacoes);
        document.querySelector('.estrelas').innerHTML = estrelas;
        document.querySelector('.avaliacao-nota').textContent = mediaAvaliacoes.toFixed(1);
        document.querySelector('.avaliacao-count').textContent = 
            `(${this.produto.avaliacoes?.length || 0} avaliações)`;

        // Vendedor
        if (this.produto.vendedor) {
            document.querySelector('.vendedor-nome').textContent = this.produto.vendedor.nome;
            document.querySelector('.vendedor-rating').innerHTML = `
                ${this.renderizarEstrelas(this.produto.vendedor.avaliacao || 5)}
                <span>${this.produto.vendedor.avaliacao || 5} (${this.produto.vendedor.totalVendas || 0} vendas)</span>
            `;
            document.querySelector('.vendedor-local span').textContent = this.produto.vendedor.local || 'Brasil';
        }

        // Galeria
        this.renderizarGaleria();

        // Descrição
        if (document.querySelector('.descricao-content')) {
            document.querySelector('.descricao-content').innerHTML = 
                this.produto.descricao || 'Descrição não disponível';
        }

        // Características
        this.renderizarCaracteristicas();
    }

    // Renderizar galeria
    renderizarGaleria() {
        const imagens = this.produto.imagens || ['assets/produtos/default.jpg'];
        
        // Imagem principal
        const imgPrincipal = document.getElementById('imagemPrincipal');
        if (imgPrincipal) {
            imgPrincipal.src = imagens[0];
            imgPrincipal.alt = this.produto.nome;
        }

        // Thumbnails
        const thumbsContainer = document.getElementById('galeriaThumbs');
        if (thumbsContainer) {
            let thumbsHtml = '';
            imagens.forEach((img, index) => {
                thumbsHtml += `
                    <div class="thumb ${index === 0 ? 'active' : ''}" data-index="${index}">
                        <img src="${img}" alt="Thumb ${index + 1}">
                    </div>
                `;
            });
            thumbsContainer.innerHTML = thumbsHtml;
        }
    }

    // Renderizar avaliações
    renderizarAvaliacoes() {
        const container = document.getElementById('avaliacoesLista');
        if (!container) return;

        if (!this.produto.avaliacoes || this.produto.avaliacoes.length === 0) {
            container.innerHTML = '<p class="sem-avaliacoes">Este produto ainda não tem avaliações. Seja o primeiro a avaliar!</p>';
            return;
        }

        let html = '';
        this.produto.avaliacoes.forEach(avaliacao => {
            html += `
                <div class="avaliacao-item">
                    <div class="avaliacao-header">
                        <div class="avaliador-info">
                            <img src="${avaliacao.avatar || 'assets/icons/avatar-default.jpg'}" alt="${avaliacao.usuario}" class="avaliador-avatar">
                            <div class="avaliador-nome">
                                <strong>${avaliacao.usuario}</strong>
                                <span>Comprador verificado</span>
                            </div>
                        </div>
                        <div class="avaliacao-nota">
                            ${this.renderizarEstrelas(avaliacao.nota)}
                        </div>
                    </div>
                    <div class="avaliacao-data">${this.formatarData(avaliacao.data)}</div>
                    <p class="avaliacao-texto">${avaliacao.comentario}</p>
                    ${avaliacao.fotos ? this.renderizarFotosAvaliacao(avaliacao.fotos) : ''}
                    <div class="avaliacao-ajuda">
                        <span>Essa avaliação foi útil?</span>
                        <button class="btn-ajuda"><i class="far fa-thumbs-up"></i> 0</button>
                        <button class="btn-ajuda"><i class="far fa-thumbs-down"></i> 0</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Renderizar fotos da avaliação
    renderizarFotosAvaliacao(fotos) {
        if (!fotos || fotos.length === 0) return '';

        let fotosHtml = '<div class="avaliacao-fotos">';
        fotos.forEach(foto => {
            fotosHtml += `<img src="${foto}" alt="Foto da avaliação">`;
        });
        fotosHtml += '</div>';

        return fotosHtml;
    }

    // Renderizar produtos relacionados
    renderizarRelacionados() {
        const container = document.getElementById('relacionadosGrid');
        if (!container) return;

        // Pegar produtos da mesma categoria
        const relacionados = window.produtosMock
            ?.filter(p => p.categoria === this.produto.categoria && p.id != this.produto.id)
            .slice(0, 4) || [];

        if (relacionados.length === 0) {
            container.innerHTML = '<p>Nenhum produto relacionado encontrado</p>';
            return;
        }

        let html = '';
        relacionados.forEach(produto => {
            html += `
                <div class="produto-card">
                    <div class="card-img">
                        <img src="${produto.imagens?.[0] || 'assets/produtos/default.jpg'}" alt="${produto.nome}">
                        ${produto.condicao === 'novo' ? '<span class="card-badge">Novo</span>' : ''}
                        <button class="card-favorito" data-id="${produto.id}">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                    <div class="card-info">
                        <h3><a href="produto.html?id=${produto.id}">${produto.nome.substring(0, 50)}...</a></h3>
                        <div class="card-preco">
                            <span class="preco-atual">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                            <span class="preco-parcela">12x R$ ${(produto.preco/12).toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div class="card-frete">
                            <i class="fas fa-truck"></i> 
                            ${produto.freteGratis ? 'Frete grátis' : 'Frete a calcular'}
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Renderizar características
    renderizarCaracteristicas() {
        const container = document.querySelector('.caracteristicas-grid');
        if (!container || !this.produto.especificacoes) return;

        let html = '';
        Object.entries(this.produto.especificacoes).forEach(([key, value]) => {
            html += `
                <div class="caracteristica-item">
                    <span class="carac-label">${key}</span>
                    <span class="carac-value">${value}</span>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // Inicializar galeria
    initGaleria() {
        // Clique nos thumbnails
        document.querySelectorAll('.thumb').forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                this.trocarImagem(index);
            });
        });

        // Botões anterior/próximo
        document.querySelector('.galeria-prev')?.addEventListener('click', () => {
            const total = this.produto.imagens?.length || 1;
            const novoIndex = (this.imagemAtual - 1 + total) % total;
            this.trocarImagem(novoIndex);
        });

        document.querySelector('.galeria-next')?.addEventListener('click', () => {
            const total = this.produto.imagens?.length || 1;
            const novoIndex = (this.imagemAtual + 1) % total;
            this.trocarImagem(novoIndex);
        });

        // Fullscreen
        document.querySelector('.galeria-fullscreen')?.addEventListener('click', () => {
            this.abrirFullscreen();
        });
    }

    // Trocar imagem
    trocarImagem(index) {
        this.imagemAtual = parseInt(index);
        
        // Atualizar imagem principal
        const imgPrincipal = document.getElementById('imagemPrincipal');
        if (imgPrincipal && this.produto.imagens) {
            imgPrincipal.src = this.produto.imagens[this.imagemAtual];
        }

        // Atualizar thumb active
        document.querySelectorAll('.thumb').forEach((thumb, i) => {
            if (i === this.imagemAtual) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    // Abrir fullscreen
    abrirFullscreen() {
        const modal = document.getElementById('modalFullscreen');
        const img = document.getElementById('fullscreenImg');
        
        if (modal && img && this.produto.imagens) {
            img.src = this.produto.imagens[this.imagemAtual];
            modal.style.display = 'flex';

            // Botões do fullscreen
            document.querySelector('.fullscreen-prev').onclick = () => {
                const total = this.produto.imagens.length;
                this.imagemAtual = (this.imagemAtual - 1 + total) % total;
                img.src = this.produto.imagens[this.imagemAtual];
            };

            document.querySelector('.fullscreen-next').onclick = () => {
                const total = this.produto.imagens.length;
                this.imagemAtual = (this.imagemAtual + 1) % total;
                img.src = this.produto.imagens[this.imagemAtual];
            };

            document.querySelector('.fullscreen-close').onclick = () => {
                modal.style.display = 'none';
            };
        }
    }

    // Calcular média de avaliações
    calcularMediaAvaliacoes() {
        if (!this.produto.avaliacoes || this.produto.avaliacoes.length === 0) {
            return 0;
        }

        const soma = this.produto.avaliacoes.reduce((acc, av) => acc + av.nota, 0);
        return soma / this.produto.avaliacoes.length;
    }

    // Renderizar estrelas
    renderizarEstrelas(nota) {
        const estrelaCheia = '<i class="fas fa-star"></i>';
        const estrelaMeia = '<i class="fas fa-star-half-alt"></i>';
        const estrelaVazia = '<i class="far fa-star"></i>';
        
        let estrelas = '';
        const cheias = Math.floor(nota);
        const meia = nota % 1 >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            if (i < cheias) {
                estrelas += estrelaCheia;
            } else if (i === cheias && meia) {
                estrelas += estrelaMeia;
            } else {
                estrelas += estrelaVazia;
            }
        }
        
        return estrelas;
    }

    // Inicializar event listeners
    initEventListeners() {
        // Botão de comprar
        document.getElementById('btnComprar')?.addEventListener('click', () => {
            this.comprarAgora();
        });

        // Botão de carrinho
        document.getElementById('btnCarrinho')?.addEventListener('click', () => {
            this.adicionarAoCarrinho();
        });

        // Botão de favorito
        document.getElementById('btnFavorito')?.addEventListener('click', (e) => {
            this.toggleFavorito(e.currentTarget);
        });

        // Botão de mensagem
        document.getElementById('btnMensagemVendedor')?.addEventListener('click', () => {
            this.enviarMensagem();
        });

        // Calcular frete
        document.getElementById('calcularFrete')?.addEventListener('click', () => {
            this.calcularFrete();
        });

        // Input de CEP com enter
        document.getElementById('cep')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.calcularFrete();
            }
        });
    }

    // Comprar agora
    comprarAgora() {
        if (window.carrinho) {
            window.carrinho.adicionar(this.produto, 1);
            window.location.href = 'carrinho.html';
        }
    }

    // Adicionar ao carrinho
    adicionarAoCarrinho() {
        if (window.carrinho) {
            const adicionado = window.carrinho.adicionar(this.produto, 1);
            
            if (adicionado) {
                const btn = document.getElementById('btnCarrinho');
                btn.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
                btn.classList.add('btn-sucesso');
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Adicionar ao carrinho';
                    btn.classList.remove('btn-sucesso');
                }, 2000);
            }
        }
    }

    // Toggle favorito
    toggleFavorito(btn) {
        const icon = btn.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.classList.add('favoritado');
            
            // Salvar nos favoritos
            let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
            if (!favoritos.includes(this.produtoId)) {
                favoritos.push(this.produtoId);
                localStorage.setItem('favoritos', JSON.stringify(favoritos));
            }
            
            window.utils?.mostrarNotificacao('Produto adicionado aos favoritos!', 'sucesso');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.classList.remove('favoritado');
            
            // Remover dos favoritos
            let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
            favoritos = favoritos.filter(id => id != this.produtoId);
            localStorage.setItem('favoritos', JSON.stringify(favoritos));
            
            window.utils?.mostrarNotificacao('Produto removido dos favoritos', 'info');
        }
    }

    // Enviar mensagem
    enviarMensagem() {
        if (!window.auth?.isLoggedIn()) {
            sessionStorage.setItem('redirect_after_login', window.location.href);
            window.location.href = '/login.html';
            return;
        }

        const modal = document.getElementById('mensagemModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    // Calcular frete
    async calcularFrete() {
        const cepInput = document.getElementById('cep');
        const resultado = document.getElementById('freteResultado');
        
        if (!cepInput || !resultado) return;

        const cep = cepInput.value.replace(/\D/g, '');
        
        if (cep.length !== 8) {
            resultado.innerHTML = '<p class="erro">CEP inválido</p>';
            return;
        }

        resultado.innerHTML = '<p class="calculando">Calculando frete...</p>';

        try {
            let opcoesFrete;

            // Usar API se disponível
            if (window.ShippingAPI) {
                const response = await window.ShippingAPI.calcular(cep, [this.produto]);
                opcoesFrete = [response];
            } else {
                // Mock de cálculo
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Simular cálculo baseado no peso
                const peso = this.produto.peso || 1;
                const cepNum = parseInt(cep);
                
                let valorBase = 25.90;
                if (peso > 10) valorBase += 20;
                else if (peso > 5) valorBase += 10;

                opcoesFrete = [
                    { tipo: 'PAC', prazo: '7 dias', preco: valorBase },
                    { tipo: 'Sedex', prazo: '2 dias', preco: valorBase + 20 },
                    { tipo: 'Transportadora', prazo: '5 dias', preco: valorBase + 10 }
                ];
            }

            let html = '<h4>Opções de frete:</h4>';
            opcoesFrete.forEach(opcao => {
                html += `
                    <div class="frete-opcao">
                        <div>
                            <strong>${opcao.tipo}</strong>
                            <span>Entrega em ${opcao.prazo}</span>
                        </div>
                        <span class="frete-preco">R$ ${opcao.preco.toFixed(2).replace('.', ',')}</span>
                    </div>
                `;
            });

            resultado.innerHTML = html;
        } catch (error) {
            resultado.innerHTML = '<p class="erro">Erro ao calcular frete</p>';
        }
    }

    // Atualizar histórico de produtos recentes
    atualizarHistorico() {
        let recentes = JSON.parse(localStorage.getItem('recentes') || '[]');
        
        // Remover se já existe
        recentes = recentes.filter(id => id != this.produtoId);
        
        // Adicionar no início
        recentes.unshift(this.produtoId);
        
        // Manter apenas 10
        recentes = recentes.slice(0, 10);
        
        localStorage.setItem('recentes', JSON.stringify(recentes));
    }

    // Formatar data
    formatarData(data) {
        if (!data) return '';
        
        const date = new Date(data);
        const hoje = new Date();
        const diff = Math.floor((hoje - date) / (1000 * 60 * 60 * 24));
        
        if (diff === 0) return 'Hoje';
        if (diff === 1) return 'Ontem';
        if (diff < 7) return `Há ${diff} dias`;
        
        return date.toLocaleDateString('pt-BR');
    }

    // Mostrar erro
    mostrarErro(mensagem) {
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div class="erro-container">
                    <i class="fas fa-exclamation-circle"></i>
                    <h2>${mensagem}</h2>
                    <p>O produto que você está procurando não existe ou foi removido.</p>
                    <a href="index.html" class="btn-dourado">Voltar para home</a>
                </div>
            `;
        }
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('produto.html')) {
        window.produtoPage = new ProdutoPage();
    }
});

// ===== EXPORT =====
window.ProdutoPage = ProdutoPage;