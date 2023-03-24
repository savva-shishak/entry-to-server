import axios from "axios";
import { io, Socket } from "socket.io-client";

type Response = { type: 'wait', requestId: string, socketToken: string, config: any } | { type: 'accept', token: string, clientUrl: string }

export type JoinRequestData = {
  serverId: string,
  payload: any,
  hosterUrl?: string,
  onError: (msg?: string, pluginId?: number, pluginName?: string) => void,
  onInfo: (msg: string) => void,
  onConfig: (config: any) => void,
  onAccept: (token: string, clientUrl: string, config: any) => void,
  onReject: (msg: string, pluginId: number, pluginName: string) => void,
  onOpenPage: (url: string) => void,
  onClosePage: (url: string) => void,
};

export function joinRequest({
  hosterUrl = 'http://localhost:3000',
  serverId,
  payload,
  onError,
  onInfo,
  onConfig,
  onAccept,
  onReject,
  onOpenPage,
  onClosePage,
}: JoinRequestData) {
  let socket: Socket;

  axios
    .post<Response>(hosterUrl + '/join', { serverId, payload })
    .then(({ data }) => {
      if (data.type === 'accept') {
        onAccept(data.token, data.clientUrl, {});
        return;
      }

      onConfig(data.config);

      socket = io(hosterUrl, { query: { jwt: data.socketToken } });

      socket.on('join-request-info', (info: string) => {
        onInfo(info);
      });

      socket.on('join-request-accept', ({ token, config }: { token: string, config: any }) => {
        onAccept(token, config.clientUrl, config);
      });

      socket.on('join-request-reject', ({ msg, pluginId, pluginName }: { msg: string, pluginId: number, pluginName: string }) => {
        onReject(msg, pluginId, pluginName);
      });

      socket.on('join-request-open-page', (url: string) => {
        onOpenPage(url);
      });

      socket.on('join-request-close-page', (url: string) => {
        onClosePage(url);
      });

      socket.on('join-request-error', ({ msg, pluginId, pluginName }: { msg: string, pluginId: number, pluginName: string }) => {
        onError(msg, pluginId, pluginName);
      });
    })
    .catch(() => {
      onError('Сервер не найден');
    });

  return () => {
    if (socket) {
      socket.close(); 
    }
  }
}
