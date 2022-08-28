export class Tabnav {
    constructor(element) {
        this.element = element;
        this.tabs = [];

        const tabs = this.element.querySelectorAll('[role="tab"]');
        
        tabs.forEach((tab) => {
            const newTab = new Tab(tab, this);

            this.tabs.push(newTab);
        });

        this.activeTab = this.tabs[0];
    }

    static init() {
        const tabNavs = document.querySelectorAll('.tabnav.comp');

        tabNavs.forEach((tabnav) => new Tabnav(tabnav, this));
    }
}

class Tab {
    constructor(element, tablist) {
        this.element = element;
        this.tablist = tablist;

        this.panel = document.getElementById(this.element.getAttribute('aria-controls'));

        this.isOpen = this.panel.hasAttribute('hidden');

        this.element.addEventListener(('click'), (event) => {
            this.tablist.activeTab.close();
            this.open();
            this.tablist.activeTab = this;
        })
    }

    open() {
        this.isOpen = true;
        this.element.setAttribute('aria-selected', true);
        this.panel.removeAttribute('hidden');
    }

    close() {
        this.isOpen = false;
        this.element.setAttribute('aria-selected', false);
        this.panel.setAttribute('hidden','')
    }
}