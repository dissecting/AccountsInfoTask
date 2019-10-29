import { createElement } from 'lwc';
import AccountsInfo from 'c/accountsInfo';
import getAccountList from '@salesforce/apex/AccountsInfoController.getAccountList';

jest.mock(
    '@salesforce/apex/AccountsInfoController.getAccountList',
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

const APEX_ACCOUNTS_SUCCESS  = {
    accountCount: 114,
    accountFields: ["Name", "CreatedDate", "Phone"],
    accountFieldTypes: ["TEXT", "DATETIME", "TEXT"],
    accountColumns: ["Account Name", "Created Date", "Phone"],
    accountUpdateableColumns: ["Name", "Phone"],
    accounts: [{"Name":"Test","CreatedDate":"2019-10-16T15:29:49.000Z","Id":"0016F00003RRsUfQAL"}]
};

const APEX_ACCOUNTS_ERROR = {
    body: { message: 'An internal server error has occurred' },
    ok: false,
    status: 400,
    statusText: 'Bad Request'
};

describe('c-accountsInfo', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise(resolve => setImmediate(resolve));
    }

    it('get results', () => {
        const ACCOUNT = {
            row: [{
                "Id": "0016F00003RRsUfQAL",
                "Name": "Test1"
            }]
        };

        getAccountList.mockResolvedValue(APEX_ACCOUNTS_SUCCESS);

        let element = createElement('c-accountsInfo', {
            is: AccountsInfo
        });
        document.body.appendChild(element);

        return flushPromises().then(() => {
            let accTable = element.shadowRoot.querySelector('c-account-table');
            accTable.dispatchEvent(new CustomEvent('rowid', {detail: ACCOUNT}));
            accTable.dispatchEvent(new CustomEvent('nextpage'));
            accTable.dispatchEvent(new CustomEvent('previouspage'));
            accTable.dispatchEvent(new CustomEvent('lastpage'));
            accTable.dispatchEvent(new CustomEvent('firstpage'));
            accTable.dispatchEvent(new CustomEvent('newrecord'));
            element.handleBack();
            expect(accTable).not.toBeNull();
        });
    });

    it('renders spinner when the Apex method returns an error', () => {

        getAccountList.mockRejectedValue(APEX_ACCOUNTS_ERROR);

        const element = createElement('c-accountsInfo', {
            is: AccountsInfo
        });
        document.body.appendChild(element);

        return flushPromises().then(() => {
            const errorInfinitySpinner = element.shadowRoot.querySelector('div');
            expect(errorInfinitySpinner).not.toBeNull();
        });
    });

});