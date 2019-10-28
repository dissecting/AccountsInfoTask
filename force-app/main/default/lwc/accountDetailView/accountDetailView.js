import { LightningElement, api } from 'lwc';

export default class AccountDetailView extends LightningElement {
    @api recordId;
    @api fields;
    @api updateableFields;
    @api isEditForm = false;

    handleBack() {
        this.dispatchEvent(new CustomEvent('back'));
    }

    handleLoadViewForm() {
        this.dispatchEvent(new CustomEvent('loadform'));
    }

    handleChangePageMode() {
        this.dispatchEvent(new CustomEvent('loadformstart'));
        this.isEditForm = !this.isEditForm;
    }

}