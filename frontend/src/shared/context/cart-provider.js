import React from "react";
import CartContext from "./cart-context";

const CartProvider = (props) => {
  const [cartLogo, setCartLogo] = React.useState(0);
  const [checked, setChecked] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const clearCart = () => {
    setItems([]);
    setCartLogo(0);
  };
  const handleZoom = () => {
    setChecked(true);
    setTimeout(() => setChecked(false), 1000);
  };
  const addToCart = (item) => {
    const index = items.findIndex((items) => item.id === items.id);
    if (index !== -1) {
      const arr = [...items];
      const updatedItem = arr[index];
      updatedItem.quantity = updatedItem.quantity + item.quantity;
      setCartLogo((pre) => pre + item.quantity);
      return setItems(arr);
    }
    setItems(items.concat(item));
    setCartLogo((pre) => pre + item.quantity);
  };

  const subFromCart = (item) => {
    const Fitem = items.find((items) => item.id === items.id);
    const index = items.findIndex((items) => item.id === items.id);
    if (!Fitem) {
      return;
    }
    if (Fitem.quantity > 1) {
      const arr = [...items];
      const updatedItem = arr[index];
      updatedItem.quantity = updatedItem.quantity - 1;
      setCartLogo((pre) => pre - 1);
      return setItems(arr);
    }
    setItems(items.filter((items) => items.id !== item.id));
    setCartLogo((pre) => pre - 1);
  };

  const removeFromCart = (item) => {
    const foundedItem = items.find((fItem) => fItem.id === item.id);
    if (foundedItem) {
      setItems(items.filter((items) => items.id !== item.id));
      setCartLogo((pre) => pre - foundedItem.quantity);
    }
  };
  const updateItem = (item) => {
    const foundedItemIndex = items.findIndex((fItem) => fItem.id === item._id);
    const foundedItem = items.find((fItem) => fItem.id === item._id);

    const cartItems = [...items];
    cartItems[foundedItemIndex] = { ...foundedItem, price: item.price };
    setItems(cartItems);
  };
  return (
    <CartContext.Provider
      value={{
        cartItems: items,
        addToCart: addToCart,
        cartLogo: cartLogo,
        subFromCart: subFromCart,
        removeFromCart: removeFromCart,
        clearCart: clearCart,
        handleZoom: handleZoom,
        checked: checked,
        updateItem: updateItem,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
