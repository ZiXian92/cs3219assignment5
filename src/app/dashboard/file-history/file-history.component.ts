import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'file-history',
    templateUrl: 'file-history.component.html'
})
export class FileHistoryComponent implements OnInit {
	constructor() {}

  private fileTree;
  private fileSelect;
  private lineSelect;
  private showVisualization;
  private showError;

  ngOnInit() :void {

    this.fileTree = this.parseFileListData(this.fileListData);

    this.fileSelect = {
      file: null
    };

    this.lineSelect = {
      option: false,
      fromLine: null,
      toLine: null 
    }

    this.showVisualization = false;

    this.showError = false;
  }


  showFileHistory() {
    if(!this.fileSelect.file) {
      this.showError = true;
    } else if(!this.validLineSelect(this.lineSelect)) {
      this.showError = true;
    } else {
      this.showVisualization = true;
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
  private parseFileListData(fileListData) {
      var fileList = fileListData.tree;
      var fileTree = [];
      var mostRecentFolderPath = "";
      var mostRecentFolder = fileTree;

      var secondMostRecentFolderPath = "";
      var secondMostRecentFolder = null;

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

          if(fileInformation.path.indexOf(mostRecentFolderPath) < 0) {
              // File is not in folder we backtrack
              mostRecentFolder = secondMostRecentFolder;
              mostRecentFolderPath = secondMostRecentFolderPath;
          }
          
          mostRecentFolder.push(file);

          // Update pointers
          if(file.type === "tree") {
              secondMostRecentFolder = mostRecentFolder;
              secondMostRecentFolderPath = mostRecentFolderPath;
              mostRecentFolder = file["children"];
              mostRecentFolderPath = fileInformation.path;
          }
      }
      return fileTree;
  }

  // Dummy data

  private fileListData = {
    "sha": "fde0abaaebce55fda491b99c889c6c1199f16ea7",
    "url": "https://api.github.com/repos/kylelwm/ryanion/git/trees/fde0abaaebce55fda491b99c889c6c1199f16ea7",
    "tree": [
      {
        "path": ".gitignore",
        "mode": "100644",
        "type": "blob",
        "sha": "228957c0752f644950e83510b282e2e2987e9810",
        "size": 10,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/228957c0752f644950e83510b282e2e2987e9810"
      },
      {
        "path": "dev",
        "mode": "040000",
        "type": "tree",
        "sha": "8d18ae8b4e901d57020a15b46d63a6ecc324fa1c",
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/trees/8d18ae8b4e901d57020a15b46d63a6ecc324fa1c"
      },
      {
        "path": "dev/.gitignore",
        "mode": "100644",
        "type": "blob",
        "sha": "da6ea8cdcafd6be7149ba3e32aa7540bc979d824",
        "size": 19,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/da6ea8cdcafd6be7149ba3e32aa7540bc979d824"
      },
      {
        "path": "dev/app.js",
        "mode": "100644",
        "type": "blob",
        "sha": "b6a5d383f6a568ac1296ee516c53810be2ec1a84",
        "size": 1477,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/b6a5d383f6a568ac1296ee516c53810be2ec1a84"
      },
      {
        "path": "dev/bin",
        "mode": "040000",
        "type": "tree",
        "sha": "101e428351e3e6c5be37e79164d7a22c6b4ffd8b",
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/trees/101e428351e3e6c5be37e79164d7a22c6b4ffd8b"
      },
      {
        "path": "dev/bin/www",
        "mode": "100644",
        "type": "blob",
        "sha": "a1002dda4e13450f05bb2eeddc0da5e17518f269",
        "size": 1591,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/a1002dda4e13450f05bb2eeddc0da5e17518f269"
      },
      {
        "path": "dev/krystal",
        "mode": "040000",
        "type": "tree",
        "sha": "7776ed7dfd4f977612ef59f752c6866b65e1bdcd",
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/trees/7776ed7dfd4f977612ef59f752c6866b65e1bdcd"
      },
      {
        "path": "dev/krystal/bot.js",
        "mode": "100644",
        "type": "blob",
        "sha": "e90189db69efed028f9fc31c355167966731caef",
        "size": 5459,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/e90189db69efed028f9fc31c355167966731caef"
      },
      {
        "path": "dev/krystal/constant.js",
        "mode": "100644",
        "type": "blob",
        "sha": "278e36369f7126d264ef36924bbc2d4ee7ab8810",
        "size": 336,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/278e36369f7126d264ef36924bbc2d4ee7ab8810"
      },
      {
        "path": "dev/krystal/database.js",
        "mode": "100644",
        "type": "blob",
        "sha": "7aa70d80fbbac0388a0e360df6efb01e792b6b0b",
        "size": 2823,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/7aa70d80fbbac0388a0e360df6efb01e792b6b0b"
      },
      {
        "path": "dev/krystal/response.js",
        "mode": "100644",
        "type": "blob",
        "sha": "72dfce2ee899bd50e76fb460ce03e1f7488b07bf",
        "size": 637,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/72dfce2ee899bd50e76fb460ce03e1f7488b07bf"
      },
      {
        "path": "dev/krystal/ryanion.js",
        "mode": "100644",
        "type": "blob",
        "sha": "60f3f591a636ca2a4ff7c8a603092b473d80cbce",
        "size": 2383,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/60f3f591a636ca2a4ff7c8a603092b473d80cbce"
      },
      {
        "path": "dev/krystal/scheduler.js",
        "mode": "100644",
        "type": "blob",
        "sha": "a0d62e645566e4b6bc0f4560e62997a5ea7d7cfe",
        "size": 1143,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/a0d62e645566e4b6bc0f4560e62997a5ea7d7cfe"
      },
      {
        "path": "dev/package.json",
        "mode": "100644",
        "type": "blob",
        "sha": "79cfdb2fedb41f2e38e58457cd0a8cd533cdd333",
        "size": 460,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/79cfdb2fedb41f2e38e58457cd0a8cd533cdd333"
      },
      {
        "path": "dev/public",
        "mode": "040000",
        "type": "tree",
        "sha": "1d777bd2c52bac417e406e0d46a15b4ef5fe967f",
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/trees/1d777bd2c52bac417e406e0d46a15b4ef5fe967f"
      },
      {
        "path": "dev/public/stylesheets",
        "mode": "040000",
        "type": "tree",
        "sha": "31e604c2c6764e6f0f1d5597ed83345a81dbab12",
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/trees/31e604c2c6764e6f0f1d5597ed83345a81dbab12"
      },
      {
        "path": "dev/public/stylesheets/style.css",
        "mode": "100644",
        "type": "blob",
        "sha": "9453385b9916ce9bc5e88d2f5d8cd8a554223590",
        "size": 111,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/9453385b9916ce9bc5e88d2f5d8cd8a554223590"
      },
      {
        "path": "dev/routes",
        "mode": "040000",
        "type": "tree",
        "sha": "7030e68c888e667764899b079bbad8cd4c309282",
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/trees/7030e68c888e667764899b079bbad8cd4c309282"
      },
      {
        "path": "dev/routes/index.js",
        "mode": "100644",
        "type": "blob",
        "sha": "ae121cbadff28722b4d8f4adf27df51c41493451",
        "size": 203,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/ae121cbadff28722b4d8f4adf27df51c41493451"
      },
      {
        "path": "dev/routes/users.js",
        "mode": "100644",
        "type": "blob",
        "sha": "623e4302bee32ccc080d1c83ee2e55a426c9bac8",
        "size": 203,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/623e4302bee32ccc080d1c83ee2e55a426c9bac8"
      },
      {
        "path": "dev/views",
        "mode": "040000",
        "type": "tree",
        "sha": "83380816fba176d6f12f320d1403f6656a32b6e2",
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/trees/83380816fba176d6f12f320d1403f6656a32b6e2"
      },
      {
        "path": "dev/views/error.jade",
        "mode": "100644",
        "type": "blob",
        "sha": "51ec12c6a26323d9f5bc51fb98cb1324a739ea4c",
        "size": 84,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/51ec12c6a26323d9f5bc51fb98cb1324a739ea4c"
      },
      {
        "path": "dev/views/index.jade",
        "mode": "100644",
        "type": "blob",
        "sha": "3d63b9a044a859b59259d5e23dd4e68ec8e1f2be",
        "size": 66,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/3d63b9a044a859b59259d5e23dd4e68ec8e1f2be"
      },
      {
        "path": "dev/views/layout.jade",
        "mode": "100644",
        "type": "blob",
        "sha": "15af079bf7c34e638ba14844efd979ac9111628b",
        "size": 125,
        "url": "https://api.github.com/repos/kylelwm/ryanion/git/blobs/15af079bf7c34e638ba14844efd979ac9111628b"
      }
    ],
    "truncated": false
  }

  private patch = "@@ -86,6 +86,7 @@\n                             'Trial End Time', 'Trial Time', 'Accuracy', 'Throughput'];\n             var trialData = [];\n             var pid;\n+            var breakGiven = false;\n \n             function next () {\n                 if (currentTrial !== 0) {\n@@ -113,8 +114,10 @@\n                 }\n \n                 // BREAK TIME\n-                if(currentTrial === 36) {\n-                    $(\"body\").append(\"<div id='break-notification' class='text-center'><div id='break-panel' class='panel panel-default'><div class='panel-body'><h2>Please take a rest!</h2><button id='continue-button' class='btn btn-primary btn-lg' onclick='hideRest()'>Continue</button></div></div></div>\");\n+                if(currentTrial === 36 && !breakGiven) {\n+                    $(\"body\").append(\"<div id='break-notification' class='text-center'><div id='break-panel' class='panel panel-default'><div class='panel-body'><h2>Please take a 5 minutes break!</h2><button id='continue-button' class='btn btn-primary btn-lg' onclick='continueExperiment()'>Continue</button></div></div></div>\");\n+                    breakGiven = true;\n+                    return;\n                 }\n \n                 if (currentTrial < totalNumberOfTrials) {\n@@ -128,8 +131,9 @@\n                 }\n             }\n \n-            function hideRest() {\n+            function continueExperiment() {\n                 $('#break-notification').hide();\n+                next();\n             }\n \n             function buildExperiment(participants, stimuli) {"
}