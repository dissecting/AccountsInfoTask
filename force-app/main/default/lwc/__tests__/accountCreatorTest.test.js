import { createElement } from 'lwc';
import AccountCreator from 'c/accountCreator';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';

const mockCreateRecord = require('./data/createRecord.json');

describe('c-accountCreator', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }

        jest.clearAllMocks();
    });
    it('displays creator form', () => {
        createRecord.mockResolvedValue(mockCreateRecord);
        const element = createElement('c-accountCreator', {
            is: AccountCreator
        });
        document.body.appendChild(element);
        const mockFn = jest.fn();
        element.addEventListener(ShowToastEventName, mockFn);
        const recordForm = element.shadowRoot.querySelector('lightning-record-form');
        recordForm.dispatchEvent(new CustomEvent('success'));
        const handlerBack = jest.fn();
        element.addEventListener('back', handlerBack);
        const lhtgBtn = element.shadowRoot.querySelector('lightning-button');
        lhtgBtn.click();
        return Promise.resolve().then(() => {
            expect(mockFn.mock.calls[0][0].detail.title).toBe('Success!');
            expect(mockFn.mock.calls[0][0].detail.message).toBe('Account successfully created!');
            expect(mockFn.mock.calls[0][0].detail.variant).toBe('Success');
            expect(handlerBack.mock.calls.length).toBe(1);
        });

    });
});