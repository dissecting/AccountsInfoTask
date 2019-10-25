import { createElement } from 'lwc';
import AccountDetailView from 'c/accountDetailView';

describe('c-accountDetailView', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('displays details', () => {
        let element = createElement('c-accountDetailView', {
            is: AccountDetailView
        });
        document.body.appendChild(element);
        let handlerBack = jest.fn();
        element.addEventListener('back', handlerBack);

        let lhtgBtn = element.shadowRoot.querySelectorAll('lightning-button');
        lhtgBtn.forEach(btn => {
            btn.click();
        });

        return Promise.resolve().then(() => {
            expect(handlerBack.mock.calls.length).toBe(1);
        });

    });
});