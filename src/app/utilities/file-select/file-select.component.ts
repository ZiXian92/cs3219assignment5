import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'file-select',
  templateUrl: 'file-select.component.html'
})

export class FileSelectComponent implements OnChanges {
  constructor() {}

  @Input() fileTree: any[];

  @Input() fileSelect: any;

  private currentFileList = [];
  private previousFileLists = [];

  private currentFilePath = "/";
  private previousFilePaths = [];

  ngOnChanges(changes) :void {
    this.currentFileList = changes.fileTree.currentValue;
  }

  selectFile(file) :void {
    if(file.type === "tree") {
      this.previousFileLists.push(this.currentFileList);
      this.previousFilePaths.push(this.currentFilePath);
      this.currentFileList = this.sortByType(file.children);
      this.currentFilePath += file.name + "/"
    } else {
      this.fileSelect.file = file;
    }
  }

  backTrack() :void {
    if(this.previousFileLists.length > 0) {
      this.currentFileList = this.previousFileLists.pop();
      this.currentFilePath = this.previousFilePaths.pop();
      this.fileSelect.file = null;
    }
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
}