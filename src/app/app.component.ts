import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';

import { AppService } from './app.service';

@Component({
  selector: 'ld-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  devices: any;
  deviceSubscription: Subscription;

  fileName = 'SilentDevicesSheet.xlsx';
  fileToUpload: File = null;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.deviceSubscription = this.appService.getDevicesDetails()
      .subscribe(data => {
        if (data) {
          this.devices = data;
        }
      });
  }

  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    let tempArray = [];
    const reader = new FileReader();
    const file = ev.target.files[0];
    reader.onload = (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary',cellDates:true });
      jsonData = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        tempArray = XLSX.utils.sheet_to_json(sheet, {dateNF:"dd.MM.yyyy"});
        this.devices = tempArray.map(el => {
          if (el.hasOwnProperty("Product Number")) {
            el.pNo = el["Product Number"];
            delete el["Product Number"];
          }
          if (el.hasOwnProperty("Partner")) {
            el.partner = el["Partner"];
            delete el["Partner"];
          }
          if (el.hasOwnProperty("MS Contract ID")) {
            el.contractId = el["MS Contract ID"];
            delete el["MS Contract ID"];
          }
          if (el.hasOwnProperty("Last Modified Date")) {
            el.lastmodifieddate = el["Last Modified Date"];
            delete el["Last Modified Date"];
          }
          return el;
        });
        console.log(this.devices);
        return initial;
      }, {});
      console.log(jsonData.Sheet1);
    }
    reader.readAsBinaryString(file);
  }

  ngOnDestroy() {
    this.deviceSubscription.unsubscribe();
  }

}
