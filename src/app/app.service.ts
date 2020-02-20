import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AppService {

    private _jsonURL = 'assets/devices.json';

    constructor(private httpClient: HttpClient) {}

    getDevicesDetails() {
        return this.httpClient.get(this._jsonURL);
    }
}