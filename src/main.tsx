import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AppContext from './stores/appContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <AppContext>
    <App />
  </AppContext>
  // </React.StrictMode>,
)
