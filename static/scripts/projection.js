import { ProjectionSwitcher } from './components/tabnav.js';

import { Template } from './template.js';

import { Analyst } from './analyst.js';
import { Day } from './day.js';
import { Ticket } from './ticket.js';

export class Projection {
    static tabList;
    static content;

    static templateTab;
    static templatePanel;

    constructor(data, index) {
        this.label = data.label;
        this.uri = Projection.createURI(this.label);

        this.buildPanel(index);

        this.analysts = Analyst.populateAnalysts(data.analysts);
        this.days = Day.populateDays(data.days);
        this.tickets = [];

        this.days.forEach((day, index) => {
            const nextDay = this.days[index + 1];
            
            this.tickets.push(...day.solveTickets(this.analysts, nextDay));
        });

        Day.buildRows(this.days, this.dayTableBody);
        Ticket.buildRows(this.tickets, this.ticketTableBody);
    }

    static init() {
        const addProjection = document.getElementById('button-add-projection');

        this.tabList = document.querySelector('#projection-switcher > div');
        this.content = document.getElementById('content');
    
        this.templateTab = Template.get('projection-tab');
        this.templatePanel = Template.get('projection-panel');

        fetch('/data/projections.json')
        .then(response => response.json())
        .then(data => {
            data.projections.forEach((projection, index) => {
                new Projection(projection, index);                
            });

            ProjectionSwitcher.init();
        });

        addProjection.addEventListener('click', (event) => {
            const label = document.getElementById('label-add-projection').value.trim();
            const listAnalysts = document.querySelectorAll('#form-add-analyst li');
            const listDays = document.querySelectorAll('#form-add-day li');
            const downloadButton = document.getElementById('button-download-projection');

            const analysts = [];
            const days = [];

            listAnalysts.forEach((analyst) => {
                const name = analyst.querySelector('.name').value.trim();
                const ticketsPerDay = parseInt(analyst.querySelector('.tickets').value);

                analysts.push({
                    name: name,
                    ticketsPerDay: ticketsPerDay,
                });
            });

            listDays.forEach((day) => {
                const tickets = parseInt(day.querySelector('.tickets').value);

                days.push(tickets);
            });

            const newProjection = new Projection({
                label: label,
                analysts: analysts,
                days: days,
            }, 5);

            newProjection.panel.removeAttribute('hidden');

            downloadButton.addEventListener('click', (event) => {
                newProjection.export();
            });

        })
    }

    static createURI(label) {
        let uri = label.toLowerCase();

        uri = uri.replace(/\s+/g, "-");
        uri = uri.replace(/[^a-z\d-]/g, "");

        return uri;
    }

    buildPanel(index) {
        this.tab = Template.clone(Projection.templateTab);
        this.panel = Template.clone(Projection.templatePanel);

        this.dayTableBody = this.panel.querySelector('.day-table-body');
        this.ticketTableBody = this.panel.querySelector('.ticket-table-body');

        this.tab.id = `tab-${this.uri}`;
        this.tab.textContent = this.label;
        this.tab.setAttribute('aria-controls', `panel-${this.uri}`);

        this.panel.id = `panel-${this.uri}`;
        this.panel.ariaLabelledby = `tab-${this.uri}`;

        if (!index) {
            this.tab.setAttribute('aria-selected', true);
        } else {
            this.tab.setAttribute('aria-selected', false);
            this.panel.setAttribute('hidden', '');
        }

        Projection.tabList.append(this.tab);
        Projection.content.append(this.panel);
    }

    export() {
        const analysts = this.analysts.map((analyst) => {
            return {
                name: analyst.name,
                ticketsPerDay: analyst.ticketsPerDay,
            };
        });
        const days = this.days.map((day) => day.newTickets.length);

        const object = {
            label: this.label,
            analysts: analysts,
            days: days,
        };

        const blob = new Blob([JSON.stringify(object)], {type: 'json'});
        const link = document.createElement('a');

        link.href = window.URL.createObjectURL(blob);
        link.download = `projection-${parseInt(Math.random() * 1000)}.json`;
        link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");

        const event = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
        });

        link.dispatchEvent(event);
        link.remove()
        
        return object;
    }
}