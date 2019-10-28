import { LightningElement, track, api } from 'lwc';
import getAccountList from '@salesforce/apex/AccountsInfoController.getAccountList';

const PAGE_SIZE = 10;

export default class AccountsInfo extends LightningElement {
    @track results;
    @track error;
    @track columns = [];
    @track recordId;
    @track pageType;
    @api isLoaded = false;
    @api page = 1;
    totalPages;
    isFirstPage = true;
    isLastPage = this.totalPages === 1 ? true : false;

    get isTablePage() {
        return this.pageType === "tablePage" ? true : false;
    }

    get isViewPage() {
        return this.pageType === "viewPage" ? true : false;
    }

    get isCreateRecordPage() {
        return this.pageType === "createRecordPage" ? true : false;
    }

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

    handleGetAccounts() {
        this.handleLoadStart();
        getAccountList({ pageSize: PAGE_SIZE, pageNumber: this.page })
            .then(result => {
                this.setAccounts(result);
                this.pageType = "tablePage";
                this.handleLoadFinish();
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
            let isUpdatableField;
            isUpdatableField = this.results.accountUpdateableColumns.includes(this.results.accountFields[i]) ?
                true : false;
            if (this.results.accountFields[i] === 'Name') {
                this.columns.push({
                    label: this.results.accountColumns[i],
                    fieldName: this.results.accountFields[i],
                    editable: isUpdatableField,
                    type: 'button',
                    typeAttributes: {label: { fieldName: 'Name' }, variant: 'base'}
                });
            } else if (this.results.accountFieldTypes[i] === 'DATETIME') {
                this.columns.push({
                    label: this.results.accountColumns[i],
                    fieldName: this.results.accountFields[i],
                    editable: isUpdatableField,
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
                    label: this.results.accountColumns[i],
                    type: this.results.accountFieldTypes[i].toLowerCase(),
                    editable: isUpdatableField,
                    fieldName: this.results.accountFields[i]
                });
            }
        }
    }

    getRecordId(event) {
        this.recordId = event.detail;
        this.pageType = "viewPage";
    }

    @api
    handleBack() {
        this.columns = [];
        this.connectedCallback();
    }

    handleNewRecord() {
        this.pageType = "createRecordPage";
    }

    handleLoadFinish() {
        this.isLoaded = true;
    }

    handleLoadStart() {
        this.isLoaded = false;
    }

    handlePageNumberCheck() {
        this.isFirstPage = this.page === 1 ? true : false;
        this.isLastPage = this.page === this.totalPages ? true : false;
    }
}