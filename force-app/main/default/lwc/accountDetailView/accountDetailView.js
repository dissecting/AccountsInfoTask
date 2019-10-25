import { LightningElement, api } from 'lwc';

export default class AccountDetailView extends LightningElement {
    @api recordId;
    @api fields;
    @api updateableFields;
    isViewForm = true;

    handleBack() {
        this.dispatchEvent(new CustomEvent('back'));
    }

    handleChangePageMode() {
        this.isViewForm = !this.isViewForm;
    }
}