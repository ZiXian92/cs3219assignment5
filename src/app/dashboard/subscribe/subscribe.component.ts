import { Component } from '@angular/core';

@Component({
    selector: 'subscribe',
    templateUrl: 'subscribe.component.html'
})
export class SubscribeComponent{
	constructor(
   	) {}

    private emails = [""];

    private showError = false;

    trackByIndex(index, email) {
        console.log(email);
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
            console.log("Subscribing...");
            this.resetForm();
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