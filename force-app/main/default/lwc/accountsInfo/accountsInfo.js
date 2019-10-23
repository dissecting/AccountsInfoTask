import { LightningElement, track, api } from 'lwc';
import getAccountList from '@salesforce/apex/AccountsInfoController.getAccountList';

const PAGE_SIZE = 10;

export default class AccountsInfo extends LightningElement {
    @track results;
    @track error;
    @track columns = [];
    @track fields;
    @track recordId;
    @api isLoaded = false;
    @api page = 1;
    totalPages;
    isFirstPage = true;
    isLastPage = this.totalPages === 1 ? true : false;

    handlePrevious() {
        if (this.page > 1) {
            this.page = this.page - 1;
            this.handleGetAccounts();
        }

        this.handlePageNumberCheck();
    }

    handleNext() {
        if (this.page < this.totalPages) {
            this.page = this.page + 1;
            this.handleGetAccounts();
        }

        this.handlePageNumberCheck();
    }

    handleFirst() {
        if (this.page > 1) {
            this.page = 1;
            this.handleGetAccounts();
        }

        this.handlePageNumberCheck();
    }

    handleLast() {
        if (this.page < this.totalPages) {
            this.page = this.totalPages;
            this.handleGetAccounts();
        }

        this.handlePageNumberCheck();
    }

    connectedCallback() {
        this.handleGetAccounts();
    }

    handleRefresh() {
        this.results = undefined;
        this.columns = [];
    }

    handleGetAccounts() {
        this.isLoaded = false;
        getAccountList({ pageSize: PAGE_SIZE, pageNumber: this.page })
            .then(result => {
                this.setAccounts(result);
                this.isLoaded = true;
            })
            .catch(error => {
                this.error = error;
                this.results = undefined;
            });
    }

    setAccounts(result) {
        this.results = result;
        this.error = undefined;
        this.totalPages = Math.ceil(this.results.accountCount / PAGE_SIZE);

        for (let i = 0; i < this.results.accountFields.length; i++) {
            if (this.results.accountFields[i] === 'Name') {
                this.columns.push({
                    label: this.results.accountFields[i],
                    fieldName: this.results.accountFields[i],
                    type: 'button',
                    typeAttributes: {label: { fieldName: 'Name' }, variant: 'base'}
                });
            } else if (this.results.accountFieldTypes[i] === 'DATETIME') {
                this.columns.push({
                    label: this.results.accountFields[i],
                    fieldName: this.results.accountFields[i],
                    type: 'date',
                    typeAttributes: {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    }
                });
            } else {
                this.columns.push({
                    label: this.results.accountFields[i],
                    fieldName: this.results.accountFields[i]
                });
            }
        }
    }

    getRecordId(event) {
        this.recordId = event.detail;
        this.handleRefresh();
    }

    @api
    handleBack() {
        this.connectedCallback();
        this.recordId = undefined;
        this.fields = undefined;
    }

    handleNewRecord() {
        this.fields = this.results.accountFields;
        this.handleRefresh();
    }

    handlePageNumberCheck() {
        this.isFirstPage = this.page === 1 ? true : false;
        this.isLastPage = this.page === this.totalPages ? true : false;
    }
}