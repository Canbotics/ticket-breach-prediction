export class Template {
    static get(id) {
        return document.getElementById(id).content.firstElementChild;
    }

    static clone(element) {
        return element.cloneNode(true);
    }
}