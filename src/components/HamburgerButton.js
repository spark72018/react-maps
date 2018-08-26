import React from 'react';

export default function HamburgerButton({ open, handleHamburgerButtonClick }) {
  return (
    <button
      onClick={handleHamburgerButtonClick}
      className={open ? 'hamburger open' : 'hamburger'}
    >
      <span className="line" />
      <span className="line" />
      <span className="line" />
    </button>
  );
}
