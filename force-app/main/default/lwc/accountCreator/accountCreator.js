import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AccountCreator extends LightningElement {
    @api fields;

    handleBack() {
        this.dispatchEvent(new CustomEvent('back'));
    }

    handleSuccess() {
        const showSuccess = new ShowToastEvent({
            title: 'Success!',
            message: 'Account successfully created!',
            variant: 'success'
        });
        this.dispatchEvent(showSuccess);
    }
}