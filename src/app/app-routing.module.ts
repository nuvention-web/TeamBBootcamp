import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatusreportComponent }  from './statusreport/statusreport.component';

const routes: Routes = [
	{ path: '', redirectTo: '/statusreport', pathMatch: 'full' },
{ path: 'statusreport', component: StatusreportComponent },
];
@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
