import { Component } from './component.js';

import { Template } from './template.js';

import { Analyst } from './analyst.js';
import { Day } from './day.js';
import { Ticket } from './ticket.js';

export class Projection {
    static all = [];

    static tabList;
    static content;

    static templateTab;
    static templatePanel;

    constructor(data, index) {
        this.label = data.label;
        this.uri = Projection.createURI(this.label);

        this.analysts = Analyst.populateAnalysts(data.analysts);
        this.days = Day.populateDays(data.days);
        this.tickets = [];

        this.buildPanel(index);

        this.days.forEach((day, index) => {
            const nextDay = this.days[index + 1];
            
            this.tickets.push(...day.solveTickets(this.analysts, nextDay));
        });

        Analyst.buildRows(this.analysts, this.analystTableBody, this.days);
        Day.buildRows(this.days, this.dayTableBody);
        Ticket.buildRows(this.tickets, this.ticketTableBody);

        Projection.all.push(this);
    }

    static init() {
        const addProjection = document.getElementById('button-add-projection');
        const downloadButton = document.getElementById('button-download-projection');
        const clearButton = document.getElementById('clear-form');

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

            Component.initLate();
        });

        addProjection.addEventListener('click', (event) => {
            const label = document.getElementById('label-add-projection').value.trim();
            const listAnalysts = document.querySelectorAll('#form-add-analyst li');
            const listDays = document.querySelectorAll('#form-add-day li');

            const analysts = [];
            const days = [];

            listAnalysts.forEach((analyst) => {
                const name = analyst.querySelector('.name').value.trim();
                const ticketsPerDay = parseInt(analyst.querySelector('.tickets').value) || 0;
                const isPercentage = analyst.querySelector('.percentage').checked;
                const isOverflow = analyst.querySelector('.overflow').checked;

                analysts.push({
                    name: name,
                    ticketsPerDay: ticketsPerDay,
                    isPercentage: isPercentage,
                    isOverflow: isOverflow,
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
        });

        downloadButton.addEventListener('click', (event) => {
            this.all[this.all.length - 1].export();
        });

        clearButton.addEventListener('click', (event) => {
            const lis = document.querySelectorAll('#panel-add-projection li');
            const analystButton = document.querySelector('#form-add-analyst .add');

            lis.forEach((li) => li.remove());
            analystButton.dataset.count = 0;
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

        this.analystTableBody = this.panel.querySelector('.analyst-table-body');
        this.dayTableHead = this.panel.querySelector('.day-table-head');
        this.dayTableBody = this.panel.querySelector('.day-table-body');
        this.ticketTableBody = this.panel.querySelector('.ticket-table-body');

        this.tab.id = `tab-${this.uri}`;
        this.tab.textContent = this.label;
        this.tab.setAttribute('aria-controls', `panel-${this.uri}`);

        this.panel.id = `panel-${this.uri}`;
        this.panel.ariaLabelledby = `tab-${this.uri}`;

        const panelHeading = this.panel.querySelector('h2');

        panelHeading.textContent = this.label;

        if (!index) {
            this.tab.setAttribute('aria-selected', true);
        } else {
            this.tab.setAttribute('aria-selected', false);
            this.panel.setAttribute('hidden', '');
        }

        this.analysts.forEach((analyst) => {
            const th = document.createElement('th');

            th.textContent = analyst.name;

            this.dayTableHead.append(th);
        })

        Projection.tabList.append(this.tab);
        Projection.content.append(this.panel);
    }

    export() {
        const analysts = this.analysts.map((analyst) => {
            return {
                name: analyst.name,
                ticketsPerDay: analyst.ticketsPerDay,
                isPercentage: analyst.isPercentage,
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
        link.download = `projection-${this.uri}-${parseInt(Math.random() * 1000)}.json`;
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