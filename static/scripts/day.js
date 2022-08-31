import { Template } from './template.js';

import { Analyst } from './analyst.js';
import { Ticket } from './ticket.js';

export class Day {
    static addDay;
    static templateTableRow;
    static templateAddDay;

    constructor(newTickets, id) {
        this.id = id;

        this.newTickets = Ticket.createTickets(this, newTickets);
        this.totalTickets = this.newTickets;
        this.carriedTickets;

        this.solvedTickets = [];

        this.analystsSolvedTickets = [];
    }

    static init() {
        this.templateTableRow = Template.get('day-table-row');

        this.templateAddDay = Template.get('add-day-li');
        this.addDay = document.getElementById('form-add-day');

        const addButtons = this.addDay.querySelectorAll('.add');

        addButtons.forEach((button) => {
            button.addEventListener('click', (event) => {
                this.formAddDays(button.dataset.static === 'true');
            });
        });
    }

    static populateDays(days) {
        const newDays = [];

        days.forEach((day, index) => {
            newDays.push(new Day(day, index));
        });

        return newDays;
    }

    static buildRows(days, tableBody) {
        days.forEach((day) => day.buildRow(tableBody));
    }

    static formAddAnalyst(count) {
        const analysts = ['Michael','Matthew','Laura','Allison','Sam',];
        const li = Template.clone(this.templateAddAnalyst);
        const name = li.querySelector('.name');

        name.value = analysts[count] || "";

        this.addAnalyst.append(li);
    }

    static formAddDays(staticTicketCount = true) {
        const form = document.getElementById('form-add-day');
        const dayCount = parseInt(form.querySelector('.days').value) || 0;
        const ticketAverage = parseInt(form.querySelector('.tickets').value) || 0;

        const range = Math.ceil(ticketAverage * .15);
        const rangeValues = [];

        if (staticTicketCount) {
            for(let i = 0; i < dayCount; i++) {
                rangeValues.push(0);
            }
        } else {
            for(let i = 0; i < parseInt(dayCount / 2); i++) {
                const flux = Math.ceil(Math.random() * range);

                rangeValues.push(flux);
                rangeValues.push(flux * -1);
            }

            if (rangeValues.length < dayCount) {
                rangeValues.push(0);
            }

            this.shuffleArray(rangeValues);
        }

        rangeValues.forEach((flux, index) => {
            const li = Template.clone(this.templateAddDay);
            const label = li.querySelector('label > span');
            const tickets = li.querySelector('.tickets');

            tickets.value = ticketAverage + flux;

            label.textContent = this.getWeekDay(index);

            this.addDay.append(li);
        });
    }

    static getWeekDay(id) {
        const days = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
        ];

        return `${id} ${days[id % days.length]} (${parseInt(id / 5 + 1)})`;
    }

    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    

    solveTickets(analysts, nextDay) {
        const carriedTickets = [...this.totalTickets];

        analysts.forEach((analyst) => {
            const percentage = analyst.isPercentage ? analyst.ticketsPerDay / 100 : 0;

            let limit = analyst.ticketsPerDay;

            if (percentage) {
                limit = Math.ceil(analyst.isOverflow ? carriedTickets.length * percentage : this.totalTickets.length * percentage);
            }

            let index = 0;
            let ticketsSolved = 0;

            while (carriedTickets.length && index < limit) {
                index += 1;
                
                const ticket = carriedTickets.shift();

                ticket.solve(this, analyst);

                this.solvedTickets.push(ticket);

                ticketsSolved += 1;
            } ;

            this.analystsSolvedTickets.push([analyst.name, ticketsSolved])
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
       
        rowID.textContent = Day.getWeekDay(this.id);
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

        this.analystsSolvedTickets.forEach((analyst) => {
            const td = document.createElement('td');

            td.textContent = analyst[1];
            td.classList.add('text-centre');

            row.append(td);
        })

        tableBody.append(row);
    }
}