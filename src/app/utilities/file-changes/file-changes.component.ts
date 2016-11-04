import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'file-changes',
    templateUrl: 'file-changes.component.html'
})
export class FileChangesComponent implements OnChanges {
	constructor(
   	) {}

    @Input() fileChanges: string;

    private lines = [];
    private  showError;

    ngOnChanges(changes) :void {
        let fileChanges = changes.fileChanges.currentValue;
        if(fileChanges) {
            this.showError = false;
            this.lines = this.parseFileChanges(fileChanges);
        } else {
            this.showError = true;
        }
    }

    parseFileChanges(fileChanges) :any {
        var splitRegex = /\s/
        var lines = fileChanges.split('\n');
        var segmentMetaDataRegex = /@@.+@@/;
        var metadata;
        var formattedLines = [];
        var type;
        for(var i = 0; i < lines.length; i++) {
            var match = lines[i].match(segmentMetaDataRegex); 
            if(match) {
                var metadataLine = match[0]; 
                metadata = this.getMetadata(lines[i]);
                type = 'metadata';
                formattedLines.push(this.formatLine(metadata, type, metadataLine));
                // No new line to break next line from metadata
                if(lines[i].length > metadataLine.length) {
                    var unterminatedLine = lines[i].substring(metadataLine.length);
                    console.log(unterminatedLine);
                    type = 'line';
                    formattedLines.push(this.formatLine(metadata, type, unterminatedLine));        
                }

            } else {
                type = 'line';
                formattedLines.push(this.formatLine(metadata, type, lines[i]));
            }

        }
        return formattedLines;
    }

    getMetadata(metadata) :any {
        var oldIndex, newIndex;
        var oldIndexRegex = /-[0-9]+/;
        var newIndexRegex = /\+[0-9]+/;
        oldIndex = metadata.match(oldIndexRegex)[0].substring(1);
        newIndex = metadata.match(newIndexRegex)[0].substring(1);
        return {
            oldIndex: parseInt(oldIndex),
            newIndex: parseInt(newIndex)
        }
    }

    formatLine(metadata, type, line) :any {
        var formattedLine = {
            type: type,
            line: line,
            lineType: null,
            oldIndex: null,
            newIndex: null
        };
        
        if(type === 'line') {
            var lineIndentifier = line.substring(0,1); 
            if(lineIndentifier === '-') {
                formattedLine.lineType = 'old';
                formattedLine.oldIndex = metadata.oldIndex;
                metadata.oldIndex += 1;
            } else if(lineIndentifier === '+') {
                formattedLine.lineType = 'new';
                formattedLine.newIndex = metadata.newIndex;
                metadata.newIndex += 1;
            } else {
                formattedLine.lineType = 'current';
                formattedLine.oldIndex = metadata.oldIndex;
                formattedLine.newIndex = metadata.newIndex;
                metadata.oldIndex += 1;
                metadata.newIndex += 1;
            }
        }
        return formattedLine;
    }
}