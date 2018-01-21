import { Component, OnInit } from '@angular/core';
import { IssueService }  from '../issue.service';

@Component({
  selector: 'app-statusreport',
  templateUrl: './statusreport.component.html',
  styleUrls: ['./statusreport.component.css']
})
export class StatusreportComponent implements OnInit {

	allissues:any = null
  openissues:any = null
	closedissues:any = null
	repositoryowner: string = "nuvention-web"
	repositoryname: string = "teambbootcamp"
  dateString: string = ""
  milestones: any = []
  milestoneTitles: any = []
  selectedMilestone: string = ""


  SECONDS_IN_DAY: any = 60000*60*24


  constructor(private issueService: IssueService) { }

  ngOnInit() {
  }

  getStatusReport(): void {
  	var repositoryUrl = "https://api.github.com/repos/" + this.repositoryowner + "/" + this.repositoryname + "/issues?state=all"
  	this.getIssues(repositoryUrl);
  }

  downloadPage(): void {
    //change dropdown to text
    var milestoneSelect = document.getElementById('milestoneSelect');
    var milestoneSelectParent = milestoneSelect.parentNode;
    var p = document.createTextNode((<HTMLInputElement> milestoneSelect).value.split(': ')[1]);
    milestoneSelectParent.replaceChild(p, milestoneSelect);

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

    //revert selector
    milestoneSelectParent.replaceChild(milestoneSelect, p);
  }

  filterIssues(issues): void {
    this.allissues = issues.filter(issue => issue.labels.length > 0);
    this.openissues = this.allissues.filter(issue => issue.state == "open");
  	this.closedissues = this.allissues.filter(issue => issue.state == "closed");
    this.updateMilestones();
  }

	getIssues(repositoryUrl): void {
	  this.issueService.getIssues(repositoryUrl)
	    .subscribe(issues => this.filterIssues(issues));
	}

  updateMilestones(): void {
    var repoUrl = "https://api.github.com/repos/" + this.repositoryowner + "/" + this.repositoryname + "/milestones";
    this.issueService.getIssues(repoUrl)
      .subscribe(milestones => this.setMilestones(milestones));
  }

  setMilestones(milestones): void {
    milestones.sort((m1,m2) => m1.due_on > m2.due_on);
    this.milestones = milestones;
    var milestoneTitles = this.milestones.map(m => m.title);
    this.milestoneTitles = [];
    for (var i=1;i<milestoneTitles.length;i++) {
      var milestoneString = milestoneTitles[i-1] + ' - ' + milestoneTitles[i];
      this.milestoneTitles.push(milestoneString);
    }
    this.onSelectedMilestoneChange(this.milestoneTitles[this.milestoneTitles.length-1]);
  }

  onSelectedMilestoneChange(newSelectedMilestone) {
    this.selectedMilestone = newSelectedMilestone;
    var nextMilestoneTitle = newSelectedMilestone.split(' - ')[1];
    this.openissues = this.allissues.filter(issue => (issue.state == "open" && issue.milestone.title == nextMilestoneTitle));
    this.closedissues = this.allissues.filter(issue => (issue.state == "closed" && issue.milestone.title == nextMilestoneTitle));
    this.allissues.filter(issue => (issue.state == "open" && issue.milestone.title == nextMilestoneTitle));

    var nextMilestoneObj = this.milestones.filter(milestone => milestone.title == nextMilestoneTitle)[0];
    var prevMilestoneObj = this.milestones[this.milestones.indexOf(nextMilestoneObj)-1];
    this.dateString = this.getFormattedDate(new Date(prevMilestoneObj.due_on)) + ' - ' + this.getFormattedDate(new Date(nextMilestoneObj.due_on));
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

}
