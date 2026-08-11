import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', color: '#1e293b', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h2 style={{ color: '#ef4444', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
            ⚠️ Terjadi kendala saat memuat menu:
          </h2>
          <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
            {String(this.state.error?.message || this.state.error)}
          </p>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.clear();
                window.location.reload();
              }
            }}
            style={{ padding: '10px 16px', background: '#FF5A00', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px' }}
          >
            🔄 Reset & Reload Menu
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
