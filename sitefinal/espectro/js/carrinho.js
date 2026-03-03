// ===== CARRINHO.JS - Gerenciamento do carrinho de compras =====

// Classe do Carrinho
class Carrinho {
    constructor() {
        this.itens = [];
        this.frete = 0;
        this.desconto = 0;
        this.cupom = null;
        this.init();
    }

    // Inicializar
    init() {
        this.carregarCarrinho();
        this.atualizarInterface();
    }

    // Carregar carrinho do localStorage
    carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem('carrinho');
        if (carrinhoSalvo) {
            try {
                const dados = JSON.parse(carrinhoSalvo);
                this.itens = dados.itens || [];
                this.frete = dados.frete || 0;
                this.desconto = dados.desconto || 0;
                this.cupom = dados.cupom || null;
            } catch (e) {
                console.error('Erro ao carregar carrinho:', e);
                this.limpar();
            }
        }
    }

    // Salvar carrinho no localStorage
    salvar() {
        localStorage.setItem('carrinho', JSON.stringify({
            itens: this.itens,
            frete: this.frete,
            desconto: this.desconto,
            cupom: this.cupom
        }));
        
        this.atualizarInterface();
    }

    // Adicionar item ao carrinho
    adicionar(produto, quantidade = 1) {
        // Validar estoque
        if (produto.estoque && produto.estoque < quantidade) {
            window.utils?.mostrarNotificacao('Quantidade indisponível em estoque', 'erro');
            return false;
        }

        // Verificar se item já existe
        const itemExistente = this.itens.find(item => item.produtoId === produto.id);
        
        if (itemExistente) {
            // Verificar estoque para quantidade adicional
            if (produto.estoque && produto.estoque < itemExistente.quantidade + quantidade) {
                window.utils?.mostrarNotificacao('Quantidade indisponível em estoque', 'erro');
                return false;
            }
            
            itemExistente.quantidade += quantidade;
        } else {
            this.itens.push({
                produtoId: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagens?.[0] || produto.imagem,
                quantidade: quantidade,
                vendedorId: produto.vendedor?.id,
                vendedorNome: produto.vendedor?.nome,
                freteGratis: produto.freteGratis || false,
                peso: produto.peso,
                dimensoes: produto.dimensoes
            });
        }

        this.salvar();
        window.utils?.mostrarNotificacao('Produto adicionado ao carrinho!', 'sucesso');
        
        // Atualizar badge
        this.atualizarBadge();
        
        return true;
    }

    // Remover item
    remover(produtoId) {
        this.itens = this.itens.filter(item => item.produtoId != produtoId);
        
        // Se carrinho ficar vazio, resetar frete e cupom
        if (this.itens.length === 0) {
            this.frete = 0;
            this.desconto = 0;
            this.cupom = null;
        }
        
        this.salvar();
        window.utils?.mostrarNotificacao('Produto removido do carrinho', 'info');
        this.atualizarBadge();
    }

    // Atualizar quantidade
    atualizarQuantidade(produtoId, quantidade) {
        const item = this.itens.find(item => item.produtoId == produtoId);
        
        if (item) {
            if (quantidade <= 0) {
                this.remover(produtoId);
                return;
            }
            
            item.quantidade = quantidade;
            this.salvar();
            this.atualizarBadge();
        }
    }

    // Calcular subtotal
    getSubtotal() {
        return this.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    }

    // Calcular total
    getTotal() {
        const subtotal = this.getSubtotal();
        return subtotal + this.frete - this.desconto;
    }

    // Calcular parcelas
    getParcelas(maxParcelas = 12) {
        const total = this.getTotal();
        const parcelas = [];
        
        for (let i = 1; i <= maxParcelas; i++) {
            parcelas.push({
                numero: i,
                valor: total / i,
                juros: i > 6 ? 0.02 : 0 // Simular juros após 6x
            });
        }
        
        return parcelas;
    }

    // Calcular frete (mock - depois integrar com API)
    async calcularFrete(cep) {
        try {
            // Validar CEP
            if (!cep || cep.replace(/\D/g, '').length !== 8) {
                throw new Error('CEP inválido');
            }

            // Se tiver API de frete, usar
            if (window.ShippingAPI) {
                const response = await window.ShippingAPI.calcular(cep, this.itens);
                this.frete = response.valor;
                this.salvar();
                return response;
            }

            // Mock de cálculo de frete
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Simular cálculo baseado no peso total
            const pesoTotal = this.itens.reduce((total, item) => total + (item.peso || 1), 0);
            
            // Simular faixas de CEP
            const cepNum = parseInt(cep.replace(/\D/g, ''));
            
            let valorFrete = 25.90; // Valor base
            
            if (pesoTotal > 10) {
                valorFrete += 20;
            } else if (pesoTotal > 5) {
                valorFrete += 10;
            }
            
            // Regiões
            if (cepNum >= 80000 && cepNum <= 89999) { // Paraná
                valorFrete -= 5;
            } else if (cepNum >= 69000 && cepNum <= 69999) { // Norte
                valorFrete += 30;
            }
            
            this.frete = Math.max(0, valorFrete);
            this.salvar();
            
            return {
                valor: this.frete,
                prazo: '5 dias úteis',
                transportadora: 'Transportadora Mock'
            };
        } catch (error) {
            console.error('Erro ao calcular frete:', error);
            throw error;
        }
    }

    // Aplicar cupom
    async aplicarCupom(codigo) {
        try {
            if (!codigo) {
                throw new Error('Digite um cupom');
            }

            // Se tiver API de cupons, usar
            if (window.CouponAPI) {
                const response = await window.CouponAPI.validar(codigo);
                this.cupom = codigo;
                this.desconto = response.valor;
                this.salvar();
                return response;
            }

            // Mock de cupons
            await new Promise(resolve => setTimeout(resolve, 300));
            
            const cupons = {
                'ESPECTRO10': { valor: 50, tipo: 'fixo' },
                'FREGGRATIS': { valor: this.frete, tipo: 'frete' },
                'BIKE20': { valor: this.getSubtotal() * 0.2, tipo: 'percentual' }
            };

            const cupom = cupons[codigo.toUpperCase()];
            
            if (!cupom) {
                throw new Error('Cupom inválido');
            }

            this.cupom = codigo.toUpperCase();
            
            if (cupom.tipo === 'frete') {
                this.desconto = this.frete;
                this.frete = 0;
            } else {
                this.desconto = cupom.valor;
            }
            
            this.salvar();
            
            return {
                valido: true,
                desconto: this.desconto,
                mensagem: 'Cupom aplicado com sucesso!'
            };
        } catch (error) {
            console.error('Erro ao aplicar cupom:', error);
            throw error;
        }
    }

    // Remover cupom
    removerCupom() {
        this.cupom = null;
        this.desconto = 0;
        this.salvar();
    }

    // Limpar carrinho
    limpar() {
        this.itens = [];
        this.frete = 0;
        this.desconto = 0;
        this.cupom = null;
        this.salvar();
        this.atualizarBadge();
    }

    // Verificar se carrinho está vazio
    estaVazio() {
        return this.itens.length === 0;
    }

    // Contar itens (quantidade total)
    contarItens() {
        return this.itens.reduce((total, item) => total + item.quantidade, 0);
    }

    // Agrupar por vendedor (para checkout)
    agruparPorVendedor() {
        const grupos = {};
        
        this.itens.forEach(item => {
            if (!grupos[item.vendedorId]) {
                grupos[item.vendedorId] = {
                    vendedorId: item.vendedorId,
                    vendedorNome: item.vendedorNome,
                    itens: [],
                    subtotal: 0
                };
            }
            
            grupos[item.vendedorId].itens.push(item);
            grupos[item.vendedorId].subtotal += item.preco * item.quantidade;
        });
        
        return Object.values(grupos);
    }

    // Atualizar badge do carrinho
    atualizarBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            badge.textContent = this.contarItens();
        }
    }

    // Atualizar interface do carrinho
    atualizarInterface() {
        this.atualizarBadge();
        
        // Se estiver na página do carrinho, renderizar lista
        if (window.location.pathname.includes('carrinho.html')) {
            this.renderizarCarrinho();
        }
        
        // Se estiver no checkout, atualizar resumo
        if (window.location.pathname.includes('checkout.html')) {
            this.renderizarResumoCheckout();
        }
    }

    // Renderizar carrinho
    renderizarCarrinho() {
        const container = document.getElementById('carrinhoLista');
        if (!container) return;

        if (this.estaVazio()) {
            container.innerHTML = `
                <div class="carrinho-vazio">
                    <i class="fas fa-shopping-cart fa-3x"></i>
                    <h3>Seu carrinho está vazio</h3>
                    <p>Explore nossos produtos e encontre o que procura</p>
                    <a href="index.html" class="btn-dourado">Continuar comprando</a>
                </div>
            `;
            return;
        }

        let html = '';
        this.itens.forEach(item => {
            html += `
                <div class="carrinho-item" data-produto-id="${item.produtoId}">
                    <div class="produto-info">
                        <div class="produto-imagem">
                            <img src="${item.imagem || 'assets/produtos/default.jpg'}" alt="${item.nome}">
                        </div>
                        <div class="produto-detalhes">
                            <h3><a href="produto.html?id=${item.produtoId}">${item.nome}</a></h3>
                            <div class="produto-vendedor">
                                <i class="fas fa-store"></i>
                                <span>${item.vendedorNome || 'Vendedor'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="produto-preco">
                        <span class="preco-unitario">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
                    </div>
                    
                    <div class="produto-quantidade">
                        <div class="quantidade-controle">
                            <button class="qty-btn qty-minus" data-id="${item.produtoId}">-</button>
                            <input type="number" class="qty-input" value="${item.quantidade}" min="1" readonly data-id="${item.produtoId}">
                            <button class="qty-btn qty-plus" data-id="${item.produtoId}">+</button>
                        </div>
                    </div>
                    
                    <div class="produto-total">
                        <span class="total-item">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
                    </div>
                    
                    <div class="produto-acao">
                        <button class="btn-remover" data-id="${item.produtoId}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        
        // Atualizar totais
        this.renderizarTotais();
        
        // Adicionar event listeners
        this.addEventListeners();
    }

    // Renderizar totais
    renderizarTotais() {
        const subtotal = this.getSubtotal();
        const total = this.getTotal();
        
        document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        document.getElementById('freteValor').textContent = `R$ ${this.frete.toFixed(2).replace('.', ',')}`;
        document.getElementById('descontoValor').textContent = `- R$ ${this.desconto.toFixed(2).replace('.', ',')}`;
        document.getElementById('total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        
        const parcela = total / 12;
        document.getElementById('parcela').textContent = `R$ ${parcela.toFixed(2).replace('.', ',')}`;
    }

    // Renderizar resumo no checkout
    renderizarResumoCheckout() {
        const subtotal = this.getSubtotal();
        const total = this.getTotal();
        
        document.getElementById('resumoSubtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        document.getElementById('resumoFrete').textContent = `R$ ${this.frete.toFixed(2).replace('.', ',')}`;
        document.getElementById('resumoDesconto').textContent = `- R$ ${this.desconto.toFixed(2).replace('.', ',')}`;
        document.getElementById('resumoTotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // Adicionar event listeners
    addEventListeners() {
        // Botões de quantidade
        document.querySelectorAll('.qty-plus').forEach(btn => {
            btn.removeEventListener('click', this.handlePlus);
            btn.addEventListener('click', this.handlePlus.bind(this));
        });

        document.querySelectorAll('.qty-minus').forEach(btn => {
            btn.removeEventListener('click', this.handleMinus);
            btn.addEventListener('click', this.handleMinus.bind(this));
        });

        // Botões de remover
        document.querySelectorAll('.btn-remover').forEach(btn => {
            btn.removeEventListener('click', this.handleRemove);
            btn.addEventListener('click', this.handleRemove.bind(this));
        });
    }

    handlePlus(e) {
        const id = e.currentTarget.dataset.id;
        const input = document.querySelector(`.qty-input[data-id="${id}"]`);
        const novaQtd = parseInt(input.value) + 1;
        this.atualizarQuantidade(id, novaQtd);
        this.renderizarCarrinho();
    }

    handleMinus(e) {
        const id = e.currentTarget.dataset.id;
        const input = document.querySelector(`.qty-input[data-id="${id}"]`);
        const novaQtd = Math.max(1, parseInt(input.value) - 1);
        this.atualizarQuantidade(id, novaQtd);
        this.renderizarCarrinho();
    }

    handleRemove(e) {
        const id = e.currentTarget.dataset.id;
        
        // Confirmar remoção
        if (confirm('Remover produto do carrinho?')) {
            this.remover(id);
            this.renderizarCarrinho();
        }
    }

    // Converter para pedido (usado no checkout)
    toPedido() {
        return {
            itens: this.itens.map(item => ({
                produtoId: item.produtoId,
                nome: item.nome,
                quantidade: item.quantidade,
                precoUnitario: item.preco,
                subtotal: item.preco * item.quantidade
            })),
            subtotal: this.getSubtotal(),
            frete: this.frete,
            desconto: this.desconto,
            total: this.getTotal(),
            cupom: this.cupom,
            agrupadoPorVendedor: this.agruparPorVendedor()
        };
    }
}

// Instância global do carrinho
window.carrinho = new Carrinho();

// ===== UTILITÁRIOS DO CARRINHO =====

// Adicionar ao carrinho (função global para botões)
window.adicionarAoCarrinho = function(produto, quantidade = 1) {
    return window.carrinho.adicionar(produto, quantidade);
};

// Atualizar badge ao carregar página
document.addEventListener('DOMContentLoaded', () => {
    window.carrinho.atualizarBadge();
});

// ===== EXPORT =====
window.Carrinho = Carrinho;