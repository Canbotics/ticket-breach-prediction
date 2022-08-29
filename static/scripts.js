import { Component } from './scripts/component.js';

import { Analyst } from './scripts/analyst.js';
import { Day } from './scripts/day.js';
import { Projection } from './scripts/projection.js';

document.addEventListener('DOMContentLoaded', (event) => {
    Component.init();

    Analyst.init();
    Day.init();

    Projection.init();
});