import React from "react";

const CartContext = React.createContext({
  cartItems: [],
  addToCart: () => {},
  subFromCart: () => {},
  removeFromCart: () => {},
  cartLogo:0,
  clearCart:()=>{},
  handleZoom:()=>{},
  checked:null,
  updateItem:()=>{}
});

export default CartContext;
