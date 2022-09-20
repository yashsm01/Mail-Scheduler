import {AfterViewInit,OnInit, Component, ViewChild, Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  now:Date = new Date();
  open :boolean = false;
  start:any= "";
  end:any= "";
  submitted = false;
  loginForm = new FormGroup({
    Email: new FormControl('',{validators:[Validators.email]}),
    Subject: new FormControl('',{validators:[Validators.required]}),
    Message: new FormControl('',{validators:[Validators.required]}),
    Time: new FormControl(null)
  })
  constructor(private http:HttpClient) {}
  ngOnInit(): void {
    this.http.get(environment.url+"/api/filter",)
  }
  list:PeriodicElement[]=[];
  displayedColumns: string[] = ['Email', 'Subject', 'Message', 'Time'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.list);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onfilter(){
    let x = new Date(this.start);
    let y = new Date(this.end);

    this.http.post(environment.url+"/api/filter",{start:new Date(x.getTime()+  1000*60*60*5+1000*60*30 ).toISOString(),end:new Date(y.getTime()+  1000*60*60*5+1000*60*30 ).toISOString()}).subscribe((data:any) => {
      console.log(data.response);
      this.list = [];
      this.list.push(...data.response);
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.list);
    })
  }
  add(){
    this.open = !this.open;
  }
  onSubmit(){
    this.submitted = true;
    if (this.loginForm.invalid) return;
    let x = new Date((this.loginForm.get('Time').value));
    let allItems = {

      Email:this.loginForm.get('Email').value,
      Message:this.loginForm.get('Message').value,
      Subject:this.loginForm.get('Subject').value,
      Time:new Date(x.getTime()+  1000*60*60*5+1000*60*30 ).toISOString(),
    }
    this.http.post(environment.url+"/api/store",allItems).subscribe((data:any) => {
      console.log(data.message);
      this.loginForm.reset();
      //this.list.push(data.message);
    })

    console.log(this.loginForm);
  }
}

export interface PeriodicElement {
  id:number;
  Email: string;
  Subject: string;
  Message: string;
  Time: Date;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {id: 1, Email: 'Hydrogen', Subject: "add", Message: 'H', Time:new Date()},
  
];



// @Component({
//   selector: 'dialog-overview-example-dialog',
//   templateUrl: 'popup.html',
// })
// export class DialogOverviewExampleDialog {

//   submitted = false;

 
//   constructor(
//     public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: PeriodicElement,
//   ) {}

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

//   onSubmit(){
//     this.submitted = true;
//   //   if (this.Forms.invalid) {
//   //     return;
//   // }
//     //console.log(this.Forms);
//   }
// }