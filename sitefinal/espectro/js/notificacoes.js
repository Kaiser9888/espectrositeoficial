// ===== NOTIFICACOES.JS - Sistema de notificações =====

// Classe de notificações
class Notificacoes {
    constructor() {
        this.notificacoes = [];
        this.naoLidas = 0;
        this.interval = null;
        this.init();
    }

    // Inicializar
    init() {
        this.carregarNotificacoes();
        this.initEventListeners();
        this.iniciarPolling();
    }

    // Carregar notificações
    async carregarNotificacoes() {
        try {
            // Tentar carregar da API
            if (window.NotificationAPI) {
                this.notificacoes = await window.NotificationAPI.listar();
            } else {
                // Carregar dos dados mockados
                await this.carregarNotificacoesMock();
            }

            this.atualizarContador();
            this.renderizarDropdown();
            this.renderizarPaginaNotificacoes();
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
        }
    }

    // Carregar notificações mockadas
    carregarNotificacoesMock() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.notificacoes = [
                    {
                        id: 1,
                        tipo: 'promocao',
                        icone: 'fa-tag',
                        titulo: 'Promoção relâmpago!',
                        mensagem: '20% off em capacetes por tempo limitado',
                        data: '2026-03-26T09:00:00',
                        lida: false,
                        acao: '/categoria/capacetes',
                        cor: '#FFD700'
                    },
                    {
                        id: 2,
                        tipo: 'pedido',
                        icone: 'fa-box',
                        titulo: 'Pedido enviado',
                        mensagem: 'Seu pedido #ESP-123457 foi enviado',
                        data: '2026-03-25T14:30:00',
                        lida: false,
                        acao: '/perfil.html?tab=compras',
                        cor: '#8B0000'
                    },
                    {
                        id: 3,
                        tipo: 'avaliacao',
                        icone: 'fa-star',
                        titulo: 'Nova avaliação',
                        mensagem: 'Você recebeu uma avaliação de 5 estrelas',
                        data: '2026-03-24T11:20:00',
                        lida: true,
                        acao: '/perfil.html?tab=avaliacoes',
                        cor: '#28a745'
                    },
                    {
                        id: 4,
                        tipo: 'sistema',
                        icone: 'fa-shield-alt',
                        titulo: 'Segurança',
                        mensagem: 'Ative a verificação em duas etapas',
                        data: '2026-03-23T16:45:00',
                        lida: true,
                        acao: '/perfil.html?tab=seguranca',
                        cor: '#17a2b8'
                    },
                    {
                        id: 5,
                        tipo: 'venda',
                        icone: 'fa-dollar-sign',
                        titulo: 'Venda realizada',
                        mensagem: 'Você vendeu um produto: Quadro Specialized',
                        data: '2026-03-22T10:15:00',
                        lida: false,
                        acao: '/perfil.html?tab=vendas',
                        cor: '#28a745'
                    }
                ];
                resolve();
            }, 300);
        });
    }

    // Iniciar polling (verificar novas notificações a cada 30 segundos)
    iniciarPolling() {
        this.interval = setInterval(() => {
            this.verificarNovasNotificacoes();
        }, 30000);
    }

    // Parar polling
    pararPolling() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    // Verificar novas notificações
    async verificarNovasNotificacoes() {
        try {
            // Simular verificação de novas notificações
            const novas = await this.buscarNovasNotificacoes();
            
            if (novas.length > 0) {
                this.notificacoes = [...novas, ...this.notificacoes];
                this.atualizarContador();
                this.renderizarDropdown();
                this.renderizarPaginaNotificacoes();
                
                // Mostrar notificação toast
                this.mostrarToast(novas[0]);
            }
        } catch (error) {
            console.error('Erro ao verificar novas notificações:', error);
        }
    }

    // Buscar novas notificações (mock)
    buscarNovasNotificacoes() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 30% de chance de ter nova notificação
                if (Math.random() < 0.3) {
                    resolve([{
                        id: Date.now(),
                        tipo: 'sistema',
                        icone: 'fa-info-circle',
                        titulo: 'Novidade!',
                        mensagem: 'Confira as novas funcionalidades do Espectro Bikes',
                        data: new Date().toISOString(),
                        lida: false,
                        acao: '/novidades'
                    }]);
                } else {
                    resolve([]);
                }
            }, 500);
        });
    }

    // Marcar notificação como lida
    async marcarComoLida(id) {
        const notificacao = this.notificacoes.find(n => n.id === id);
        if (notificacao && !notificacao.lida) {
            notificacao.lida = true;
            
            try {
                if (window.NotificationAPI) {
                    await window.NotificationAPI.marcarComoLida(id);
                }
            } catch (error) {
                console.error('Erro ao marcar notificação como lida:', error);
            }

            this.atualizarContador();
            this.renderizarDropdown();
            this.renderizarPaginaNotificacoes();
        }
    }

    // Marcar todas como lidas
    async marcarTodasLidas() {
        this.notificacoes.forEach(n => n.lida = true);
        
        try {
            if (window.NotificationAPI) {
                await window.NotificationAPI.marcarTodasLidas();
            }
        } catch (error) {
            console.error('Erro ao marcar todas como lidas:', error);
        }

        this.atualizarContador();
        this.renderizarDropdown();
        this.renderizarPaginaNotificacoes();
    }

    // Remover notificação
    async remover(id) {
        this.notificacoes = this.notificacoes.filter(n => n.id !== id);
        
        try {
            if (window.NotificationAPI) {
                await window.NotificationAPI.delete(id);
            }
        } catch (error) {
            console.error('Erro ao remover notificação:', error);
        }

        this.atualizarContador();
        this.renderizarDropdown();
        this.renderizarPaginaNotificacoes();
    }

    // Atualizar contador de não lidas
    atualizarContador() {
        this.naoLidas = this.notificacoes.filter(n => !n.lida).length;
        
        const badge = document.getElementById('notifBadge');
        if (badge) {
            badge.textContent = this.naoLidas;
            
            if (this.naoLidas === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'flex';
            }
        }
    }

    // Renderizar dropdown de notificações
    renderizarDropdown() {
        const dropdown = document.getElementById('notificationDropdown');
        if (!dropdown) return;

        const lista = dropdown.querySelector('.notification-list');
        const naoLidas = this.notificacoes.filter(n => !n.lida);
        const ultimas = this.notificacoes.slice(0, 5); // Últimas 5

        if (ultimas.length === 0) {
            lista.innerHTML = `
                <div class="notification-empty">
                    <i class="far fa-bell-slash"></i>
                    <p>Nenhuma notificação</p>
                </div>
            `;
        } else {
            let html = '';
            ultimas.forEach(notif => {
                html += this.renderizarNotificacaoItem(notif);
            });
            lista.innerHTML = html;
        }

        // Atualizar contador no header
        const headerCount = dropdown.querySelector('.nao-lidas-count');
        if (headerCount) {
            headerCount.textContent = this.naoLidas > 0 ? `(${this.naoLidas})` : '';
        }
    }

    // Renderizar item de notificação
    renderizarNotificacaoItem(notif) {
        const tempo = this.calcularTempo(notif.data);
        const naoLidaClass = notif.lida ? '' : 'nao-lida';
        
        return `
            <div class="notification-item ${naoLidaClass}" data-id="${notif.id}">
                <i class="fas ${notif.icone || 'fa-bell'}" style="color: ${notif.cor || '#FFD700'}"></i>
                <div class="notif-content">
                    <div class="notif-header">
                        <strong>${notif.titulo}</strong>
                        <span class="notif-time">${tempo}</span>
                    </div>
                    <p>${notif.mensagem}</p>
                </div>
                <button class="notif-close" onclick="notificacoes.remover(${notif.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }

    // Renderizar página de notificações
    renderizarPaginaNotificacoes() {
        const container = document.getElementById('notificacoesLista');
        if (!container) return;

        if (this.notificacoes.length === 0) {
            container.innerHTML = `
                <div class="notificacoes-vazio">
                    <i class="far fa-bell-slash fa-4x"></i>
                    <h3>Nenhuma notificação</h3>
                    <p>Você não tem notificações no momento</p>
                </div>
            `;
            return;
        }

        // Agrupar por data
        const grupos = this.agruparPorData();

        let html = '';
        for (const [data, notificacoes] of Object.entries(grupos)) {
            html += `
                <div class="notificacao-grupo">
                    <h4 class="grupo-data">${data}</h4>
                    <div class="grupo-lista">
            `;

            notificacoes.forEach(notif => {
                html += this.renderizarNotificacaoCard(notif);
            });

            html += `
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;

        // Adicionar event listeners
        document.querySelectorAll('.notificacao-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.notif-actions')) {
                    const id = card.dataset.id;
                    this.marcarComoLida(id);
                    
                    const acao = this.notificacoes.find(n => n.id == id)?.acao;
                    if (acao) {
                        window.location.href = acao;
                    }
                }
            });
        });
    }

    // Renderizar card de notificação (para página completa)
    renderizarNotificacaoCard(notif) {
        const tempo = this.formatarDataCompleta(notif.data);
        const naoLidaClass = notif.lida ? '' : 'nao-lida';
        
        return `
            <div class="notificacao-card ${naoLidaClass}" data-id="${notif.id}">
                <div class="notificacao-icon" style="background: ${notif.cor}20; color: ${notif.cor}">
                    <i class="fas ${notif.icone || 'fa-bell'}"></i>
                </div>
                <div class="notificacao-conteudo">
                    <div class="notificacao-header">
                        <h4>${notif.titulo}</h4>
                        <span class="notificacao-tempo">${tempo}</span>
                    </div>
                    <p class="notificacao-mensagem">${notif.mensagem}</p>
                </div>
                <div class="notificacao-acoes">
                    ${!notif.lida ? `
                        <button class="btn-icon" onclick="notificacoes.marcarComoLida(${notif.id})">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                    <button class="btn-icon" onclick="notificacoes.remover(${notif.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Mostrar toast de nova notificação
    mostrarToast(notif) {
        const toast = document.createElement('div');
        toast.className = 'notificacao-toast';
        toast.innerHTML = `
            <div class="toast-icon" style="background: ${notif.cor}20">
                <i class="fas ${notif.icone || 'fa-bell'}" style="color: ${notif.cor}"></i>
            </div>
            <div class="toast-content">
                <strong>${notif.titulo}</strong>
                <p>${notif.mensagem}</p>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(toast);

        // Mostrar com animação
        setTimeout(() => toast.classList.add('show'), 100);

        // Fechar após 5 segundos
        const timeout = setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);

        // Botão de fechar
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(timeout);
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });

        // Clicar no toast
        toast.addEventListener('click', (e) => {
            if (!e.target.closest('.toast-close')) {
                window.location.href = notif.acao || '#';
            }
        });
    }

    // Agrupar notificações por data
    agruparPorData() {
        const grupos = {};
        const hoje = new Date().toDateString();
        const ontem = new Date(Date.now() - 86400000).toDateString();

        this.notificacoes.forEach(notif => {
            const data = new Date(notif.data);
            let chave;

            if (data.toDateString() === hoje) {
                chave = 'Hoje';
            } else if (data.toDateString() === ontem) {
                chave = 'Ontem';
            } else {
                chave = data.toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric' 
                });
            }

            if (!grupos[chave]) {
                grupos[chave] = [];
            }
            grupos[chave].push(notif);
        });

        return grupos;
    }

    // Calcular tempo relativo
    calcularTempo(data) {
        if (!data) return '';

        const agora = new Date();
        const notifData = new Date(data);
        const diffSegundos = Math.floor((agora - notifData) / 1000);

        if (diffSegundos < 60) {
            return 'agora';
        } else if (diffSegundos < 3600) {
            const minutos = Math.floor(diffSegundos / 60);
            return `${minutos} min atrás`;
        } else if (diffSegundos < 86400) {
            const horas = Math.floor(diffSegundos / 3600);
            return `${horas} hora${horas > 1 ? 's' : ''} atrás`;
        } else if (diffSegundos < 604800) {
            const dias = Math.floor(diffSegundos / 86400);
            return `${dias} dia${dias > 1 ? 's' : ''} atrás`;
        } else {
            return notifData.toLocaleDateString('pt-BR');
        }
    }

    // Formatar data completa
    formatarDataCompleta(data) {
        if (!data) return '';

        const notifData = new Date(data);
        const hoje = new Date();
        const ontem = new Date(hoje);
        ontem.setDate(ontem.getDate() - 1);

        if (notifData.toDateString() === hoje.toDateString()) {
            return `Hoje às ${notifData.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        } else if (notifData.toDateString() === ontem.toDateString()) {
            return `Ontem às ${notifData.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        } else {
            return notifData.toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    // Inicializar event listeners
    initEventListeners() {
        // Marcar todas como lidas
        document.querySelector('.mark-read')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.marcarTodasLidas();
        });

        // Filtros na página de notificações
        document.querySelectorAll('.notificacao-filtro').forEach(filtro => {
            filtro.addEventListener('click', (e) => {
                const tipo = e.target.dataset.tipo;
                this.filtrarNotificacoes(tipo);
            });
        });
    }

    // Filtrar notificações
    filtrarNotificacoes(tipo) {
        const cards = document.querySelectorAll('.notificacao-card');
        
        cards.forEach(card => {
            if (tipo === 'todas') {
                card.style.display = 'flex';
            } else if (tipo === 'nao-lidas') {
                card.style.display = card.classList.contains('nao-lida') ? 'flex' : 'none';
            } else {
                card.style.display = 'flex';
            }
        });
    }
}

// Instância global
window.notificacoes = new Notificacoes();

// ===== EXPORT =====
window.Notificacoes = Notificacoes;