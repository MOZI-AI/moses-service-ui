import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/antd/dist/antd.min.css';
import MoziService from './mozi_service';

ReactDOM.render(
  <div style={{ padding: '100px 300px' }}>
    <MoziService />
  </div>,
  document.getElementById('react-root')
);
