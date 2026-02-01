import React from 'react';

function Header({ cartCount }) {
  return (
    <header>
      <h1>⚽ Sports Store</h1>
      <p>Your one-stop shop for sports equipment</p>
      <div className="cart-icon">🛒 Cart ({cartCount})</div>
    </header>
  );
}

export default Header;
