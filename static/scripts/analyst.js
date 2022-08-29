import { Template } from "./template.js";

export class Analyst {
    static addAnalyst;
    static templateAddAnalyst;

    constructor(analyst) {
        this.name = analyst.name;
        this.ticketsPerDay = analyst.ticketsPerDay;
    }

    static init() {
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

    static formAddAnalyst(count) {
        const analysts = ['Michael','Matthew','Laura','Allison','Sam',];
        const li = Template.clone(this.templateAddAnalyst);
        const name = li.querySelector('.name');

        name.value = analysts[count] || "";

        this.addAnalyst.append(li);
    }
}