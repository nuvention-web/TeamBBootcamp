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

  downloadPage(): void {
    var html = document.getElementById('body').innerHTML;
    var htmlContent = [html];
    var bl = new Blob(htmlContent, {type: "text/html"});
    var a = document.createElement("a");
    a.href = URL.createObjectURL(bl);
    var savename = prompt("what do you want to save the file as?");
    a.download = savename;
    a.hidden = true;
    document.body.appendChild(a);
    a.innerHTML = "something random - nobody will see this, it doesn't matter what you put here";
    a.click();

  }

  filterIssues(issues): void {
    var storyIssues = issues.filter(issue => issue.labels.length > 0)
  	this.openissues = storyIssues.filter(issue => issue.state == "open")
  	this.closedissues = storyIssues.filter(issue => issue.state == "closed")
  }

	getIssues(repositoryUrl): void {
	  this.issueService.getIssues(repositoryUrl)
	    .subscribe(issues => this.filterIssues(issues));
	}

}
