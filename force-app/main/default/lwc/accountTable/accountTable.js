import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';

export default class AccountTable extends LightningElement {
    @api accounts;
    @api columns;
    @api isFirstPage;
    @api isLastPage;
    @api page;
    @api totalPages;
    @api draftValues = [];

    handleNewRecord() {
        this.dispatchEvent(new CustomEvent('new'));
    }

    getRecordId(event) {
        this.dispatchEvent(new CustomEvent('rowid', { detail: event.detail.row.Id }));
    }

    handlePrevious() {
        this.dispatchEvent(new CustomEvent('previous'));
    }

    handleSave(event) {
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account successfully updated',
                    variant: 'success'
                })
            );

            this.draftValues = [];
            this.dispatchEvent(new CustomEvent('refreshtable'));
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

    handleNext() {
        this.dispatchEvent(new CustomEvent('next'));
    }

    handleFirst() {
        this.dispatchEvent(new CustomEvent('first'));
    }

    handleLast() {
        this.dispatchEvent(new CustomEvent('last'));
    }
}