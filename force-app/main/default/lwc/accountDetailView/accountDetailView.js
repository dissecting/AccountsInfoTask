import { LightningElement, api } from 'lwc';

export default class AccountDetailView extends LightningElement {
    @api recordId;

    handleBack() {
        this.dispatchEvent(new CustomEvent('back'));
    }
}