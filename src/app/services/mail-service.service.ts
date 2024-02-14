import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailServiceService {

  url = 'http://13.58.9.130/mail/';

  constructor(public http: HttpClient) { }

  sendMail(mailData: any) {
    return this.http.post(this.url + 'send', mailData);
  }

}
