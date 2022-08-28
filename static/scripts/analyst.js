export class Analyst {
    static all = [];

    constructor(details) {
        this.id = Analyst.all.length;
        this.name = details.name;
        this.ticketsPerDay = details.ticketsPerDay;
    }

    static init() {
        const analysts = [
            {
                name: 'Michael',
                ticketsPerDay: 3
            },
            {
                name: 'Matthew',
                ticketsPerDay: 7
            },
            // {
            //     name: 'Laura',
            //     ticketsPerDay: 4
            // },
        ];

        analysts.forEach((analyst) => this.all.push(new Analyst(analyst)));
    }
}