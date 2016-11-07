import { Component } from '@angular/core';

import { GithubService } from '../../services/github.service';

@Component({
    selector: 'subscribe',
    templateUrl: 'subscribe.component.html'
})
export class SubscribeComponent{
	constructor(
        private githubService: GithubService
   	) {}

    private emails = [""];

    private showError = false;
    private showSuccess = false;

    trackByIndex(index, email) {
        return index;
    }

    addField() :void {
        this.emails.push("");
    }

    removeField(email) :void {
        this.emails.splice(this.emails.length-1,1);
    }

    subscribe() :void {
        if(this.validEmails(this.emails)) {
            var apiString = this.githubService.buildApiString('subscribe', {});
            var body = {
                email: this.emails
            }
            console.log(body);
            this.githubService.post(apiString, body)
            .subscribe(function(response) {
                this.showSuccess = true;
                this.resetForm();
            });
        } else {
            this.showError = true;
        }
    }

    private validEmails(emails) :boolean {
        var emailRegex = /.+@.+\.+./;
        for(var i = 0; i < this.emails.length; i++) {
            var email = this.emails[i];
            if(!email.match(emailRegex)) {
                return false;
            }
        }
        return true;
    }

    private resetForm() :void {
        this.emails = [""];
        this.showError = false;
    }
 }