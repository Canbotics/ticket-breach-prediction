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

        this.analysts = Analyst.init(data.analysts);
        this.days = Day.init(data.days, this.panel);
        this.tickets = [];

        this.days.forEach((day, index) => {
            const nextDay = this.days[index + 1];
            
            this.tickets.push(...day.solveTickets(this.analysts, nextDay));
        });

        Day.buildRows(this.days, this.dayTableBody);
        Ticket.buildRows(this.tickets, this.ticketTableBody);
    }

    static init() {
        this.tabList = document.getElementById('projection-switcher');
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
}