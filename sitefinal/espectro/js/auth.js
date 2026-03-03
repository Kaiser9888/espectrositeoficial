// ===== AUTH.JS - Gerenciamento de autenticação =====

// Classe de autenticação
class Auth {
    constructor() {
        this.usuario = null;
        this.token = null;
        this.init();
    }

    // Inicializar
    init() {
        this.carregarSessao();
        this.atualizarInterface();
    }

    // Carregar sessão do localStorage
    carregarSessao() {
        const sessao = localStorage.getItem('auth');
        if (sessao) {
            try {
                const dados = JSON.parse(sessao);
                this.usuario = dados.usuario;
                this.token = dados.token;
                
                // Configurar token na API
                if (window.API && this.token) {
                    window.API.setAuthToken(this.token);
                }
            } catch (e) {
                console.error('Erro ao carregar sessão:', e);
                this.logout();
            }
        }
    }

    // Salvar sessão
    salvarSessao() {
        if (this.usuario && this.token) {
            localStorage.setItem('auth', JSON.stringify({
                usuario: this.usuario,
                token: this.token
            }));
        }
    }

    // Login
    async login(email, senha, lembrar = false) {
        try {
            // Tentar login com API real
            if (window.AuthAPI) {
                const response = await window.AuthAPI.login(email, senha);
                this.usuario = response.usuario;
                this.token = response.token;
                
                // Salvar token na API
                if (window.API) {
                    window.API.setAuthToken(this.token);
                }
            } else {
                // Fallback para mock
                await this.mockLogin(email, senha);
            }

            // Salvar sessão
            if (lembrar) {
                this.salvarSessao();
            } else {
                // Sessão apenas para esta janela (não persiste)
                sessionStorage.setItem('auth_temp', JSON.stringify({
                    usuario: this.usuario,
                    token: this.token
                }));
            }

            this.atualizarInterface();
            this.redirecionarPosLogin();
            
            return { success: true, usuario: this.usuario };
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, error: error.message };
        }
    }

    // Mock login (para testes sem backend)
    mockLogin(email, senha) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular validação
                if (email && senha) {
                    const usuariosMock = {
                        'joao@email.com': {
                            id: 1,
                            nome: 'João Silva',
                            email: 'joao@email.com',
                            tipo: 'comprador'
                        },
                        'vendedor@email.com': {
                            id: 101,
                            nome: 'Bike Shop Brasil',
                            email: 'vendedor@email.com',
                            tipo: 'vendedor'
                        }
                    };

                    const usuario = usuariosMock[email];
                    if (usuario) {
                        this.usuario = usuario;
                        this.token = 'mock_token_' + Date.now();
                        resolve({ usuario, token: this.token });
                    } else {
                        reject(new Error('E-mail ou senha inválidos'));
                    }
                } else {
                    reject(new Error('Preencha todos os campos'));
                }
            }, 500);
        });
    }

    // Cadastro
    async register(dados) {
        try {
            // Validar dados
            if (!dados.nome || !dados.email || !dados.senha) {
                throw new Error('Preencha todos os campos obrigatórios');
            }

            if (dados.senha !== dados.confirmarSenha) {
                throw new Error('As senhas não coincidem');
            }

            if (dados.senha.length < 8) {
                throw new Error('A senha deve ter no mínimo 8 caracteres');
            }

            if (!this.validarEmail(dados.email)) {
                throw new Error('E-mail inválido');
            }

            if (dados.cpf && !this.validarCPF(dados.cpf)) {
                throw new Error('CPF inválido');
            }

            // Tentar cadastro com API real
            if (window.AuthAPI) {
                const response = await window.AuthAPI.register(dados);
                this.usuario = response.usuario;
                this.token = response.token;
                
                if (window.API) {
                    window.API.setAuthToken(this.token);
                }
            } else {
                // Mock de cadastro
                await this.mockRegister(dados);
            }

            // Salvar sessão
            this.salvarSessao();
            this.atualizarInterface();
            
            return { success: true, usuario: this.usuario };
        } catch (error) {
            console.error('Erro no cadastro:', error);
            return { success: false, error: error.message };
        }
    }

    mockRegister(dados) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.usuario = {
                    id: Date.now(),
                    nome: dados.nome,
                    email: dados.email,
                    tipo: 'comprador'
                };
                this.token = 'mock_token_' + Date.now();
                resolve();
            }, 800);
        });
    }

    // Logout
    logout() {
        this.usuario = null;
        this.token = null;
        
        // Remover token da API
        if (window.API) {
            window.API.removeAuthToken();
        }
        
        // Limpar localStorage e sessionStorage
        localStorage.removeItem('auth');
        sessionStorage.removeItem('auth_temp');
        
        this.atualizarInterface();
        
        // Redirecionar para home se estiver em páginas restritas
        const paginasRestritas = ['/perfil.html', '/checkout.html', '/mensagens.html'];
        if (paginasRestritas.includes(window.location.pathname)) {
            window.location.href = '/login.html';
        }
    }

    // Verificar se está logado
    isLoggedIn() {
        return !!this.usuario;
    }

    // Verificar se é vendedor
    isVendedor() {
        return this.usuario && this.usuario.tipo === 'vendedor';
    }

    // Verificar se tem permissão
    hasPermission(tipo) {
        if (!this.usuario) return false;
        
        if (tipo === 'vendedor') {
            return this.isVendedor();
        }
        
        return true;
    }

    // Atualizar interface baseada no estado de autenticação
    atualizarInterface() {
        // Atualizar links do perfil
        const profileLink = document.getElementById('profileLink');
        if (profileLink) {
            if (this.usuario) {
                profileLink.href = '/perfil.html';
                profileLink.querySelector('span').textContent = this.usuario.nome.split(' ')[0];
            } else {
                profileLink.href = '/login.html';
                profileLink.querySelector('span').textContent = 'Perfil';
            }
        }

        // Mostrar/esconder botão de vender
        const btnVender = document.querySelector('.btn-vender');
        if (btnVender) {
            if (this.usuario) {
                btnVender.style.display = 'inline-flex';
            } else {
                btnVender.style.display = 'none';
            }
        }

        // Atualizar badges
        this.atualizarBadges();
    }

    // Atualizar badges (carrinho, mensagens, etc)
    atualizarBadges() {
        if (!this.usuario) return;

        // Carrinho
        const cartBadge = document.getElementById('cartBadge');
        if (cartBadge) {
            const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
            const total = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
            cartBadge.textContent = total;
        }

        // Mensagens (simulado)
        const msgBadge = document.getElementById('msgBadge');
        if (msgBadge) {
            msgBadge.textContent = '3';
        }

        // Notificações (simulado)
        const notifBadge = document.getElementById('notifBadge');
        if (notifBadge) {
            notifBadge.textContent = '5';
        }
    }

    // Redirecionar após login
    redirecionarPosLogin() {
        const redirect = sessionStorage.getItem('redirect_after_login');
        if (redirect) {
            sessionStorage.removeItem('redirect_after_login');
            window.location.href = redirect;
        } else {
            window.location.href = '/index.html';
        }
    }

    // Validar e-mail
    validarEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Validar CPF
    validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        return true;
    }

    // Obter usuário atual
    getUsuario() {
        return this.usuario;
    }

    // Obter token
    getToken() {
        return this.token;
    }

    // Tornar-se vendedor
    async becomeSeller(documentos) {
        try {
            if (!this.isLoggedIn()) {
                throw new Error('Faça login para continuar');
            }

            // Validar documentos
            if (!documentos.cpf) {
                throw new Error('CPF é obrigatório');
            }

            if (!documentos.comprovanteEndereco) {
                throw new Error('Comprovante de endereço é obrigatório');
            }

            if (!documentos.documentoIdentidade) {
                throw new Error('Documento de identidade é obrigatório');
            }

            // Tentar com API real
            if (window.UserAPI) {
                const response = await window.UserAPI.becomeSeller(documentos);
                
                // Atualizar tipo do usuário
                this.usuario.tipo = 'vendedor';
                this.usuario.statusVendedor = 'pendente';
                this.salvarSessao();
                
                return { success: true, data: response };
            } else {
                // Mock
                await this.mockBecomeSeller();
                return { success: true };
            }
        } catch (error) {
            console.error('Erro ao tornar-se vendedor:', error);
            return { success: false, error: error.message };
        }
    }

    mockBecomeSeller() {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.usuario.tipo = 'vendedor';
                this.usuario.statusVendedor = 'pendente';
                this.salvarSessao();
                resolve();
            }, 1000);
        });
    }

    // Recuperar senha
    async forgotPassword(email) {
        try {
            if (!email) {
                throw new Error('Digite seu e-mail');
            }

            if (!this.validarEmail(email)) {
                throw new Error('E-mail inválido');
            }

            if (window.AuthAPI) {
                await window.AuthAPI.forgotPassword(email);
            } else {
                await this.mockForgotPassword();
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    mockForgotPassword() {
        return new Promise((resolve) => {
            setTimeout(() => {
                alert('E-mail de recuperação enviado! (Mock)');
                resolve();
            }, 800);
        });
    }

    // Verificar se precisa de autenticação para acessar página
    verificarPaginaRestrita() {
        const paginasRestritas = [
            '/perfil.html',
            '/checkout.html',
            '/mensagens.html',
            '/cadastro-produto.html'
        ];

        if (paginasRestritas.includes(window.location.pathname)) {
            if (!this.isLoggedIn()) {
                sessionStorage.setItem('redirect_after_login', window.location.href);
                window.location.href = '/login.html';
                return false;
            }

            // Verificar permissões específicas
            if (window.location.pathname === '/cadastro-produto.html') {
                if (!this.isVendedor()) {
                    window.location.href = '/perfil.html?tab=documentos';
                    return false;
                }
            }
        }

        return true;
    }
}

// Instância global de autenticação
window.auth = new Auth();

// Verificar páginas restritas ao carregar
document.addEventListener('DOMContentLoaded', () => {
    window.auth.verificarPaginaRestrita();
});

// ===== UTILITÁRIOS DE AUTENTICAÇÃO =====

// Guard para rotas (similar ao Vue Router)
const AuthGuard = {
    // Verificar se pode acessar rota
    canActivate: (rota) => {
        if (rota.requiresAuth && !window.auth.isLoggedIn()) {
            return false;
        }
        
        if (rota.requiresVendedor && !window.auth.isVendedor()) {
            return false;
        }
        
        return true;
    },

    // Redirecionar para login
    redirectToLogin: () => {
        sessionStorage.setItem('redirect_after_login', window.location.href);
        window.location.href = '/login.html';
    }
};

// Interceptar cliques em links que requerem auth
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Verificar se link requer autenticação
    if (href.includes('perfil') || href.includes('checkout') || 
        href.includes('mensagens') || href.includes('cadastro-produto')) {
        
        if (!window.auth.isLoggedIn()) {
            e.preventDefault();
            sessionStorage.setItem('redirect_after_login', href);
            window.location.href = '/login.html';
        }
    }
});

// ===== EXPORT =====
window.Auth = Auth;
window.AuthGuard = AuthGuard;