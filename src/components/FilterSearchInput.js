import React from 'react';

export default function FilterSearchInput({
  textValue,
  handleFilterTextChange
}) {
  return <input value={textValue} onChange={handleFilterTextChange} />;
}
