import { createElement } from 'lwc';
import AccountDetailView from 'c/accountDetailView';

describe('c-accountDetailView', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays details', () => {
        const element = createElement('c-accountDetailView', {
            is: AccountDetailView
        });
        document.body.appendChild(element);
        const handlerBack = jest.fn();
        element.addEventListener('back', handlerBack);

        const lhtgBtn = element.shadowRoot.querySelector('lightning-button');
        lhtgBtn.click();

        return Promise.resolve().then(() => {
            expect(handlerBack.mock.calls.length).toBe(1);
        });

    });
});