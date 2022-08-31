export class Disclaimer {
    constructor(element) {
        this.element = element;
        this.id = this.element.id;
        this.button = this.element.querySelector(`#${this.id}-button`);
        this.buttonLabel = this.button.querySelector('span');
        this.isOpen = this.button.getAttribute('aria-expanded') === 'true';

        this.button.addEventListener('click', (event) => this.toggle());
    }

    static init() {
        const disclaimers = document.querySelectorAll('.disclaimer.comp');

        disclaimers.forEach((disclaimer) => new Disclaimer(disclaimer));
    }

    toggle() {
        this.isOpen = !this.isOpen;

        this.button.setAttribute('aria-expanded', this.isOpen);
        this.buttonLabel.textContent = this.button.dataset[this.isOpen];
    }
}