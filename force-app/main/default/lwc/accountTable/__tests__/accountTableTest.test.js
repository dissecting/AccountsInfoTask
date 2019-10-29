import { createElement } from 'lwc';
import AccountTable from 'c/accountTable';

describe('c-accountTable', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('pagination', () => {
        const ACCOUNT = {
            row: [{
                "Id": "0016F00003RRsUfQAL",
                "Name": "Test1"
            }]
        };

        const newAccount = {
            draftValues: [{
                Id: "0016F00003RRsUfQAL",
                Name: "Test2"
            }]
        };

        let element = createElement('c-accountTable', {
            is: AccountTable
        });
        document.body.appendChild(element);
        let handlerFirst = jest.fn();
        let handlerPrevious = jest.fn();
        let handlerNext = jest.fn();
        let handlerLast = jest.fn();
        let handlerNewRecord = jest.fn();
        let handlerGetRecordId = jest.fn();

        element.addEventListener('rowid', handlerGetRecordId);
        element.addEventListener('firstpage', handlerFirst);
        element.addEventListener('previouspage', handlerPrevious);
        element.addEventListener('nextpage', handlerNext);
        element.addEventListener('lastpage', handlerLast);
        element.addEventListener('newrecord', handlerNewRecord);

        let lhtgBtn = element.shadowRoot.querySelectorAll('lightning-button');
        lhtgBtn.forEach(btn => {
            btn.click();
        });

        let lhtgDataTable = element.shadowRoot.querySelector('lightning-datatable');
        lhtgDataTable.dispatchEvent(new CustomEvent('rowaction', {detail: ACCOUNT}));
        lhtgDataTable.dispatchEvent(new CustomEvent('save', {detail: newAccount}));

        return Promise.resolve().then(() => {
            expect(handlerGetRecordId.mock.calls.length).toBe(1);
            expect(handlerFirst.mock.calls.length).toBe(1);
            expect(handlerPrevious.mock.calls.length).toBe(1);
            expect(handlerNext.mock.calls.length).toBe(1);
            expect(handlerLast.mock.calls.length).toBe(1);
            expect(handlerNewRecord.mock.calls.length).toBe(1);
        });

    });
});