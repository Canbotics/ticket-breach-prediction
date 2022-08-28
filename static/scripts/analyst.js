export class Analyst {
    constructor(analyst) {
        this.name = analyst.name;
        this.ticketsPerDay = analyst.ticketsPerDay;
    }

    static init(analysts) {
        const newAnalysts = [];

        analysts.forEach((analyst) => {
            newAnalysts.push(new Analyst(analyst));
        });

        return newAnalysts;
    }
}