import './App.css';
import { useApp } from './utils/useApp';

function App() {
  const {
    config,
    error,
    info,
    user,
  } = useApp();

  return (
    <div className="page">
      <div style={{ ...(config.background || {}) }} className="container"></div>
      <div className='label'>
        Добро пожаловать в <span style={{ color: '#0084ff' }}>WeeBee</span>
        <br />
        <small style={{ fontSize: 15 }}>Платформа для организации видеосвязи между Вами и Вашими клиентами</small>
        <br />
        <div style={{ color: 'red' }}>{error}</div>
        <div style={{ color: 'blue' }}>{info}</div>
        {user.userId && <div className='user'>Вы вошли как {user.username}. Дожидаемся разрешения с центра управления</div>}
      </div>
    </div>
  )
}

export default App
