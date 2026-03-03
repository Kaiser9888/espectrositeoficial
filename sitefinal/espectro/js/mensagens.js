// ===== MENSAGENS.JS - Sistema de mensagens =====

// Classe do sistema de mensagens
class Mensagens {
    constructor() {
        this.conversas = [];
        this.conversaAtual = null;
        this.mensagens = [];
        this.usuario = null;
        this.init();
    }

    // Inicializar
    init() {
        this.carregarUsuario();
        this.carregarConversas();
        this.initEventListeners();
        
        // Verificar se está na página de mensagens
        if (window.location.pathname.includes('mensagens.html')) {
            this.renderizarConversas();
            
            // Verificar se tem conversa selecionada na URL
            const urlParams = new URLSearchParams(window.location.search);
            const conversaId = urlParams.get('conversa');
            if (conversaId) {
                this.abrirConversa(conversaId);
            }
        }
    }

    // Carregar usuário logado
    carregarUsuario() {
        this.usuario = window.auth?.getUsuario();
        
        if (!this.usuario && window.location.pathname.includes('mensagens.html')) {
            // Redirecionar para login se não estiver logado
            window.location.href = '/login.html?redirect=mensagens';
        }
    }

    // Carregar conversas
    async carregarConversas() {
        try {
            // Tentar carregar da API
            if (window.MessageAPI) {
                this.conversas = await window.MessageAPI.listarConversas();
            } else {
                // Carregar dos dados mockados
                await this.carregarConversasMock();
            }
        } catch (error) {
            console.error('Erro ao carregar conversas:', error);
        }
    }

    // Carregar conversas mockadas
    carregarConversasMock() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.conversas = [
                    {
                        id: 1,
                        participanteId: 101,
                        participanteNome: 'Bike Shop Brasil',
                        participanteAvatar: 'assets/icons/avatar-loja.jpg',
                        ultimaMensagem: 'Olá! Sim, ainda tenho a bike disponível...',
                        data: '2026-03-26T14:30:00',
                        lida: false,
                        online: true,
                        produtoId: 1,
                        produtoNome: 'Mountain Bike Caloi Elite'
                    },
                    {
                        id: 2,
                        participanteId: 102,
                        participanteNome: 'Capacetes Pro',
                        participanteAvatar: 'assets/icons/avatar-user2.jpg',
                        ultimaMensagem: 'O código de rastreio é BR123456789...',
                        data: '2026-03-25T10:15:00',
                        lida: true,
                        online: false,
                        produtoId: 2,
                        produtoNome: 'Capacete Giro Syntax'
                    },
                    {
                        id: 3,
                        participanteId: 103,
                        participanteNome: 'João Comprador',
                        participanteAvatar: 'assets/icons/avatar-user3.jpg',
                        ultimaMensagem: 'Recebi o produto, muito obrigado!',
                        data: '2026-03-24T16:20:00',
                        lida: true,
                        online: false
                    }
                ];
                resolve();
            }, 300);
        });
    }

    // Carregar mensagens de uma conversa
    async carregarMensagens(conversaId) {
        try {
            // Tentar carregar da API
            if (window.MessageAPI) {
                this.mensagens = await window.MessageAPI.getMensagens(conversaId);
            } else {
                // Carregar dos dados mockados
                await this.carregarMensagensMock(conversaId);
            }
            
            this.renderizarMensagens();
            
            // Marcar conversa como lida
            this.marcarComoLida(conversaId);
            
            // Scroll para o final
            this.scrollParaFinal();
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
        }
    }

    // Carregar mensagens mockadas
    carregarMensagensMock(conversaId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (conversaId == 1) {
                    this.mensagens = [
                        {
                            id: 1,
                            remetenteId: 101,
                            remetenteNome: 'Bike Shop Brasil',
                            conteudo: 'Olá! Vi que você se interessou pela Mountain Bike Caloi Elite. Ainda tenho disponível sim!',
                            data: '2026-03-26T14:30:00',
                            lida: true,
                            tipo: 'texto'
                        },
                        {
                            id: 2,
                            remetenteId: this.usuario?.id || 1,
                            remetenteNome: this.usuario?.nome || 'Você',
                            conteudo: 'Ótimo! Qual a forma de pagamento que vocês aceitam?',
                            data: '2026-03-26T14:32:00',
                            lida: true,
                            tipo: 'texto'
                        },
                        {
                            id: 3,
                            remetenteId: 101,
                            remetenteNome: 'Bike Shop Brasil',
                            conteudo: 'Aceitamos cartão, pix e boleto. Olha a foto da bike:',
                            data: '2026-03-26T14:33:00',
                            lida: true,
                            tipo: 'texto'
                        },
                        {
                            id: 4,
                            remetenteId: 101,
                            remetenteNome: 'Bike Shop Brasil',
                            conteudo: 'assets/produtos/bike2.jpg',
                            data: '2026-03-26T14:33:30',
                            lida: true,
                            tipo: 'imagem'
                        },
                        {
                            id: 5,
                            remetenteId: this.usuario?.id || 1,
                            remetenteNome: this.usuario?.nome || 'Você',
                            conteudo: 'Perfeito! Vou fazer o pedido pelo site então. Obrigado!',
                            data: '2026-03-26T14:35:00',
                            lida: true,
                            tipo: 'texto'
                        },
                        {
                            id: 6,
                            remetenteId: 101,
                            remetenteNome: 'Bike Shop Brasil',
                            conteudo: 'Disponha! Se tiver qualquer dúvida, é só chamar. :)',
                            data: '2026-03-26T14:36:00',
                            lida: true,
                            tipo: 'texto'
                        }
                    ];
                } else {
                    this.mensagens = [];
                }
                resolve();
            }, 300);
        });
    }

    // Renderizar lista de conversas
    renderizarConversas() {
        const container = document.getElementById('conversasItems');
        if (!container) return;

        if (this.conversas.length === 0) {
            container.innerHTML = `
                <div class="sem-conversas">
                    <i class="fas fa-comments"></i>
                    <p>Nenhuma conversa ainda</p>
                    <p>Quando você iniciar uma conversa com um vendedor, ela aparecerá aqui</p>
                </div>
            `;
            return;
        }

        let html = '';
        this.conversas.forEach(conversa => {
            const data = this.formatarData(conversa.data);
            const isActive = this.conversaAtual === conversa.id;
            
            html += `
                <div class="conversa-item ${!conversa.lida ? 'nao-lida' : ''} ${isActive ? 'active' : ''}" 
                     data-conversa-id="${conversa.id}">
                    <div class="conversa-avatar">
                        <img src="${conversa.participanteAvatar || 'assets/icons/avatar-default.jpg'}" 
                             alt="${conversa.participanteNome}">
                        ${conversa.online ? '<span class="status-online"></span>' : ''}
                    </div>
                    <div class="conversa-info">
                        <div class="conversa-nome">
                            <h4>${conversa.participanteNome}</h4>
                            <span class="conversa-tempo">${data}</span>
                        </div>
                        <div class="conversa-ultima">
                            <p>${this.resumirTexto(conversa.ultimaMensagem, 40)}</p>
                            ${!conversa.lida ? '<span class="msg-count">1</span>' : ''}
                        </div>
                        ${conversa.produtoNome ? `
                            <div class="conversa-produto">
                                <small>${conversa.produtoNome}</small>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Adicionar event listeners
        document.querySelectorAll('.conversa-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.conversaId;
                this.abrirConversa(id);
            });
        });
    }

    // Renderizar mensagens
    renderizarMensagens() {
        const container = document.getElementById('mensagensContainer');
        const conversa = this.conversas.find(c => c.id == this.conversaAtual);
        
        if (!container || !conversa) return;

        // Atualizar cabeçalho
        document.querySelector('.conversa-detalhes h3').textContent = conversa.participanteNome;
        document.querySelector('.conversa-avatar-grande img').src = 
            conversa.participanteAvatar || 'assets/icons/avatar-default.jpg';
        document.querySelector('.status-text').textContent = conversa.online ? 'Online' : 'Offline';

        if (this.mensagens.length === 0) {
            container.innerHTML = `
                <div class="sem-mensagens">
                    <i class="fas fa-comment-dots"></i>
                    <p>Nenhuma mensagem ainda</p>
                    <p>Envie uma mensagem para iniciar a conversa</p>
                </div>
            `;
            return;
        }

        let html = '';
        let ultimaData = null;

        this.mensagens.forEach(msg => {
            const data = new Date(msg.data);
            const dataStr = data.toLocaleDateString('pt-BR');
            
            // Adicionar separador de data
            if (dataStr !== ultimaData) {
                html += `
                    <div class="mensagem-data">
                        <span>${this.formatarDataSeparador(data)}</span>
                    </div>
                `;
                ultimaData = dataStr;
            }

            const isMinha = msg.remetenteId == this.usuario?.id;
            
            if (msg.tipo === 'imagem') {
                html += this.renderizarMensagemImagem(msg, isMinha);
            } else {
                html += this.renderizarMensagemTexto(msg, isMinha);
            }
        });

        container.innerHTML = html;
    }

    // Renderizar mensagem de texto
    renderizarMensagemTexto(msg, isMinha) {
        const hora = new Date(msg.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        if (isMinha) {
            return `
                <div class="mensagem enviada">
                    <div class="mensagem-content">
                        <div class="mensagem-info">
                            <span class="mensagem-tempo">${hora}</span>
                        </div>
                        <div class="mensagem-texto">
                            ${msg.conteudo}
                        </div>
                        <div class="mensagem-status">
                            <i class="fas fa-check-double"></i> ${msg.lida ? 'Entregue' : 'Enviado'}
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="mensagem recebida">
                    <div class="mensagem-avatar">
                        <img src="${this.conversas.find(c => c.id == this.conversaAtual)?.participanteAvatar || 'assets/icons/avatar-default.jpg'}" 
                             alt="Avatar">
                    </div>
                    <div class="mensagem-content">
                        <div class="mensagem-info">
                            <span class="mensagem-nome">${msg.remetenteNome}</span>
                            <span class="mensagem-tempo">${hora}</span>
                        </div>
                        <div class="mensagem-texto">
                            ${msg.conteudo}
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Renderizar mensagem de imagem
    renderizarMensagemImagem(msg, isMinha) {
        const hora = new Date(msg.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        if (isMinha) {
            return `
                <div class="mensagem enviada">
                    <div class="mensagem-content">
                        <div class="mensagem-info">
                            <span class="mensagem-tempo">${hora}</span>
                        </div>
                        <div class="mensagem-imagem">
                            <img src="${msg.conteudo}" alt="Imagem" onclick="window.open('${msg.conteudo}', '_blank')">
                        </div>
                        <div class="mensagem-status">
                            <i class="fas fa-check-double"></i> ${msg.lida ? 'Entregue' : 'Enviado'}
                        </div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="mensagem recebida">
                    <div class="mensagem-avatar">
                        <img src="${this.conversas.find(c => c.id == this.conversaAtual)?.participanteAvatar || 'assets/icons/avatar-default.jpg'}" 
                             alt="Avatar">
                    </div>
                    <div class="mensagem-content">
                        <div class="mensagem-info">
                            <span class="mensagem-nome">${msg.remetenteNome}</span>
                            <span class="mensagem-tempo">${hora}</span>
                        </div>
                        <div class="mensagem-imagem">
                            <img src="${msg.conteudo}" alt="Imagem" onclick="window.open('${msg.conteudo}', '_blank')">
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Abrir conversa
    async abrirConversa(conversaId) {
        this.conversaAtual = conversaId;
        
        // Atualizar URL
        const url = new URL(window.location);
        url.searchParams.set('conversa', conversaId);
        window.history.pushState({}, '', url);

        // Carregar mensagens
        await this.carregarMensagens(conversaId);
        
        // Atualizar lista de conversas
        this.renderizarConversas();
    }

    // Enviar mensagem
    async enviarMensagem(conteudo, tipo = 'texto') {
        if (!this.conversaAtual || !conteudo) return;

        // Criar mensagem temporária
        const mensagemTemp = {
            id: 'temp_' + Date.now(),
            remetenteId: this.usuario?.id,
            remetenteNome: this.usuario?.nome || 'Você',
            conteudo: conteudo,
            data: new Date().toISOString(),
            lida: false,
            tipo: tipo
        };

        // Adicionar à lista
        this.mensagens.push(mensagemTemp);
        this.renderizarMensagens();
        this.scrollParaFinal();

        // Limpar input
        document.getElementById('mensagemInput').value = '';

        try {
            // Enviar para API
            if (window.MessageAPI) {
                await window.MessageAPI.enviar(this.conversaAtual, {
                    conteudo: conteudo,
                    tipo: tipo
                });
            } else {
                // Simular envio
                await this.simularEnvio(mensagemTemp);
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            window.utils?.mostrarNotificacao('Erro ao enviar mensagem', 'erro');
            
            // Remover mensagem temporária
            this.mensagens = this.mensagens.filter(m => m.id !== mensagemTemp.id);
            this.renderizarMensagens();
        }
    }

    // Simular envio (mock)
    simularEnvio(mensagemTemp) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Atualizar status da mensagem
                const msg = this.mensagens.find(m => m.id === mensagemTemp.id);
                if (msg) {
                    msg.lida = true;
                    msg.id = Date.now();
                }
                
                this.renderizarMensagens();
                
                // Simular resposta automática (apenas para teste)
                if (this.conversaAtual == 1) {
                    setTimeout(() => {
                        this.receberRespostaAutomatica();
                    }, 2000);
                }
                
                resolve();
            }, 500);
        });
    }

    // Receber resposta automática (mock)
    receberRespostaAutomatica() {
        const mensagem = {
            id: Date.now(),
            remetenteId: 101,
            remetenteNome: 'Bike Shop Brasil',
            conteudo: 'Obrigado pelo seu pedido! Em breve enviaremos o código de rastreio.',
            data: new Date().toISOString(),
            lida: false,
            tipo: 'texto'
        };

        this.mensagens.push(mensagem);
        this.renderizarMensagens();
        this.scrollParaFinal();
        
        // Atualizar badge
        this.atualizarBadge();
    }

    // Marcar conversa como lida
    marcarComoLida(conversaId) {
        const conversa = this.conversas.find(c => c.id == conversaId);
        if (conversa) {
            conversa.lida = true;
            this.atualizarBadge();
        }
    }

    // Iniciar nova conversa
    async iniciarConversa(destinatarioId, produtoId = null) {
        try {
            if (!this.usuario) {
                window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.href);
                return;
            }

            if (window.MessageAPI) {
                const response = await window.MessageAPI.iniciarConversa(destinatarioId, produtoId);
                this.abrirConversa(response.conversaId);
            } else {
                // Mock
                await new Promise(resolve => setTimeout(resolve, 500));
                
                const novaConversa = {
                    id: Date.now(),
                    participanteId: destinatarioId,
                    participanteNome: 'Novo Contato',
                    participanteAvatar: 'assets/icons/avatar-default.jpg',
                    ultimaMensagem: 'Conversa iniciada',
                    data: new Date().toISOString(),
                    lida: true,
                    online: false,
                    produtoId: produtoId
                };

                this.conversas.unshift(novaConversa);
                this.renderizarConversas();
                this.abrirConversa(novaConversa.id);
            }
        } catch (error) {
            console.error('Erro ao iniciar conversa:', error);
            window.utils?.mostrarNotificacao('Erro ao iniciar conversa', 'erro');
        }
    }

    // Inicializar event listeners
    initEventListeners() {
        // Botão de nova mensagem
        document.getElementById('btnNovaMsg')?.addEventListener('click', () => {
            this.abrirModalNovaMensagem();
        });

        // Botão de anexo
        document.getElementById('btnAnexo')?.addEventListener('click', () => {
            document.getElementById('anexoModal').style.display = 'flex';
        });

        // Opções de anexo
        document.getElementById('anexoCamera')?.addEventListener('click', () => {
            this.abrirCamera();
        });

        document.getElementById('anexoGaleria')?.addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        // Input de arquivo
        document.getElementById('fileInput')?.addEventListener('change', (e) => {
            this.enviarImagem(e.target.files[0]);
        });

        // Botão de enviar
        document.getElementById('btnEnviar')?.addEventListener('click', () => {
            this.enviarDoInput();
        });

        // Input com Enter
        document.getElementById('mensagemInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.enviarDoInput();
            }
        });

        // Fechar modais
        document.querySelectorAll('.modal-close, #cancelarAnexo, #cancelarNovaMsg').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
            });
        });
    }

    // Abrir modal de nova mensagem
    abrirModalNovaMensagem() {
        const modal = document.getElementById('novaMsgModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    // Abrir câmera
    abrirCamera() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            alert('Abrindo câmera... (simulado)');
            // Aqui seria implementada a captura de foto
        }
        document.getElementById('anexoModal').style.display = 'none';
    }

    // Enviar imagem
    enviarImagem(file) {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.enviarMensagem(e.target.result, 'imagem');
        };
        reader.readAsDataURL(file);

        document.getElementById('anexoModal').style.display = 'none';
    }

    // Enviar do input
    enviarDoInput() {
        const input = document.getElementById('mensagemInput');
        const texto = input.value.trim();
        
        if (texto) {
            this.enviarMensagem(texto, 'texto');
        }
    }

    // Scroll para o final
    scrollParaFinal() {
        const container = document.getElementById('mensagensContainer');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    // Atualizar badge de mensagens
    atualizarBadge() {
        const badge = document.getElementById('msgBadge');
        if (badge) {
            const naoLidas = this.conversas.filter(c => !c.lida).length;
            badge.textContent = naoLidas;
        }
    }

    // Formatar data
    formatarData(data) {
        if (!data) return '';
        
        const date = new Date(data);
        const hoje = new Date();
        const ontem = new Date(hoje);
        ontem.setDate(ontem.getDate() - 1);
        
        if (date.toDateString() === hoje.toDateString()) {
            return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        } else if (date.toDateString() === ontem.toDateString()) {
            return 'Ontem';
        } else {
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        }
    }

    // Formatar data para separador
    formatarDataSeparador(data) {
        const hoje = new Date();
        const ontem = new Date(hoje);
        ontem.setDate(ontem.getDate() - 1);
        
        if (data.toDateString() === hoje.toDateString()) {
            return 'Hoje';
        } else if (data.toDateString() === ontem.toDateString()) {
            return 'Ontem';
        } else {
            return data.toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
            });
        }
    }

    // Resumir texto
    resumirTexto(texto, maxLength) {
        if (!texto) return '';
        if (texto.length <= maxLength) return texto;
        return texto.substring(0, maxLength) + '...';
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('mensagens.html')) {
        window.mensagens = new Mensagens();
    }
});

// ===== EXPORT =====
window.Mensagens = Mensagens;