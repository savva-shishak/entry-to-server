import { ReactNode, useEffect, useState } from 'react';
import './App.css';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

type Response = { type: 'wait', requestId: string, socketToken: string, config: any } | { type: 'accept', token: string }

const windows: { [url: string]: Window | null } = {};

function App() {
  const [error, setError] = useState<ReactNode>('');
  const [info, setInfo] = useState('');
  const [config, setConfig] = useState<any>({})

  useEffect(() => {
    let socket: Socket;

    const searchParams = new URLSearchParams(window.location.search);

    const id = window.location.pathname.replace('/', '');

    const payload = Array.from(searchParams.keys()).reduce((acc, key) => ({ ...acc, [key]: searchParams.get(key) }), {})

    axios
      .post<Response>('http://localhost:3000/join', { serverId: id, payload })
      .then(({ data }) => {
        if (data.type === 'accept') {
          const a = document.createElement('a');

          a.href = 'http://localhost:5174/?token=' + encodeURIComponent(data.token);

          document.body.appendChild(a);

          a.click();
          return;
        }

        socket = io('http://localhost:3000', { query: { jwt: data.socketToken } });

        setConfig(data.config);

        socket.on('join-request-info', (info: string) => {
          setInfo(info);
          setError('');
        });

        socket.on('join-request-accept', (token: string) => {
          const a = document.createElement('a');

          a.href = 'http://localhost:5174/?token=' + encodeURIComponent(token);

          document.body.appendChild(a);

          a.click();
        });

        socket.on('join-request-reject', (reason: string) => {
          setError(<>Подключение к серверу запрещено по причине: <b>{reason}</b></>);
          setInfo('');
        });

        socket.on('join-request-open-page', (url: string) => {
          windows[url] = window.open(url, "mozillaWindow", "popup");
        });

        socket.on('join-request-close-page', (url: string) => {
          const win = windows[url];

          if (win) {
            win.close();
          }
        });

        socket.on('join-request-error', () => {
          setError('При выходе на страницу один из плагинов вызвал ошибку');
          setInfo('');
        });
      })
      .catch(() => {
        setError('Комната не найдена');
        setInfo('');
      });

    return () => {
      if (socket) {
        socket.close(); 
      }
    }
  }, []);

  return (
    <div style={{ background: config.background }}>
      <span style={{ color: 'red' }}>{error}</span>
      <i style={{ color: 'blue' }}>{info}</i>
    </div>
  )
}

export default App
