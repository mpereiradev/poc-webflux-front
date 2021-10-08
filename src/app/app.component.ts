import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client-reactive';
  constructor(public httpClient: HttpClient) {}

  requestsBlocking(limit: number) {
    for (let i = 0; i < limit; i++) {
      console.log("Sending request");
      this.httpClient.get("http://localhost:8080/blocking").subscribe(res => console.log(res));
    }
  }

  requestsBlockingProccess(limit: number) {
    for (let i = 0; i < limit; i++) {
      console.log("Sending request");
      this.httpClient.get("http://localhost:8080/blocking/http").subscribe(res => console.log(res));
    }
  }

  requestsUnblocking(limit: number) {
    for (let i = 1; i <= limit; i++) {
      console.log("Sending request unblocking");
      this.httpClient.get("http://localhost:8080/unblocking", {responseType: 'text'}).subscribe(res => console.log(`Request: ${i}. Response: ${res}`));
    }
  }

  requestsUnblockingMono(limit: number) {
    for (let i = 0; i < limit; i++) {
      console.log("Sending request unblocking mono");
      this.httpClient.get("http://localhost:8080/unblocking/generate").subscribe(res => console.log(`Request: ${i}. Response: ${res}`));
    }
  }

  requestsStreams(limit: number) {
    for (let i = 1; i <= limit; i++) {
      console.log("Sending request unblocking stream");
      new Observable<String>((obs) => {
        let eventSource = new EventSource("http://localhost:8080/unblocking");
        eventSource.onmessage = (event) => { obs.next(event.data); }
        eventSource.onerror = (error) => {
          if(eventSource.readyState === 0) {
            eventSource.close();
            obs.complete();
          } else {
            obs.error('EventSource error: ' + error);
          }
        }
      }).subscribe(res => console.log(`Request: ${i}. Response: ${res}`));
    }
  }
}
