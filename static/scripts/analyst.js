import { Template } from "./template.js";

export class Analyst {
    static templateTableRow;

    static addAnalyst;
    static templateAddAnalyst;

    constructor(analyst) {
        this.name = analyst.name;
        this.ticketsPerDay = analyst.ticketsPerDay;
        this.isPercentage = analyst.isPercentage;
        this.isOverflow = analyst.isOverflow;

        this.tickets = [];
    }

    static init() {
        this.templateTableRow = Template.get('analyst-table-row');

        this.templateAddAnalyst = Template.get('add-analyst-li');
        this.addAnalyst = document.getElementById('form-add-analyst');
        
        const addButton = this.addAnalyst.querySelector('.add');

        addButton.addEventListener('click', (event) => {
            const count = parseInt(addButton.dataset.count);

            this.formAddAnalyst(count);

            addButton.dataset.count = count + 1;
        });
    }

    static populateAnalysts(analysts) {
        const newAnalysts = [];

        analysts.forEach((analyst) => {
            newAnalysts.push(new Analyst(analyst));
        });

        return newAnalysts;
    }

    static buildRows(analysts, tableBody, days) {
        analysts.forEach((analyst) => analyst.buildRow(tableBody, days));
    }

    static formAddAnalyst(count) {
        const analysts = ['Michael','Matthew','Laura','Allison','Sam',];
        const li = Template.clone(this.templateAddAnalyst);
        const name = li.querySelector('.name');

        name.value = analysts[count] || "";

        this.addAnalyst.append(li);
    }

    addTicket(ticket) {
        this.tickets.push(ticket);
    }

    buildRow(tableBody, days) {
        const row = Template.clone(Analyst.templateTableRow);

        const rowName = row.querySelector('.name');
        const rowCapacity = row.querySelector('.capacity');
        const rowTotal = row.querySelector('.total');
        const rowAverage = row.querySelector('.average');

        let capacity;

        if (this.isPercentage) {
            capacity = this.isOverflow ? `${this.ticketsPerDay}% O` : `${this.ticketsPerDay}%`;
        } else {
            capacity = this.ticketsPerDay;
        }

        rowName.textContent = this.name;
        rowCapacity.textContent = capacity;
        rowTotal.textContent = this.tickets.length;
        rowAverage.textContent = this.tickets.length / days.length;

        tableBody.append(row);
    }
}