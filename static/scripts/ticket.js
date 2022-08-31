import { Template } from './template.js';

export class Ticket {
    static all = [];

    static templateTableRow;

    constructor(dayMade) {
        this.id = Ticket.all.length;
        this.dayMade = dayMade;

        this.isSolved = false;

        this.daySolved;
        this.daysToSolve;

        this.analystSolved;
    }

    static createTickets(dayMade, count) {
        const newTickets = [];

        this.templateTableRow = Template.get('ticket-table-row');

        for(let i = 0; i < count; i++) {
            const ticket = new Ticket(dayMade);

            this.all.push(ticket);
            newTickets.push(ticket);
        }

        return newTickets;
    }

    static buildRows(tickets, tableBody) {
        tickets.forEach((ticket) => ticket.buildRow(tableBody))
    }

    solve(daySolved, analystSolved) {
        this.isSolved = true;
        
        this.daySolved = daySolved;
        this.daysToSolve = daySolved.id - this.dayMade.id + 1;

        this.analystSolved = analystSolved;
    }

    buildRow(tableBody) {
        const row = Template.clone(Ticket.templateTableRow);

        const rowID = row.querySelector('.id');
        const rowDayMade = row.querySelector('.day-made');
        const rowDaySolved = row.querySelector('.day-solved');
        const rowTimeToSolve = row.querySelector('.time-to-solve');
        const rowTimeOver = row.querySelector('.time-over');

        rowID.textContent = this.id;
        rowDayMade.textContent = this.dayMade.id;
        rowDaySolved.textContent = this.daySolved ? this.daySolved.id : '---';
        rowTimeToSolve.textContent = this.daysToSolve ? `${this.daysToSolve * 24} hours` : '---'; 
        rowTimeOver.textContent = this.daysToSolve > 3 ? `${this.daysToSolve * 24 - 72} hours` : '---'; 
        
        tableBody.append(row)
    }
}