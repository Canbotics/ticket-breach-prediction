import { Template } from './template.js';

import { Analyst } from './analyst.js';
import { Ticket } from './ticket.js';

export class Day {
    static all = [];

    static tableBody;
    static templateTableRow;

    constructor(details) {
        this.id = Day.all.length;

        this.newTickets = Ticket.createTickets(this, details.newTickets);
        this.totalTickets = this.newTickets;
        this.carriedTickets;

        this.solvedTickets = [];
    }

    static init() {
        const days = [
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
            {
                newTickets: 15,
            },
        ];

        this.tableBody = document.getElementById('day-table');
        this.templateTableRow = Template.get('day-table-row');

        days.forEach((day) => this.all.push(new Day(day)));

        this.all.forEach((day) => day.solveTickets());

        this.buildRows();
        Ticket.buildRows();
    }

    static buildRows() {
        this.all.forEach((day) => day.buildRow());
    }

    solveTickets() {
        const carriedTickets = [...this.totalTickets];

        Analyst.all.forEach((analyst, index) => {
            const limit = carriedTickets.length - analyst.ticketsPerDay;

            while (carriedTickets.length && carriedTickets.length > limit) {
                const ticket = carriedTickets.shift();

                ticket.solve(this);

                this.solvedTickets.push(ticket);
            } ;
        });

        if (carriedTickets.length) {
            const nextDay = Day.all[this.id + 1];

            if (nextDay) {
                nextDay.carryTickets(carriedTickets);
            }
        }

        this.carriedTickets = carriedTickets;
    }

    carryTickets(tickets) {
        this.totalTickets = [...tickets, ...this.totalTickets];
    }

    buildRow() {
        const row = Template.clone(Day.templateTableRow);

        const rowID = row.querySelector('.id');
        const rowNew = row.querySelector('.new');
        const rowTotal = row.querySelector('.total');
        const rowSolved = row.querySelector('.solved');
        const rowCarried = row.querySelector('.carried');

        const row24 = row.querySelector('.hours-24');
        const row48 = row.querySelector('.hours-48');
        const row72 = row.querySelector('.hours-72');
        const rowOver = row.querySelector('.hours-over');

        const days24 = this.newTickets.filter((ticket) => ticket.daysToSolve === 1).length;
        const days48 = this.newTickets.filter((ticket) => ticket.daysToSolve === 2).length;
        const days72 = this.newTickets.filter((ticket) => ticket.daysToSolve === 3).length;
        const daysOver = this.newTickets.filter((ticket) => ticket.daysToSolve > 3 || !ticket.isSolved).length;

        rowID.textContent = this.id;
        rowNew.textContent = this.newTickets.length;
        rowTotal.textContent = this.totalTickets.length;
        rowSolved.textContent = this.solvedTickets.length;
        rowCarried.textContent = this.carriedTickets.length;

        row24.textContent = days24;
        row48.textContent = days48;
        row72.textContent = days72;
        rowOver.textContent = daysOver;

        if (!days24) {
            row24.classList.add('zero');
        }

        if (!days48) {
            row48.classList.add('zero');
        }

        if (!days72) {
            row72.classList.add('zero');
        }

        if (!daysOver) {
            rowOver.classList.add('zero');
        }

        Day.tableBody.append(row)
    }
}