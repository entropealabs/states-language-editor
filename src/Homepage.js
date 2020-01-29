import React from 'react';
import init from './editor';

const Homepage = () => (
  <div>
    <h1>States Language Editor</h1>
    <div style={{ width: '100vw', height: '90vh' }} ref={el => init(el)} />
  </div>
);

export default Homepage;
