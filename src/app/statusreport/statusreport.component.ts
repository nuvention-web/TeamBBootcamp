import { Component, OnInit } from '@angular/core';
import { IssueService }  from '../issue.service';

@Component({
  selector: 'app-statusreport',
  templateUrl: './statusreport.component.html',
  styleUrls: ['./statusreport.component.css']
})
export class StatusreportComponent implements OnInit {

	openissues:any = null
	closedissues:any = null
	repositoryowner = "nuvention-web"
	repositoryname = "teambbootcamp"


  constructor(private issueService: IssueService) { }

  ngOnInit() {
  }

  getStatusReport(): void {
  	var repositoryUrl = "https://api.github.com/repos/" + this.repositoryowner + "/" + this.repositoryname + "/issues?state=all"
  	this.getIssues(repositoryUrl);
  }

  filterIssues(issues): void {
  	this.openissues = issues.filter(issue => issue.state == "open")
  	this.closedissues = issues.filter(issue => issue.state == "closed")
  }

	getIssues(repositoryUrl): void {
	  this.issueService.getIssues(repositoryUrl)
	    .subscribe(issues => this.filterIssues(issues));
	}

}
