import { ReactNode, useEffect, useState } from 'react';
import { joinRequest } from './joinRequest';
import './App.css';

const windows: { [url: string]: Window | null } = {};

function App() {
  const [error, setError] = useState<ReactNode>('');
  const [info, setInfo] = useState('');
  const [config, setConfig] = useState<any>({})

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const id = window.location.pathname.replace('/', '');

    const payload = Array.from(searchParams.keys()).reduce((acc, key) => ({ ...acc, [key]: searchParams.get(key) }), {})

    return joinRequest({
      serverId: id,
      payload,
      onAccept(token, clientUrl) {
        const a = document.createElement('a');

        a.href = clientUrl + '/?token=' + token;
        a.style.display = 'none';

        document.body.appendChild(a);

        a.click();

        document.body.removeChild(a);
      },
      onReject(msg, pluginId, pluginName) {
        setInfo('');
        setError(
          <>
            Вход в комнату запрещён по причине:
            <span style={{ marginLeft: '5px', color: 'red' }}>{msg}</span>
            <div style={{ fontSize: '0.8em' }}>
              Запрещено плагином "{pluginName}" ({pluginId})
            </div>
          </>
        );
      },
      onInfo(msg) {
        setError('');
        setInfo(msg);
      },
      onError(msg) {
        setError(msg);
        setInfo('');
      },
      onOpenPage(url) {
        windows[url] = window.open(url, '', 'popup');
      },
      onClosePage(url) {
        const win = windows[url];

        if (win) {
          win.close();
        }
      },
      onConfig(config) {
        setConfig(config);
      },
    })
  }, []);

  return (
    <div style={{ background: config.background }}>
      <span style={{ color: 'red' }}>{error}</span>
      <i style={{ color: 'blue' }}>{info}</i>
    </div>
  )
}

export default App
