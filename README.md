# Функция для подключения к серверу
Для подключения к серверу WeeBee необходимо реализовать интерфейс JoinRequestData:
```ts
interface JoinRequestData {
  
  // Идентификатор целевого сервера
  serverId: string;
  
  // JSON информация которая будет передаваться плагинам
  payload: any;
  
  // Адрес сервиса (если поменялся)
  hosterUrl?: string;
  
  // Ошибка при обработке запроса одним из плагинов
  onError (msg?: string, pluginId?: number, pluginName?: string): void;
  
  // Плагин отправил текстовое сообщение на русском языке
  onInfo (msg: string): void;
  
  // Получение конфигурации для страницы ожидания
  onConfig (config: any): void;
  
  // Вход разрешён, получение токена, адрес клиентского приложения и итоговая конфигурация входа пользователя
  onAccept (token: string, clientUrl: string, config: any): void;

  // Вход разрешён, передается текстовое сообщение на русском языке - причина запрета, идентификатор и название плагина, запретившего вход
  onReject (msg: string, pluginId: number, pluginName: string): void;

  // Один из плагинов требует открыть подстраницу по url для дополнительного взаимодействия с пользователем
  onOpenPage (url: string): void;

  // Плагин требует закрыть подстраницу по url
  onClosePage (url: string): void;
};
```
а экземпляр передать в функцию joinRequest
```ts
function joinRequest(data: JoinRequestData): CloseRequest;

type CancelRequest = () => void;
```
Сама функция возвращает другую функцию, которая отменяет вход, если он небыл принят сразу.