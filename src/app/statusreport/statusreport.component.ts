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
	repositoryowner: string = "nuvention-web"
	repositoryname: string = "teambbootcamp"
  dateString: string = ""
  currentMilestone: string = ""
  nextMilestone: string = ""

  SECONDS_IN_DAY: any = 60000*60*24


  constructor(private issueService: IssueService) { }

  ngOnInit() {
    this.dateString = this.getFormattedDate()
  }

  getStatusReport(): void {
  	var repositoryUrl = "https://api.github.com/repos/" + this.repositoryowner + "/" + this.repositoryname + "/issues?state=all"
  	this.getIssues(repositoryUrl);
    this.updateMilestones();
  }

  downloadPage(): void {
    // this hides the buttons that add new tasks, there is proabably a better way to do this b/c it remains hidden
    var button1 = document.getElementById("c_tasks_button");
    var button2 = document.getElementById("o_stories_button");

    button1.setAttribute('hidden', 'true');
    button2.setAttribute('hidden', 'true');

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

  updateMilestones(): void {
    this.issueService.getIssues("https://api.github.com/repos/nuvention-web/TeamBBootcamp/milestones")
      .subscribe(milestones => this.setMilestones(milestones));
  }

  setMilestones(milestones): void {
    this.nextMilestone = milestones[0].title;
    this.currentMilestone = milestones[1].title;
  }

  newTaskItem(section): void {
    var task = document.createElement("dl");
    var text = document.createTextNode("task information");
    var number = document.createTextNode("#:");
    var taskNumber = document.createElement("dt");
    var taskItem = document.createElement("dd");

    task.classList.add("f6", "lh-title", "mv2");
    taskNumber.classList.add("dib", "b");
    taskItem.classList.add("dib", "ml1", "gray");

    task.setAttribute("contenteditable", "true");
    // taskNumber.setAttribute("contenteditable", "true");
    // taskItem.setAttribute("contenteditable", "true");

    taskItem.appendChild(text);
    taskNumber.appendChild(number);
    task.appendChild(taskNumber);
    task.appendChild(taskItem);
    document.getElementById(section).appendChild(task);
  }

  getFormattedDate(dateObj = null): string {
    // defaults to current date but accepts custom date if provided as parameter
    var dateObj = dateObj == null ? new Date() : dateObj;
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    return month + "/" + day + "/" + year;
  }

  getDateSomeDaysAgo(days): string {
    var newDateObj = new Date(new Date().getTime()-this.SECONDS_IN_DAY*days);
    return this.getFormattedDate(newDateObj);
  }

}
