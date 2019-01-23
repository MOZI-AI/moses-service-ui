import React from 'react';
import ReactDOM from 'react-dom';
import MoziService from './mozi_service';
import './style.css';

ReactDOM.render(
  <div style={{ padding: '30px 150px' }}>
    <MoziService />
  </div>,
  document.getElementById('react-root')
);
