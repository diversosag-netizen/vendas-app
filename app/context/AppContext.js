import React, { createContext, useContext, useState } from 'react';

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

  const lojas = [
    { id: '1', nome: 'Maranata Serviços Técnicos', cor: '#4CAF50' },
    { id: '2', nome: 'TechStore', cor: '#2196F3' },
    { id: '3', nome: 'Gadget Shop', cor: '#FF9800' }
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

  // 2. OBJETO DE FALLBACK GARANTIDO para evitar undefined properties
  const lojaAtualSegura = lojas.find(loja => loja.id === lojaAtiva) || lojas[0];

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
      adicionarVenda,
      adicionarAoEstoque,
      adicionarCliente,
      adicionarProduto,
      selecionarProduto,
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
