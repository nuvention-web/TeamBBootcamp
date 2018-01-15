import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http'; // <-- NgModel lives here

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { StatusreportComponent } from './statusreport/statusreport.component';
import { IssueService } from './issue.service';

@NgModule({
  declarations: [
    AppComponent,
    StatusreportComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
	providers: [ IssueService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
