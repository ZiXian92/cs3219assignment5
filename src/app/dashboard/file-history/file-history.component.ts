import { Component, OnInit } from '@angular/core';
import { GithubService } from '../../services/github.service';
import * as moment from 'moment';

@Component({
    selector: 'file-history',
    templateUrl: 'file-history.component.html'
})
export class FileHistoryComponent implements OnInit {
	constructor(
    private githubService: GithubService
  ) {}

  private fileTree;
  private fileSelect;
  private lineSelect;
  private fileChangesList;
  private selectedFileChanges;
  private filePatch;
  private showVisualization;
  private showError;

  ngOnInit() :void {
    this.getFileTree();
    this.selectedFileChanges = null;
    this.fileChangesList = null;
    this.filePatch = null;
    this.showVisualization = false;
    this.showError = false;
    this.fileSelect = {
      file: null
    };
    this.lineSelect = {
      option: false,
      fromLine: null,
      toLine: null 
    }
  }

  getFileTree() {
    var type = "fileListing";
    var fileParams = {branch: "master"};
    var apiString = this.githubService.buildApiString(type, fileParams);
    this.githubService.get(apiString)
    .subscribe(function(response) {
      if(response.tree) {
        this.fileTree = this.parseFileListData(response);
        this.fileTree = this.sortByType(this.fileTree);
      }
    }.bind(this));
  }

  getDetailedCommits(file) {
    var type = "detailedCommits";
    var startDate = new Date(0).toISOString();
    var endDate = new Date().toISOString();
    var commitParams = {
      branch: "master",
      path: file.fullName,
      since: startDate,
      until: endDate
    };
    var apiString = this.githubService.buildApiString(type, commitParams);
    console.log(apiString);
    this.githubService.get(apiString)
    .subscribe(function(response) {
      this.fileChangesList = this.processFileChanges(response, file.fullName, this.lineSelect);
      this.displayFileChanges(this.fileChangesList, file.fullName);
    }.bind(this));
  }

  // Remove unneccesary files
  // Format date
  // Limit to selected lines only
  processFileChanges(fileChangesList, fileFullName, lineSelect) {

    for(var i = 0; i < fileChangesList.length; i++) {
      fileChangesList[i].file = this.getFileFromList(fileChangesList[i].files, fileFullName)    
      fileChangesList[i].date = moment(new Date(fileChangesList[i].date))
          .format('lll');
      if(lineSelect.option && !this.withinLineSelect(fileChangesList[i].file.patch, lineSelect)) {
        fileChangesList.splice(i, 1);
        i--;
      }
    }
    return fileChangesList;
  }

  getFileFromList(files, fileFullName) {
    // Get the right file
    for(var i = 0; i < files.length; i++) {
      if(fileFullName === files[i].filename) {
        return files[i];
      }
    }
  }

  withinLineSelect(patch, lineSelect) :boolean {
    const metadataRegex = /@@\s\-[0-9]+,[0-9]+\s\+[0-9]+,[0-9]+\s@@/
    let metadataList = patch.match(metadataRegex);
    console.log(metadataList);
    for(var i = 0; i < metadataList.length; i++) {
      let range = this.getMaximumRangeOfMetadata(metadataList[i]);
      if(this.intersectRange(range, lineSelect)) {
        return true;
      }
    }
    return false;
  }

  getMaximumRangeOfMetadata(metadata) {
    let range = {
      min: null,
      max: null
    };

    let delimitterRegex = /\D+/;
    let data = metadata.split(delimitterRegex);
    range.min = Math.min(parseInt(data[1]),parseInt(data[3]));
    range.max = Math.max(parseInt(data[1])+parseInt(data[2]),parseInt(data[3])+parseInt(data[4]));
    console.log(range);
    return range;
  }

  intersectRange(range, lineSelect) {
    if(range.min >= lineSelect.fromLine && range.min <= lineSelect.toLine 
        || range.max >= lineSelect.fromLine && range.max <= lineSelect.toLine
        || lineSelect.fromLine >= range.min && lineSelect.fromLine <= range.max
        || lineSelect.toLine >= range.min && lineSelect.toLine <= range.max) {
      return true;
    }
    return false;
  }

  displayFileChanges(fileChangesList, fileFullName) {
    if(fileChangesList.length) {
      let defaultFileChange = this.fileChangesList[0];
      this.selectedFileChanges = defaultFileChange;
      this.filePatch = defaultFileChange.file.patch;
      this.showVisualization = true;
    }
  }

  showFileHistory() {
    if(!this.fileSelect.file) {
      this.showError = true;
    } else if(!this.validLineSelect(this.lineSelect)) {
      this.showError = true;
    } else {
      this.getDetailedCommits(this.fileSelect.file);
    }
  }

  validLineSelect(lineSelect) {
    if(!lineSelect.option) {
      return true;
    } else {
      if(lineSelect.fromLine !== null && lineSelect.toLine !== null 
            && lineSelect.fromLine <= lineSelect.toLine 
            && lineSelect.fromLine > 0) {
        return true;
      }
    }
    return false;
  }

  goToSetup(): void {
    // Reset
    this.showError = false;
    this.showVisualization = false;
    this.fileSelect = {
      file: null
    };

    this.lineSelect = {
      option: false,
      fromLine: null,
      toLine: null 
    }
  }

  // Req: fileListData must be sorted alphabetically by path
  parseFileListData(fileListData) {
      var fileList = fileListData.tree;
      var fileTree = [];
      var mostRecentFolderPath = "";
      var mostRecentFolder = fileTree;

      var secondMostRecentFolderPath = [];
      var secondMostRecentFolder = [];

      for(var i = 0; i < fileList.length; i++) {
          var fileInformation = fileList[i];
          var fileInformationPath = fileInformation.path.split("/");
          var file = {
              name: fileInformationPath[fileInformationPath.length-1],
              type: fileInformation.type,
              fullName: fileInformation.path
          }
          
          // Add subtree
          if(file.type === "tree") {
              file["children"] = [];
          }

          while(secondMostRecentFolder.length > 0 
                && fileInformation.path.indexOf(mostRecentFolderPath) < 0) {
              mostRecentFolder = secondMostRecentFolder.pop();
              mostRecentFolderPath = secondMostRecentFolderPath.pop();  
          }

          mostRecentFolder.push(file);

          // Update pointers
          if(file.type === "tree") {
              secondMostRecentFolder.push(mostRecentFolder);
              secondMostRecentFolderPath.push(mostRecentFolderPath);
              mostRecentFolder = file["children"];
              mostRecentFolderPath = fileInformation.path;
          }
      }
      return fileTree;
  }

  sortByType(files) :any[] {
    var sortedFiles = [];
    for(var i = 0; i < files.length; i++) {
      if(files[i].type === "tree") {
        sortedFiles.push(files[i]);
      }
    }

    for(var i = 0; i < files.length; i++) {
      if(files[i].type === "blob") {
        sortedFiles.push(files[i]);
      }
    }
    return sortedFiles;
  }

  selectFileChange(fileChanges) {
    this.selectedFileChanges = fileChanges;
    this.filePatch = this.selectedFileChanges.file.patch;
  }
}