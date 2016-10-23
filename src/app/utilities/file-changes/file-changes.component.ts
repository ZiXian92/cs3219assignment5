import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'file-changes',
    templateUrl: 'file-changes.component.html'
})
export class FileChangesComponent implements OnInit {
	constructor(
   	) {}

    @Input() fileChanges: string;

    private lines = [];

    ngOnInit() :void {
        this.lines = this.parseFileChanges(this.fileChanges);
    }

    parseFileChanges(fileChanges) :any {
        var lines = fileChanges.split('\n');
        var segmentMetaDataRegex = /@@.+@@/;
        var metadata;
        var formattedLines = [];
        var type;
        for(var i = 0; i < lines.length; i++) {
            if(lines[i].match(segmentMetaDataRegex)) {
                metadata = this.getMetadata(lines[i]);
                type = 'metadata';
            } else {
                type = 'line';
            }

            formattedLines.push(this.formatLine(metadata, type, lines[i]));
        }
        console.log(formattedLines);
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