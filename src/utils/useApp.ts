import axios from 'axios';
import { ReactNode, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';
import { openWindowHolder } from './WindowHolder';
import { RequestToAuth } from '../types';

const SOCKET_URL = (import.meta as any).env.VITE_SOCKET_URL;
const JOIN_URL = (id: string) => (import.meta as any).env.VITE_SERVER_URL + '/api/join/' + id

let closeAuthWindow = () => {};
let closeCoreWindow = () => {};

let socket: Socket | null = null;

export function noWait(feedback?: string) {
  if (socket) {
    socket.emit('no-wait', feedback)
  }
}

export function useApp() {
  const [error, setError] = useState<ReactNode>('');
  const [info, setInfo] = useState('');
  const [config, setConfig] = useState<any>({ background: null });
  const [user, setUser] = useState({ username: '', userId: '', avatar: '' as null | string });

  useEffect(() => {
    const id = window.location.pathname.replace('/', '');

    (async () => {
      const { data: { accessToken, waitingPageConfig, authPage } } = await axios.get<RequestToAuth>(JOIN_URL(id));

      setConfig(waitingPageConfig);
      // closeAuthWindow = openWindowHolder(authPage);

      socket = io(SOCKET_URL, { query: { jwt: accessToken } });

      socket.on('auth-success', ({ username, userId, avatar }) => {
        setUser({ userId, username, avatar });
        setError('');
        setInfo('');
        closeAuthWindow();
      });

      socket.on('auth-reject', (reason) => {
        setError('Вы не прошли аутентификацию по причине: ' + reason);
        setInfo('');
        closeAuthWindow();
      });

      socket.on('open-page', (url) => {
        closeCoreWindow = openWindowHolder(url);
      });

      socket.on('close-page', () => {
        closeCoreWindow();
      });

      socket.on('join-info', (msg) => {
        setInfo(msg);
        setError('');
      });

      socket.on('join-error', (reason: string) => {
        // TODO Действия при ошибке входа
      });

      socket.on('join-success', ({ token }: { token: string }) => {
        // TODO Действия при успешном входе
      });
    })();
  }, []);

  return {
    error,
    info,
    config,
    user,
  };
}

