export default class BaseCommand {
    data;

    constructor(_data) {
        this.data = _data;
    }

    static execute() { }
}