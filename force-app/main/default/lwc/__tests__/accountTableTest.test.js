import { createElement } from 'lwc';
import AccountTable from 'c/accountTable';

describe('c-accountTable', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('pagination', () => {
        const element = createElement('c-accountTable', {
            is: AccountTable
        });
        document.body.appendChild(element);
        const handlerFirst = jest.fn();
        const handlerPrevious = jest.fn();
        const handlerNext = jest.fn();
        const handlerLast = jest.fn();
        const handlerNewRecord = jest.fn();
        element.addEventListener('first', handlerFirst);
        element.addEventListener('previous', handlerPrevious);
        element.addEventListener('next', handlerNext);
        element.addEventListener('last', handlerLast);
        element.addEventListener('new', handlerNewRecord);

        const lhtgBtn = element.shadowRoot.querySelectorAll('lightning-button');
        lhtgBtn.forEach(btn => {
            btn.click();
        });

        return Promise.resolve().then(() => {
            /*const dataTable = element.shadowRoot.querySelector('lightning-datatable');
            dataTable.dispatchEvent(new CustomEvent('rowaction'));*/

            expect(handlerFirst.mock.calls.length).toBe(1);
            expect(handlerPrevious.mock.calls.length).toBe(1);
            expect(handlerNext.mock.calls.length).toBe(1);
            expect(handlerLast.mock.calls.length).toBe(1);
            expect(handlerNewRecord.mock.calls.length).toBe(1);
        });

    });
});