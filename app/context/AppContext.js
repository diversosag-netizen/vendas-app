import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. REFACTORAR: Valores padrão não-nulos para evitar Type Errors
  const [lojaAtiva, setLojaAtiva] = useState('1'); // ID padrão em vez de null
  const [saldo, setSaldo] = useState(0);
  
  // Arrays inicializados para nunca serem undefined
  const [vendas, setVendas] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

  // 🔐 VENDAS 3.0: Sistema de Autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' | 'cliente'
  const [currentUser, setCurrentUser] = useState(null);

  const lojas = [
    { id: '1', nome: 'Maranata Serviços Técnicos', cor: '#4CAF50', requerSenha: true },
    { id: '2', nome: 'TechStore', cor: '#2196F3', requerSenha: true },
    { id: '3', nome: 'Gadget Shop', cor: '#FF9800', requerSenha: false } // Cliente sem senha
  ];

  // Função para trocar de loja
  const trocarLoja = (lojaId) => {
    setLojaAtiva(lojaId);
    setProdutoSelecionado(null);
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
      // Encontrar a loja ativa no array
      const lojaIndex = lojas.findIndex(loja => loja.id === lojaAtiva);
      if (lojaIndex !== -1) {
        // Atualizar a propriedade bannerImage
        lojas[lojaIndex].bannerImage = bannerUrl;
        // Forçar re-renderização do contexto
        setLojaAtiva(lojaAtiva);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao atualizar banner:', error);
      return false;
    }
  };

  // 2. OBJETO DE FALLBACK GARANTIDO para evitar undefined properties
  const lojaAtualSegura = lojas.find(loja => loja.id === lojaAtiva) || lojas.find(loja => loja.id === lojaAtiva) || lojas[0];

  // 3. DEBUG: Log para verificar qual loja está sendo usada
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
      adicionarVenda,
      adicionarAoEstoque,
      adicionarCliente,
      adicionarProduto,
      selecionarProduto,
      atualizarBannerLoja, // ✅ ADICIONADA: Função para atualizar banner
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
