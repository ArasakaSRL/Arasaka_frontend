import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import AuthLoader from './components/AuthLoader'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthLoader>
      <App />
    </AuthLoader>
  </BrowserRouter>
)