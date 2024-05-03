import React from 'react';
import { Link } from 'react-router-dom';
import './Button.css';

const Button = ({ text, path, visible }) => {
  if (!visible) return null;

  return (
    <div className='button-class'>
    <Link to={path}>
      <button>{text}</button>
    </Link>
    </div>
  );
};

export default Button;