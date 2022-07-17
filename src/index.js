import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import App from './App';
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // 严格模式会导致组件渲染两次，可以选择在需要用到的地方使用，参考：https://reactjs.org/docs/strict-mode.html
  // <React.StrictMode></React.StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
);