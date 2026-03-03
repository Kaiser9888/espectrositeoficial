// ===== DATA.JS - Dados mockados para teste =====

// Produtos mockados
window.produtosMock = [
    {
        id: 1,
        nome: 'Mountain Bike Caloi Elite Câmbio Shimano 21 Marchas Aro 29',
        preco: 1899.90,
        precoAntigo: 2499.90,
        descricao: 'A Mountain Bike Caloi Elite é a escolha perfeita para quem busca performance e conforto nas trilhas. Equipada com componentes de alta qualidade, esta bike oferece durabilidade e eficiência em qualquer terreno.',
        categoria: 'bikes',
        subcategoria: 'mtb',
        marca: 'Caloi',
        modelo: 'Elite',
        ano: 2024,
        condicao: 'novo',
        imagens: [
            'assets/produtos/bike1.jpg',
            'assets/produtos/bike2.jpg',
            'assets/produtos/bike3.jpg',
            'assets/produtos/bike4.jpg'
        ],
        estoque: 3,
        peso: 14,
        dimensoes: {
            altura: 100,
            largura: 20,
            comprimento: 170
        },
        freteGratis: false,
        frete: 45.90,
        vendedor: {
            id: 101,
            nome: 'Bike Shop Brasil',
            avatar: 'assets/icons/avatar-loja.jpg',
            avaliacao: 4.9,
            totalVendas: 2345,
            local: 'Osasco, SP'
        },
        avaliacoes: [
            {
                id: 1001,
                usuario: 'João Silva',
                avatar: 'assets/icons/avatar-user.jpg',
                nota: 5,
                comentario: 'Produto excelente! Chegou antes do prazo, bem embalado e corresponde exatamente à descrição.',
                data: '2026-03-25',
                fotos: ['assets/produtos/avaliacao1.jpg']
            },
            {
                id: 1002,
                usuario: 'Maria Oliveira',
                avatar: 'assets/icons/avatar-user2.jpg',
                nota: 4,
                comentario: 'Muito boa para o preço. Único ponto negativo é que os freios poderiam ser melhores.',
                data: '2026-03-23'
            }
        ],
        especificacoes: {
            'Quadro': 'Alumínio 6061, tamanho 17"',
            'Câmbio': 'Shimano Tourney 21 marchas',
            'Freios': 'V-Brake',
            'Roda': 'Aro 29"',
            'Pneus': '29x2.1"',
            'Garfo': 'Suspensão dianteira com trava',
            'Peso': 'Aproximadamente 14kg'
        },
        views: 1234,
        favoritos: 56,
        dataCriacao: '2026-03-01'
    },
    {
        id: 2,
        nome: 'Capacete Giro Syntax MIPS - Segurança e Conforto',
        preco: 299.90,
        precoAntigo: 399.90,
        descricao: 'Capacete de alta performance com tecnologia MIPS para maior proteção em impactos rotacionais. Ideal para ciclistas que buscam segurança e conforto.',
        categoria: 'acessorios',
        subcategoria: 'capacetes',
        marca: 'Giro',
        modelo: 'Syntax MIPS',
        ano: 2024,
        condicao: 'novo',
        imagens: [
            'assets/produtos/capacete1.jpg',
            'assets/produtos/capacete2.jpg'
        ],
        estoque: 5,
        peso: 0.3,
        dimensoes: {
            altura: 20,
            largura: 25,
            comprimento: 30
        },
        freteGratis: false,
        frete: 25.90,
        vendedor: {
            id: 102,
            nome: 'Capacetes Pro',
            avatar: 'assets/icons/avatar-user2.jpg',
            avaliacao: 4.8,
            totalVendas: 1234,
            local: 'São Paulo, SP'
        },
        avaliacoes: [
            {
                id: 1003,
                usuario: 'Carlos Santos',
                nota: 5,
                comentario: 'Muito confortável e seguro. A tecnologia MIPS dá mais tranquilidade.',
                data: '2026-03-24'
            }
        ],
        especificacoes: {
            'Tecnologia': 'MIPS',
            'Tamanhos': 'S, M, L',
            'Peso': '280g',
            'Ventilação': '15 aberturas'
        },
        views: 567,
        favoritos: 23,
        dataCriacao: '2026-03-05'
    },
    {
        id: 3,
        nome: 'Quadro Specialized Aluminium - Tamanho 17"',
        preco: 899.90,
        precoAntigo: 1299.90,
        descricao: 'Quadro Specialized em alumínio, tamanho 17". Ideal para montar sua bike personalizada. Leve e resistente.',
        categoria: 'quadros',
        subcategoria: 'quadro-mtb',
        marca: 'Specialized',
        modelo: 'Aluminium',
        ano: 2023,
        condicao: 'usado',
        imagens: [
            'assets/produtos/quadro1.jpg',
            'assets/produtos/quadro2.jpg'
        ],
        estoque: 1,
        peso: 2.5,
        dimensoes: {
            altura: 50,
            largura: 20,
            comprimento: 100
        },
        freteGratis: false,
        frete: 35.90,
        vendedor: {
            id: 101,
            nome: 'Bike Shop Brasil',
            avatar: 'assets/icons/avatar-loja.jpg',
            avaliacao: 4.9,
            totalVendas: 2345,
            local: 'Osasco, SP'
        },
        avaliacoes: [],
        especificacoes: {
            'Material': 'Alumínio 6061',
            'Tamanho': '17"',
            'Peso': '2.5kg',
            'Ano': '2023'
        },
        views: 234,
        favoritos: 12,
        dataCriacao: '2026-03-10'
    },
    {
        id: 4,
        nome: 'Pneu Kenda 29x2.1 - Par (Dianteiro + Traseiro)',
        preco: 149.90,
        precoAntigo: 199.90,
        descricao: 'Pneus Kenda para MTB, medidas 29x2.1. Ótima aderência e durabilidade para trilhas.',
        categoria: 'componentes',
        subcategoria: 'pneus',
        marca: 'Kenda',
        modelo: '29x2.1',
        ano: 2024,
        condicao: 'novo',
        imagens: [
            'assets/produtos/pneu1.jpg',
            'assets/produtos/pneu2.jpg'
        ],
        estoque: 10,
        peso: 1.2,
        dimensoes: {
            altura: 29,
            largura: 10,
            comprimento: 29
        },
        freteGratis: false,
        frete: 25.90,
        vendedor: {
            id: 103,
            nome: 'Pneus e Rodas',
            avatar: 'assets/icons/avatar-user3.jpg',
            avaliacao: 4.7,
            totalVendas: 890,
            local: 'Curitiba, PR'
        },
        avaliacoes: [],
        especificacoes: {
            'Aro': '29"',
            'Largura': '2.1"',
            'Tipo': 'Cravos',
            'Quantidade': 'Par'
        },
        views: 345,
        favoritos: 15,
        dataCriacao: '2026-03-12'
    },
    {
        id: 5,
        nome: 'Mountain Bike Sense Ride - Suspensão Traseira',
        preco: 2299.90,
        precoAntigo: 2999.90,
        descricao: 'Mountain Bike Sense Ride com suspensão traseira. Perfeita para trilhas mais agressivas.',
        categoria: 'bikes',
        subcategoria: 'mtb',
        marca: 'Sense',
        modelo: 'Ride',
        ano: 2024,
        condicao: 'seminovo',
        imagens: [
            'assets/produtos/bike2.jpg',
            'assets/produtos/bike3.jpg'
        ],
        estoque: 2,
        peso: 15,
        dimensoes: {
            altura: 100,
            largura: 20,
            comprimento: 170
        },
        freteGratis: true,
        frete: 0,
        vendedor: {
            id: 101,
            nome: 'Bike Shop Brasil',
            avatar: 'assets/icons/avatar-loja.jpg',
            avaliacao: 4.9,
            totalVendas: 2345,
            local: 'Osasco, SP'
        },
        avaliacoes: [],
        especificacoes: {
            'Quadro': 'Alumínio com suspensão',
            'Câmbio': 'Shimano Deore 1x12',
            'Freios': 'Disco hidráulico',
            'Roda': 'Aro 29"'
        },
        views: 456,
        favoritos: 28,
        dataCriacao: '2026-03-08'
    },
    {
        id: 6,
        nome: 'Luva de Ciclismo Giro Monaco II',
        preco: 89.90,
        precoAntigo: 129.90,
        descricao: 'Luva de ciclismo com amortecimento em gel. Conforto e proteção para longos percursos.',
        categoria: 'vestuario',
        subcategoria: 'luvas',
        marca: 'Giro',
        modelo: 'Monaco II',
        ano: 2024,
        condicao: 'novo',
        imagens: [
            'assets/produtos/luva1.jpg'
        ],
        estoque: 15,
        peso: 0.1,
        dimensoes: {
            altura: 5,
            largura: 10,
            comprimento: 20
        },
        freteGratis: false,
        frete: 15.90,
        vendedor: {
            id: 102,
            nome: 'Capacetes Pro',
            avatar: 'assets/icons/avatar-user2.jpg',
            avaliacao: 4.8,
            totalVendas: 1234,
            local: 'São Paulo, SP'
        },
        avaliacoes: [],
        especificacoes: {
            'Tamanhos': 'P, M, G',
            'Material': 'Sintético',
            'Amortecimento': 'Gel'
        },
        views: 123,
        favoritos: 5,
        dataCriacao: '2026-03-15'
    },
    {
        id: 7,
        nome: 'Garrafa Térmica Bike Squad 500ml',
        preco: 39.90,
        precoAntigo: 59.90,
        descricao: 'Garrafa térmica para bike, mantém a temperatura por até 6 horas. Material livre de BPA.',
        categoria: 'acessorios',
        subcategoria: 'garrafas',
        marca: 'Bike Squad',
        modelo: 'Thermo',
        ano: 2024,
        condicao: 'novo',
        imagens: [
            'assets/produtos/garrafa1.jpg'
        ],
        estoque: 20,
        peso: 0.2,
        dimensoes: {
            altura: 20,
            largura: 7,
            comprimento: 7
        },
        freteGratis: false,
        frete: 10.90,
        vendedor: {
            id: 104,
            nome: 'Acessórios Bike',
            avatar: 'assets/icons/avatar-user4.jpg',
            avaliacao: 4.6,
            totalVendas: 567,
            local: 'Belo Horizonte, MG'
        },
        avaliacoes: [],
        especificacoes: {
            'Capacidade': '500ml',
            'Material': 'Aço inox',
            'Isolamento': 'Térmico'
        },
        views: 89,
        favoritos: 3,
        dataCriacao: '2026-03-18'
    },
    {
        id: 8,
        nome: 'Farol Dianteiro LED 1000 Lumens',
        preco: 59.90,
        precoAntigo: 89.90,
        descricao: 'Farol dianteiro super potente com 1000 lumens. Recarregável via USB, ideal para pedaladas noturnas.',
        categoria: 'acessorios',
        subcategoria: 'iluminacao',
        marca: 'Light Pro',
        modelo: 'X1000',
        ano: 2024,
        condicao: 'novo',
        imagens: [
            'assets/produtos/luz1.jpg'
        ],
        estoque: 8,
        peso: 0.15,
        dimensoes: {
            altura: 5,
            largura: 5,
            comprimento: 10
        },
        freteGratis: false,
        frete: 15.90,
        vendedor: {
            id: 104,
            nome: 'Acessórios Bike',
            avatar: 'assets/icons/avatar-user4.jpg',
            avaliacao: 4.6,
            totalVendas: 567,
            local: 'Belo Horizonte, MG'
        },
        avaliacoes: [],
        especificacoes: {
            'Potência': '1000 lumens',
            'Bateria': '2000mAh',
            'Recarga': 'USB',
            'Modos': '5 modos de iluminação'
        },
        views: 156,
        favoritos: 7,
        dataCriacao: '2026-03-20'
    }
];

// Usuários mockados
window.usuariosMock = [
    {
        id: 1,
        nome: 'João Silva',
        email: 'joao@email.com',
        tipo: 'comprador',
        avatar: 'assets/icons/avatar-user.jpg',
        dataCadastro: '2025-03-15',
        compras: 47,
        avaliacao: 4.8
    },
    {
        id: 101,
        nome: 'Bike Shop Brasil',
        email: 'loja@bikeshop.com',
        tipo: 'vendedor',
        avatar: 'assets/icons/avatar-loja.jpg',
        dataCadastro: '2024-01-10',
        vendas: 2345,
        avaliacao: 4.9,
        documentos: {
            cpf: '123.456.789-00',
            cnpj: '12.345.678/0001-90',
            status: 'aprovado'
        }
    },
    {
        id: 102,
        nome: 'Capacetes Pro',
        email: 'contato@capacetespro.com',
        tipo: 'vendedor',
        avatar: 'assets/icons/avatar-user2.jpg',
        dataCadastro: '2024-06-20',
        vendas: 1234,
        avaliacao: 4.8,
        documentos: {
            cpf: '987.654.321-00',
            cnpj: '98.765.432/0001-10',
            status: 'aprovado'
        }
    }
];

// Pedidos mockados
window.pedidosMock = [
    {
        id: 'ESP-123456',
        compradorId: 1,
        vendedorId: 101,
        data: '2026-03-25',
        status: 'entregue',
        itens: [
            {
                produtoId: 1,
                nome: 'Mountain Bike Caloi Elite',
                quantidade: 1,
                preco: 1899.90
            }
        ],
        total: 1899.90,
        frete: 45.90,
        pagamento: {
            tipo: 'cartao',
            parcelas: 12
        }
    },
    {
        id: 'ESP-123457',
        compradorId: 1,
        vendedorId: 102,
        data: '2026-03-20',
        status: 'enviado',
        itens: [
            {
                produtoId: 2,
                nome: 'Capacete Giro Syntax MIPS',
                quantidade: 2,
                preco: 299.90
            }
        ],
        total: 599.80,
        frete: 25.90,
        pagamento: {
            tipo: 'pix'
        }
    }
];

// Favoritos mockados
window.favoritosMock = [1, 3, 5];

// Mensagens mockadas
window.mensagensMock = [
    {
        id: 1,
        remetenteId: 101,
        destinatarioId: 1,
        remetenteNome: 'Bike Shop Brasil',
        remetenteAvatar: 'assets/icons/avatar-loja.jpg',
        ultimaMensagem: 'Olá! Sim, ainda tenho a bike disponível...',
        data: '2026-03-26T14:30:00',
        lida: false,
        produtoId: 1
    },
    {
        id: 2,
        remetenteId: 102,
        destinatarioId: 1,
        remetenteNome: 'Capacetes Pro',
        remetenteAvatar: 'assets/icons/avatar-user2.jpg',
        ultimaMensagem: 'O código de rastreio é BR123456789...',
        data: '2026-03-25T10:15:00',
        lida: true
    }
];

// Notificações mockadas
window.notificacoesMock = [
    {
        id: 1,
        tipo: 'promocao',
        mensagem: 'Promoção relâmpago: 20% off em capacetes!',
        data: '2026-03-26T09:00:00',
        lida: false
    },
    {
        id: 2,
        tipo: 'pedido',
        mensagem: 'Seu pedido #ESP-123457 foi enviado!',
        data: '2026-03-25T14:30:00',
        lida: false
    },
    {
        id: 3,
        tipo: 'avaliacao',
        mensagem: 'Você recebeu uma nova avaliação!',
        data: '2026-03-24T11:20:00',
        lida: true
    }
];

// Categorias
window.categoriasMock = [
    {
        id: 'bikes',
        nome: 'Bicicletas',
        icone: 'fa-bicycle',
        subcategorias: ['Mountain Bike', 'Speed', 'BMX', 'Urbana', 'Elétrica']
    },
    {
        id: 'quadros',
        nome: 'Quadros',
        icone: 'fa-cubes',
        subcategorias: ['MTB', 'Speed', 'BMX', 'Urbano']
    },
    {
        id: 'componentes',
        nome: 'Componentes',
        icone: 'fa-cogs',
        subcategorias: ['Rodas', 'Pneus', 'Transmissão', 'Freios', 'Suspensão']
    },
    {
        id: 'acessorios',
        nome: 'Acessórios',
        icone: 'fa-tools',
        subcategorias: ['Capacetes', 'Luvas', 'Óculos', 'Iluminação', 'Garrafas']
    }
];

// Funções auxiliares
window.dataUtils = {
    getProdutoById: function(id) {
        return window.produtosMock.find(p => p.id == id);
    },
    
    getProdutosByCategoria: function(categoria) {
        return window.produtosMock.filter(p => p.categoria === categoria);
    },
    
    getProdutosDestaque: function() {
        return window.produtosMock.slice(0, 4);
    },
    
    getProdutosRecentes: function(ids) {
        return window.produtosMock.filter(p => ids.includes(p.id.toString()));
    },
    
    getUsuarioById: function(id) {
        return window.usuariosMock.find(u => u.id == id);
    },
    
    getVendedorById: function(id) {
        return window.usuariosMock.find(u => u.id == id && u.tipo === 'vendedor');
    },
    
    getPedidosByUsuario: function(usuarioId) {
        return window.pedidosMock.filter(p => p.compradorId == usuarioId || p.vendedorId == usuarioId);
    },
    
    getMensagensByUsuario: function(usuarioId) {
        return window.mensagensMock.filter(m => m.remetenteId == usuarioId || m.destinatarioId == usuarioId);
    },
    
    getNotificacoesByUsuario: function(usuarioId) {
        return window.notificacoesMock;
    }
};