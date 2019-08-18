import React from 'react';
import ReactDOM from 'react-dom';
import EditEvent from './EditEvent';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<EditEvent />, div);
  ReactDOM.unmountComponentAtNode(div);
});
