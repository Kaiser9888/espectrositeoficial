// ===== API.JS - Camada de comunicação com o backend Spring Boot =====
// Totalmente preparado para integração real

// Configuração da API
const API_CONFIG = {
    baseURL: 'http://localhost:8080/api', // ALTERE AQUI PARA SEU BACKEND
    version: 'v1',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Classe principal da API
class ApiClient {
    constructor() {
        this.baseURL = API_CONFIG.baseURL;
        this.headers = API_CONFIG.headers;
    }

    // ===== MÉTODOS AUXILIARES =====

    // Adicionar token de autenticação
    setAuthToken(token) {
        this.headers['Authorization'] = `Bearer ${token}`;
    }

    // Remover token
    removeAuthToken() {
        delete this.headers['Authorization'];
    }

    // Tratar resposta da API
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `Erro ${response.status}: ${response.statusText}`);
        }
        return response.json();
    }

    // Tratar erros
    handleError(error) {
        console.error('API Error:', error);
        
        // Mapear erros comuns
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
        }
        if (error.message.includes('401')) {
            throw new Error('Sessão expirada. Faça login novamente.');
        }
        if (error.message.includes('403')) {
            throw new Error('Você não tem permissão para acessar este recurso.');
        }
        if (error.message.includes('404')) {
            throw new Error('Recurso não encontrado.');
        }
        
        throw error;
    }

    // ===== MÉTODOS HTTP =====

    async get(endpoint, params = {}) {
        try {
            const url = new URL(`${this.baseURL}${endpoint}`);
            Object.keys(params).forEach(key => 
                url.searchParams.append(key, params[key])
            );

            const response = await fetch(url, {
                method: 'GET',
                headers: this.headers
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    async post(endpoint, data = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(data)
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    async put(endpoint, data = {}) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify(data)
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: this.headers
            });
            
            return await this.handleResponse(response);
        } catch (error) {
            this.handleError(error);
        }
    }

    async upload(endpoint, formData, onProgress) {
        try {
            const xhr = new XMLHttpRequest();
            
            return new Promise((resolve, reject) => {
                xhr.open('POST', `${this.baseURL}${endpoint}`, true);
                
                // Adicionar token se existir
                if (this.headers['Authorization']) {
                    xhr.setRequestHeader('Authorization', this.headers['Authorization']);
                }
                
                // Progresso
                if (onProgress) {
                    xhr.upload.onprogress = (e) => {
                        if (e.lengthComputable) {
                            const percent = (e.loaded / e.total) * 100;
                            onProgress(percent);
                        }
                    };
                }
                
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(new Error(`Upload failed: ${xhr.status}`));
                    }
                };
                
                xhr.onerror = () => reject(new Error('Upload failed'));
                xhr.send(formData);
            });
        } catch (error) {
            this.handleError(error);
        }
    }
}

// Instância da API
const API = new ApiClient();

// ===== ENDPOINTS ESPECÍFICOS =====

// Autenticação
const AuthAPI = {
    login: (email, senha) => API.post('/auth/login', { email, senha }),
    
    register: (userData) => API.post('/auth/register', userData),
    
    logout: () => API.post('/auth/logout'),
    
    refreshToken: () => API.post('/auth/refresh'),
    
    forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
    
    resetPassword: (token, novaSenha) => API.post('/auth/reset-password', { token, novaSenha }),
    
    verifyEmail: (token) => API.post('/auth/verify-email', { token })
};

// Usuários
const UserAPI = {
    getProfile: () => API.get('/usuarios/perfil'),
    
    updateProfile: (data) => API.put('/usuarios/perfil', data),
    
    updateAvatar: (formData, onProgress) => API.upload('/usuarios/avatar', formData, onProgress),
    
    getEnderecos: () => API.get('/usuarios/enderecos'),
    
    addEndereco: (endereco) => API.post('/usuarios/enderecos', endereco),
    
    updateEndereco: (id, endereco) => API.put(`/usuarios/enderecos/${id}`, endereco),
    
    deleteEndereco: (id) => API.delete(`/usuarios/enderecos/${id}`),
    
    becomeSeller: (documentos) => API.post('/usuarios/tornar-vendedor', documentos),
    
    getDocumentos: () => API.get('/usuarios/documentos'),
    
    uploadDocumento: (tipo, formData, onProgress) => 
        API.upload(`/usuarios/documentos/${tipo}`, formData, onProgress)
};

// Produtos
const ProductAPI = {
    listar: (params = {}) => API.get('/produtos', params),
    
    buscar: (termo, params = {}) => API.get('/produtos/busca', { q: termo, ...params }),
    
    getById: (id) => API.get(`/produtos/${id}`),
    
    getByCategoria: (categoria, params = {}) => API.get(`/produtos/categoria/${categoria}`, params),
    
    getByVendedor: (vendedorId) => API.get(`/produtos/vendedor/${vendedorId}`),
    
    criar: (formData, onProgress) => API.upload('/produtos', formData, onProgress),
    
    atualizar: (id, formData, onProgress) => API.upload(`/produtos/${id}`, formData, onProgress),
    
    deletar: (id) => API.delete(`/produtos/${id}`),
    
    destacar: (id, dias) => API.post(`/produtos/${id}/destacar`, { dias }),
    
    getAvaliacoes: (id) => API.get(`/produtos/${id}/avaliacoes`),
    
    addAvaliacao: (id, avaliacao) => API.post(`/produtos/${id}/avaliacoes`, avaliacao),
    
    getPerguntas: (id) => API.get(`/produtos/${id}/perguntas`),
    
    addPergunta: (id, pergunta) => API.post(`/produtos/${id}/perguntas`, pergunta),
    
    responderPergunta: (produtoId, perguntaId, resposta) => 
        API.post(`/produtos/${produtoId}/perguntas/${perguntaId}/responder`, { resposta })
};

// Carrinho
const CartAPI = {
    get: () => API.get('/carrinho'),
    
    add: (produtoId, quantidade = 1) => API.post('/carrinho/itens', { produtoId, quantidade }),
    
    update: (itemId, quantidade) => API.put(`/carrinho/itens/${itemId}`, { quantidade }),
    
    remove: (itemId) => API.delete(`/carrinho/itens/${itemId}`),
    
    clear: () => API.delete('/carrinho'),
    
    calcularFrete: (cep) => API.post('/carrinho/frete', { cep }),
    
    aplicarCupom: (cupom) => API.post('/carrinho/cupom', { cupom }),
    
    removerCupom: () => API.delete('/carrinho/cupom')
};

// Pedidos
const OrderAPI = {
    listar: (params = {}) => API.get('/pedidos', params),
    
    getById: (id) => API.get(`/pedidos/${id}`),
    
    getByUsuario: (usuarioId) => API.get(`/pedidos/usuario/${usuarioId}`),
    
    criar: (pedido) => API.post('/pedidos', pedido),
    
    cancelar: (id) => API.post(`/pedidos/${id}/cancelar`),
    
    getStatus: (id) => API.get(`/pedidos/${id}/status`),
    
    updateStatus: (id, status, codigoRastreio) => 
        API.put(`/pedidos/${id}/status`, { status, codigoRastreio }),
    
    avaliar: (id, avaliacao) => API.post(`/pedidos/${id}/avaliar`, avaliacao)
};

// Pagamentos
const PaymentAPI = {
    processarCartao: (pedidoId, dados) => API.post(`/pagamentos/cartao/${pedidoId}`, dados),
    
    gerarPix: (pedidoId) => API.post(`/pagamentos/pix/${pedidoId}`),
    
    gerarBoleto: (pedidoId) => API.post(`/pagamentos/boleto/${pedidoId}`),
    
    verificarStatus: (transacaoId) => API.get(`/pagamentos/${transacaoId}/status`)
};

// Mensagens
const MessageAPI = {
    listarConversas: () => API.get('/mensagens/conversas'),
    
    getMensagens: (conversaId) => API.get(`/mensagens/${conversaId}`),
    
    enviar: (conversaId, mensagem) => API.post(`/mensagens/${conversaId}`, mensagem),
    
    iniciarConversa: (destinatarioId, produtoId) => 
        API.post('/mensagens', { destinatarioId, produtoId }),
    
    marcarComoLida: (conversaId) => API.put(`/mensagens/${conversaId}/ler`)
};

// Notificações
const NotificationAPI = {
    listar: () => API.get('/notificacoes'),
    
    marcarComoLida: (id) => API.put(`/notificacoes/${id}/ler`),
    
    marcarTodasLidas: () => API.put('/notificacoes/ler-todas'),
    
    delete: (id) => API.delete(`/notificacoes/${id}`)
};

// Frete
const ShippingAPI = {
    calcular: (cep, produtos) => API.post('/frete/calcular', { cep, produtos }),
    
    getOpcoes: (cep, produtos) => API.post('/frete/opcoes', { cep, produtos }),
    
    rastrear: (codigo) => API.get(`/frete/rastrear/${codigo}`)
};

// Categorias
const CategoryAPI = {
    listar: () => API.get('/categorias'),
    
    getById: (id) => API.get(`/categorias/${id}`),
    
    getSubcategorias: (id) => API.get(`/categorias/${id}/subcategorias`)
};

// Avaliações
const ReviewAPI = {
    getByProduto: (produtoId) => API.get(`/avaliacoes/produto/${produtoId}`),
    
    getByUsuario: (usuarioId) => API.get(`/avaliacoes/usuario/${usuarioId}`),
    
    responder: (avaliacaoId, resposta) => 
        API.post(`/avaliacoes/${avaliacaoId}/responder`, { resposta }),
    
    denunciar: (avaliacaoId, motivo) => 
        API.post(`/avaliacoes/${avaliacaoId}/denunciar`, { motivo })
};

// Cupons
const CouponAPI = {
    validar: (codigo) => API.get(`/cupons/validar/${codigo}`),
    
    aplicar: (codigo) => API.post('/cupons/aplicar', { codigo })
};

// Estatísticas e Dashboard
const StatsAPI = {
    getDashboardVendedor: () => API.get('/estatisticas/vendedor'),
    
    getDashboardComprador: () => API.get('/estatisticas/comprador'),
    
    getVendasMensais: () => API.get('/estatisticas/vendas/mensais'),
    
    getProdutosMaisVistos: () => API.get('/estatisticas/produtos/mais-vistos')
};

// Upload de imagens
const UploadAPI = {
    imagem: (file, onProgress) => {
        const formData = new FormData();
        formData.append('imagem', file);
        return API.upload('/upload/imagem', formData, onProgress);
    },
    
    imagens: (files, onProgress) => {
        const formData = new FormData();
        files.forEach(file => formData.append('imagens', file));
        return API.upload('/upload/imagens', formData, onProgress);
    }
};

// Exportar todas as APIs
window.API = API;
window.AuthAPI = AuthAPI;
window.UserAPI = UserAPI;
window.ProductAPI = ProductAPI;
window.CartAPI = CartAPI;
window.OrderAPI = OrderAPI;
window.PaymentAPI = PaymentAPI;
window.MessageAPI = MessageAPI;
window.NotificationAPI = NotificationAPI;
window.ShippingAPI = ShippingAPI;
window.CategoryAPI = CategoryAPI;
window.ReviewAPI = ReviewAPI;
window.CouponAPI = CouponAPI;
window.StatsAPI = StatsAPI;
window.UploadAPI = UploadAPI;

// ===== EXEMPLO DE USO =====

/*
// Login
async function fazerLogin() {
    try {
        const response = await AuthAPI.login('usuario@email.com', 'senha123');
        API.setAuthToken(response.token);
        console.log('Login realizado:', response.usuario);
    } catch (error) {
        console.error('Erro no login:', error.message);
    }
}

// Listar produtos
async function listarProdutos() {
    try {
        const produtos = await ProductAPI.listar({ 
            categoria: 'bikes',
            precoMax: 2000,
            ordenar: 'preco_asc'
        });
        console.log('Produtos:', produtos);
    } catch (error) {
        console.error('Erro ao listar produtos:', error.message);
    }
}

// Criar produto com upload
async function criarProduto() {
    try {
        const formData = new FormData();
        formData.append('nome', 'Minha Bike');
        formData.append('preco', 1899.90);
        formData.append('descricao', 'Bike incrível');
        
        // Adicionar imagens
        const imagens = document.getElementById('imagens').files;
        for(let file of imagens) {
            formData.append('imagens', file);
        }
        
        const produto = await ProductAPI.criar(formData, (progress) => {
            console.log(`Upload: ${progress}%`);
        });
        
        console.log('Produto criado:', produto);
    } catch (error) {
        console.error('Erro ao criar produto:', error.message);
    }
}

// Processar pagamento
async function finalizarCompra(pedidoId) {
    try {
        const pagamento = await PaymentAPI.processarCartao(pedidoId, {
            numero: '4111111111111111',
            nome: 'João Silva',
            validade: '12/25',
            cvv: '123',
            parcelas: 12
        });
        
        console.log('Pagamento aprovado:', pagamento);
        window.location.href = '/pedido-confirmado.html';
    } catch (error) {
        console.error('Erro no pagamento:', error.message);
    }
}
*/

// Nota: Os exemplos estão comentados para não executar automaticamente
