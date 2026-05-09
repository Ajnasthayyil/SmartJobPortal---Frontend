import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection: signalR.HubConnection | null = null;
  private baseUrl = environment.apiUrl.replace('/api', '');
  
  // Observable for new notifications
  notificationReceived$ = new Subject<any>();

  constructor() {}

  public startConnection(token: string): void {
    if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.baseUrl}/hubs/notifications`, {
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR: Connection started');
        this.registerNotificationHandlers();
      })
      .catch(err => console.log('SignalR: Error while starting connection: ' + err));
  }

  public stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => console.log('SignalR: Connection stopped'))
        .catch(err => console.log('SignalR: Error while stopping connection: ' + err));
      this.hubConnection = null;
    }
  }

  private registerNotificationHandlers(): void {
    if (this.hubConnection) {
      this.hubConnection.on('ReceiveNotification', (data) => {
        this.notificationReceived$.next(data);
      });
    }
  }
}
