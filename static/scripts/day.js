import { Template } from './template.js';

import { Analyst } from './analyst.js';
import { Ticket } from './ticket.js';

export class Day {
    static templateTableRow;

    constructor(newTickets, id) {
        this.id = id;

        this.newTickets = Ticket.createTickets(this, newTickets);
        this.totalTickets = this.newTickets;
        this.carriedTickets;

        this.solvedTickets = [];
    }

    static init(days) {
        const newDays = [];

        days.forEach((day, index) => {
            newDays.push(new Day(day, index));
        });

        this.templateTableRow = Template.get('day-table-row');

        return newDays;
    }

    static buildRows(days, tableBody) {
        days.forEach((day) => day.buildRow(tableBody));
    }

    solveTickets(analysts, nextDay) {
        const carriedTickets = [...this.totalTickets];

        analysts.forEach((analyst) => {
            const limit = carriedTickets.length - analyst.ticketsPerDay;

            while (carriedTickets.length && carriedTickets.length > limit) {
                const ticket = carriedTickets.shift();

                ticket.solve(this);

                this.solvedTickets.push(ticket);
            } ;
        });

        if (carriedTickets.length && nextDay) {
            nextDay.carryTickets(carriedTickets);
        }

        this.carriedTickets = carriedTickets;

        return this.newTickets;
    }

    carryTickets(tickets) {
        this.totalTickets = [...tickets, ...this.totalTickets];
    }

    getWeekDay() {
        const days = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
        ];

        return `${days[this.id % days.length]} (${parseInt(this.id / 5 + 1)})`;
    }

    buildRow(tableBody) {
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
       
        rowID.textContent = this.getWeekDay();
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

        tableBody.append(row);
    }
}