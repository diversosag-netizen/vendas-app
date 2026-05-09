// Version 3.1 - Refactor
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. REFACTORAR: Valores padrão não-nulos para evitar Type Errors
  const [lojaAtiva, setLojaAtiva] = useState(null); // Forçar lobby ao abrir o app
  const [saldo, setSaldo] = useState(0);
  
  // Arrays inicializados para nunca serem undefined
  const [vendas, setVendas] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  // � VENDAS 3.1: Sistema de Carrinho de Compras
  const [carrinho, setCarrinho] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // 🔐 VENDAS 3.2: Sistema de Autenticação com Sincronização de Dados
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' | 'cliente'
  const [currentUser, setCurrentUser] = useState(null);

  // 📊 VENDAS 3.2: Variáveis de faturamento e estoque sincronizadas
  const [dadosCarregados, setDadosCarregados] = useState(false);

  const lojas = [
    { 
      id: '1', 
      nome: 'Maranata Serviços Técnicos', 
      cor: '#4CAF50', 
      requerSenha: true,
      tema: {
        primary: '#81C784',      // Verde claro (Catálogo)
        secondary: '#4CAF50',   // Verde médio (Promoções)  
        accent: '#2E7D32',      // Verde forte (Vendas)
        background: '#E8F5E8',
        text: '#1B5E20'         // Verde mais forte (Config)
      }
    },
    { 
      id: '2', 
      nome: 'TechStore', 
      cor: '#2196F3', 
      requerSenha: true,
      tema: {
        primary: '#64B5F6',      // Azul claro (Catálogo)
        secondary: '#2196F3',   // Azul médio (Promoções)
        accent: '#0D47A1',      // Azul forte (Vendas)
        background: '#E3F2FD',
        text: '#01579B'         // Azul mais forte (Config)
      }
    },
    { 
      id: '3', 
      nome: 'Gadget Shop', 
      cor: '#FF9800', 
      requerSenha: false,
      tema: {
        primary: '#FFB74D',      // Laranja claro (Catálogo)
        secondary: '#FF9800',   // Laranja médio (Promoções)
        accent: '#E65100',      // Laranja forte (Vendas)
        background: '#FFF3E0',
        text: '#BF360C'         // Laranja mais forte (Config)
      }
    }
  ];

  // Função para trocar de loja
  const trocarLoja = async (lojaId) => {
    setLojaAtiva(lojaId);
    setProdutoSelecionado(null);
    
    // 🔥 VENDAS 3.4: Carregar tema salvo no Firebase
    try {
      const temaSalvo = await carregarTemaFirebase(lojaId);
      console.log(`🎨 Tema carregado do Firebase: ${temaSalvo}`);
      // TODO: Aplicar tema dinamicamente
    } catch (error) {
      console.error('❌ Erro ao carregar tema:', error);
    }

    // 🔥 VENDAS 3.4: Carregar banner salvo no Firebase
    try {
      const bannerSalvo = await carregarBannerFirebase(lojaId);
      console.log(`🖼️ Banner carregado do Firebase: ${bannerSalvo}`);
      
      // Atualizar estado local do banner
      const lojaIndex = lojas.findIndex(loja => loja.id === lojaId);
      if (lojaIndex !== -1 && bannerSalvo) {
        lojas[lojaIndex].bannerImage = bannerSalvo;
        setLojaAtiva(lojaId);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar banner:', error);
    }
  };

  // Função para alternar perfil
  const togglePerfil = () => {
    console.log('Toggle perfil');
  };

  // ✅ IMPLEMENTAÇÃO: Função de logout para limpar estado do usuário
  const logout = () => {
    setLojaAtiva('1'); // Resetar para loja padrão
    setSaldo(0);
    setVendas([]);
    setEstoque([]);
    setClientes([]);
    setProdutos([]);
    setProdutoSelecionado(null);
    // 🔐 VENDAS 3.0: Limpar autenticação
    setIsAuthenticated(false);
    setUserRole(null);
    setCurrentUser(null);
  };

  // 🔐 VENDAS 3.0: Função de login
  const login = (email, senha) => {
    // Mock users para protótipo
    const mockUsers = [
      { id: 1, email: 'admin@vendas.com', role: 'admin', senha: 'admin123', nome: 'Administrador' },
      { id: 2, email: 'cliente@loja.com', role: 'cliente', senha: 'cliente123', nome: 'Cliente', id_loja: '1' },
      { id: 3, email: 'tech@store.com', role: 'cliente', senha: 'tech123', nome: 'Tech Cliente', id_loja: '2' }
    ];

    const user = mockUsers.find(u => u.email === email && u.senha === senha);
    
    if (user) {
      setIsAuthenticated(true);
      setUserRole(user.role);
      setCurrentUser(user);
      
      // Se for cliente, fixar na loja dele
      if (user.role === 'cliente' && user.id_loja) {
        setLojaAtiva(user.id_loja);
      }
      
      return true;
    }
    
    return false;
  };

  // Função para adicionar venda
  const adicionarVenda = (venda) => {
    setVendas(prev => [...prev, venda]);
  };

  // Função para adicionar ao estoque
  const adicionarAoEstoque = (item) => {
    setEstoque(prev => [...prev, item]);
  };

  // Função para adicionar cliente
  const adicionarCliente = (cliente) => {
    setClientes(prev => [...prev, cliente]);
  };

  // Função para adicionar produto
  const adicionarProduto = (produto) => {
    setProdutos(prev => [...prev, produto]);
  };

  // Função para selecionar produto
  const selecionarProduto = (produto) => {
    setProdutoSelecionado(produto);
  };

  // ✅ IMPLEMENTAR: Função para atualizar banner da loja
  const atualizarBannerLoja = async (bannerUrl) => {
    try {
      // 🔥 VENDAS 3.4: Salvar no Firebase em vez de apenas local
      const sucesso = await salvarBannerFirebase(lojaAtiva, bannerUrl);
      
      if (sucesso) {
        // Atualizar localmente também para imediatez
        const lojaIndex = lojas.findIndex(loja => loja.id === lojaAtiva);
        if (lojaIndex !== -1) {
          lojas[lojaIndex].bannerImage = bannerUrl;
          setLojaAtiva(lojaAtiva);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao atualizar banner:', error);
      return false;
    }
  };

  // 🛒 VENDAS 3.1: Funções do Carrinho de Compras
  const adicionarAoCarrinho = (produto, quantidade = 1) => {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    
    if (itemExistente) {
      // Se item já existe, aumenta quantidade
      setCarrinho(carrinho.map(item => 
        item.id === produto.id 
          ? { ...item, quantidade: item.quantidade + quantidade }
          : item
      ));
    } else {
      // Se item não existe, adiciona ao carrinho
      setCarrinho([...carrinho, { 
        ...produto, 
        quantidade,
        subtotal: produto.preco_medio * quantidade
      }]);
    }
  };

  const removerDoCarrinho = (produtoId) => {
    setCarrinho(carrinho.filter(item => item.id !== produtoId));
  };

  const atualizarQuantidadeCarrinho = (produtoId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(produtoId);
      return;
    }
    
    setCarrinho(carrinho.map(item => 
      item.id === produtoId 
        ? { ...item, quantidade: novaQuantidade, subtotal: item.preco_medio * novaQuantidade }
        : item
    ));
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  const getTotalCarrinho = () => {
    return carrinho.reduce((total, item) => total + (item.subtotal || 0), 0);
  };

  const abrirCheckout = () => {
    if (carrinho.length === 0) {
      return false; // Não abrir checkout com carrinho vazio
    }
    setIsCheckoutOpen(true);
    return true;
  };

  const fecharCheckout = () => {
    setIsCheckoutOpen(false);
  };

  // 2. OBJETO DE FALLBACK - Retorna null se nenhuma loja ativa para forçar lobby
  const lojaAtualSegura = lojas.find(loja => loja.id === lojaAtiva) || null;

  // 3. TEMA DINÂMICO - Obter tema da loja atual
  const temaAtual = lojaAtualSegura?.tema || {
    primary: '#4CAF50',
    secondary: '#81C784',
    accent: '#2E7D32',
    background: '#E8F5E8',
    text: '#1B5E20'
  };

  // 🔥 VENDAS 3.4: Funções Firebase para persistência de temas
  const salvarTemaFirebase = async (lojaId, temaId) => {
    try {
      const lojaRef = doc(db, 'lojas', lojaId);
      await updateDoc(lojaRef, {
        temaSelecionado: temaId,
        dataAtualizacao: new Date().toISOString()
      });
      console.log(`✅ Tema ${temaId} salvo para loja ${lojaId}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar tema:', error);
      return false;
    }
  };

  const carregarTemaFirebase = async (lojaId) => {
    try {
      const lojaRef = doc(db, 'lojas', lojaId);
      const lojaDoc = await getDoc(lojaRef);
      
      if (lojaDoc.exists()) {
        const dados = lojaDoc.data();
        return dados.temaSelecionado || 'forest';
      }
      return 'forest'; // Padrão
    } catch (error) {
      console.error('❌ Erro ao carregar tema:', error);
      return 'forest'; // Padrão
    }
  };

  const inicializarLojaFirebase = async (lojaId) => {
    try {
      const lojaRef = doc(db, 'lojas', lojaId);
      const lojaDoc = await getDoc(lojaRef);
      
      if (!lojaDoc.exists()) {
        // Criar documento da loja se não existir
        await setDoc(lojaRef, {
          id: lojaId,
          nome: lojas.find(l => l.id === lojaId)?.nome || 'Loja',
          temaSelecionado: 'forest',
          dataCriacao: new Date().toISOString(),
          dataAtualizacao: new Date().toISOString()
        });
        console.log(`📝 Loja ${lojaId} criada no Firebase`);
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar loja:', error);
    }
  };

  // 🔥 VENDAS 3.4: Funções Firebase para produtos
  const salvarProdutoFirebase = async (lojaId, produto) => {
    try {
      const produtosRef = doc(db, 'produtos', produto.id);
      await setDoc(produtosRef, {
        ...produto,
        idLoja: lojaId,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
      });
      console.log(`📦 Produto ${produto.nome} salvo no Firebase`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar produto:', error);
      return false;
    }
  };

  const carregarProdutosFirebase = async (lojaId) => {
    try {
      const produtosRef = collection(db, 'produtos');
      const q = query(produtosRef, where('idLoja', '==', lojaId));
      const querySnapshot = await getDocs(q);
      
      const produtos = [];
      querySnapshot.forEach((doc) => {
        produtos.push(doc.data());
      });
      
      console.log(`📦 ${produtos.length} produtos carregados do Firebase`);
      return produtos;
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error);
      return [];
    }
  };

  // 🔥 VENDAS 3.4: Funções Firebase para banners
  const salvarBannerFirebase = async (lojaId, bannerUrl) => {
    try {
      const lojaRef = doc(db, 'lojas', lojaId);
      await updateDoc(lojaRef, {
        bannerUrl: bannerUrl,
        dataAtualizacao: new Date().toISOString()
      });
      console.log(`🖼️ Banner salvo para loja ${lojaId}: ${bannerUrl}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar banner:', error);
      return false;
    }
  };

  const carregarBannerFirebase = async (lojaId) => {
    try {
      const lojaRef = doc(db, 'lojas', lojaId);
      const lojaDoc = await getDoc(lojaRef);
      
      if (lojaDoc.exists()) {
        const dados = lojaDoc.data();
        return dados.bannerUrl || '';
      }
      return '';
    } catch (error) {
      console.error('❌ Erro ao carregar banner:', error);
      return '';
    }
  };

  // 4. DEBUG: Log para verificar qual loja está sendo usada
  console.log(`DEBUG: lojaAtiva = ${lojaAtiva}, lojaAtualSegura = ${lojaAtualSegura?.nome}`);

  return (
    <AppContext.Provider value={{ 
      lojaAtiva, 
      setLojaAtiva, 
      lojas, 
      saldo, 
      vendas, 
      estoque,
      clientes,
      produtos,
      produtoSelecionado,
      trocarLoja,
      togglePerfil,
      logout, 
      login, // 🔐 VENDAS 3.0: Função de login
      // 🔐 VENDAS 3.0: Variáveis de autenticação
      isAuthenticated,
      userRole,
      currentUser,
      setIsAuthenticated,
      setUserRole,
      setCurrentUser,
      temaAtual, // 🎨 VENDAS 3.3: Tema dinâmico
      // 🔥 VENDAS 3.4: Funções Firebase
      salvarTemaFirebase,
      carregarTemaFirebase,
      inicializarLojaFirebase,
      salvarProdutoFirebase,
      carregarProdutosFirebase,
      salvarBannerFirebase,
      carregarBannerFirebase,
      adicionarVenda,
      adicionarAoEstoque,
      adicionarCliente,
      adicionarProduto,
      selecionarProduto,
      atualizarBannerLoja, // ✅ ADICIONADA: Função para atualizar banner
      // 🛒 VENDAS 3.1: Sistema de Carrinho
      carrinho,
      setCarrinho,
      adicionarAoCarrinho,
      removerDoCarrinho,
      atualizarQuantidadeCarrinho,
      limparCarrinho,
      getTotalCarrinho,
      abrirCheckout,
      fecharCheckout,
      isCheckoutOpen,
      setIsCheckoutOpen,
      // 📊 VENDAS 3.2: Sincronização de dados administrativos
      dadosCarregados,
      setDadosCarregados,
      // Dados da loja atual com fallback garantido
      lojaAtual: lojaAtualSegura,
      bannerLojaAtual: lojaAtualSegura?.bannerImage || null
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export default AppProvider; // Exportação padrão garantida
