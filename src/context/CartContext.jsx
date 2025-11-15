// src/context/CartContext.jsx
import { createContext, useContext, useState } from 'react';

// 1. Cria o Contexto
const CartContext = createContext();

// 2. Cria o Provedor
function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]); // Array dos itens no carrinho

  // --- Função para Adicionar ao Carrinho ---
  function addToCart(itemToAdd) {
    setCartItems(prevItems => {
      // 1. O item já existe no carrinho?
      const existingItem = prevItems.find(item => item.id === itemToAdd.id);

      if (existingItem) {
        // 2. Se sim, atualiza a quantidade dele
        return prevItems.map(item =>
          item.id === itemToAdd.id
            ? { ...item, quantity: item.quantity + 1 } // Incrementa a quantidade
            : item
        );
      } else {
        // 3. Se não, adiciona o item novo com quantidade 1
        return [...prevItems, { ...itemToAdd, quantity: 1 }];
      }
    });
  }

  // --- Função para Remover do Carrinho ---
  function removeFromCart(itemIdToRemove) {
    setCartItems(prevItems => {
      // 1. Encontra o item
      const existingItem = prevItems.find(item => item.id === itemIdToRemove);

      if (existingItem.quantity === 1) {
        // 2. Se a quantidade é 1, remove o item do array
        return prevItems.filter(item => item.id !== itemIdToRemove);
      } else {
        // 3. Se for mais de 1, apenas diminui a quantidade
        return prevItems.map(item =>
          item.id === itemIdToRemove
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });
  }

  // --- Função para Limpar o Carrinho ---
  function clearCart() {
    setCartItems([]);
  }
  
  // --- Valor que o Contexto vai fornecer ---
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    // Um cálculo rápido do total de itens (não produtos únicos)
    totalItemsInCart: cartItems.reduce((total, item) => total + item.quantity, 0)
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// 3. Hook customizado para facilitar o uso
function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}

export { CartProvider, useCart };