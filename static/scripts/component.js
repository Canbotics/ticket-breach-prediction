import { Disclaimer } from "./components/disclaimer.js";
import { Tabnav, ProjectionSwitcher } from './components/tabnav.js';

export class Component {
    static init() {
        Tabnav.init();
    }

    static initLate() {
        ProjectionSwitcher.init();
        Disclaimer.init();
    }
}