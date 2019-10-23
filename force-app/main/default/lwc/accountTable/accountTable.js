import { LightningElement, api } from 'lwc';

export default class AccountTable extends LightningElement {
    @api accounts;
    @api columns;
    @api isFirstPage;
    @api isLastPage;
    @api page;
    @api totalPages;

    handleNewRecord() {
        this.dispatchEvent(new CustomEvent('new'));
    }

    getRecordId(event) {
        this.dispatchEvent(new CustomEvent('rowid', { detail: event.detail.row.Id }));
    }

    handlePrevious() {
        this.dispatchEvent(new CustomEvent('previous'));
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