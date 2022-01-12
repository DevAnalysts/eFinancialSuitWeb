import { NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
const now = new Date();

export class cDate {

    private year: any;
    public model: NgbDateStruct = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    
    getDate() {
        return (this.model.day < 10 ? '0' + this.model.day : this.model.day) + '/' + (this.model.month < 10 ? '0' + this.model.month : this.model.month) + '/' + this.model.year;
    }
    setDate(_dt: any) {
      let _date = new Date(_dt);     
        this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
    }

    getDateFinal() {
        if(this.model===null)
        return null;
        else
        return (this.model.month < 10 ? '0' + this.model.month : this.model.month) + '/' + (this.model.day < 10 ? '0' + this.model.day : this.model.day) + '/' + this.model.year;
    }
    getDateReport() {
        return (this.model.day < 10 ? '0' + this.model.day : this.model.day) + '/' + (this.model.month < 10 ? '0' + this.model.month : this.model.month) + '/' + this.model.year;
    }
    getStandardDate() {
        var date = new Date((this.model.month < 10 ? '0' + this.model.month : this.model.month) + '/' + (this.model.day < 10 ? '0' + this.model.day : this.model.day) + '/' + this.model.year);
        return date
    }

    getCurrentPreviousQuarter(value) {
        var today = new Date(),
            quarter = Math.floor((today.getMonth() / 3)),
            startDate,
            endDate;

        switch (value) {
            case "previous":
                startDate = new Date(today.getFullYear(), quarter * 3 - 3, 1);
                endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);
                break;
            default:
                startDate = new Date(today.getFullYear(), quarter * 3, 1);
                endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 3, 0);
                break;
        }

        return {
            StartDate: startDate,
            EndDate: endDate
        };
    }
    setMondayOfCurrentWeek(d) {
        let day = d.getDay();
        let _date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0 ? -6 : 1) - day);
        this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
    }
    setSundayOfCurrentWeek(d) {
        var day = d.getDay();
        let _date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (day == 0 ? 0 : 7) - day);
        this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
    }
    setMondayOfPreviousWeek(d) {

        var day = d.getDay();
        let _date = new Date(d.getFullYear(), d.getMonth(), (d.getDate() - 7) + (day == 0 ? -7 : 1) - day);

        this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
    }
    setSundayOfPreviousWeek(d) {

        var day = d.getDay();
        let _date = new Date(d.getFullYear(), d.getMonth(), (d.getDate() - 1) + (day == 0 ? -7 : 1) - day);
        this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
    }
    setFirstDayOfPreviousMonth(d) {
        let _date = new Date(d.getFullYear(), d.getMonth() - 1, 1);
        this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
    }
    setLastDayOfPreviousMonth(d) {
        let _date = new Date(d.getFullYear(), d.getMonth(), 0);
        this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
    }
    setFirstDayOfCurrentMonth(d) {
        let _date = new Date(d.getFullYear(), d.getMonth(), 1);
        this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
    }
    setLastDayOfCurrentMonth(d) {
        var day = d.getDay();
        let _date = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
    }
    setFirstDayOfCurrentYear(d) {
        let _date = new Date(d.getFullYear(), 1, 1);
        this.model = { year: _date.getFullYear(), month: 1, day: _date.getDate() };
        // this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
    }
    setLastDayOfCurrentYear(d) {
        let _date = new Date(d.getFullYear(), 12, 0);
        this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
    }
    setDayDate(d: any, day: any) {
        let _date = new Date(d.getFullYear(), d.getMonth(), (d.getDate() + day));
        this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
    }
    setPrevoiusYearStart(d: any) {
        let _date = new Date(d.getFullYear() - 1, 1, 1);
        this.model = { year: _date.getFullYear(), month: 1, day: _date.getDate() };
        // this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
    }
    setPrevoiusYearEnd(d: any) {
        let _date = new Date(d.getFullYear() - 1, 12, 31);
        this.model = { year: _date.getFullYear() - 1, month: 12, day: _date.getDate() };
    }
    getNextYear(d: any, inc: any) {
        this.year = "";
        if (d != null) {
            let _date = new Date(d);
            this.year = _date.getFullYear() + inc;

        }
        return this.year;
    }
    setNextYearStart(d: any) {
        let _date = new Date(d.getFullYear() + 1, 7, 1);
        this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };

    }
    setNextYearEnd(d: any) {
        let _date = new Date(d.getFullYear() + 1, 6, 30);
        this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
    }
    getNextQuarter(value) {
        var today = new Date(value),
            quarter = Math.floor((today.getMonth() / 3)),
            startDate,
            endDate;


        endDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());


        return {
            EndDate: endDate
        };

    }
    getNextWeek(d) {
        let _date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7);
        this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
    }
    getNextMonth(d) {     
        let _date = new Date(d.getFullYear(), d.getMonth() + 1, d.getDay());
        this.model = { year: _date.getFullYear(), month: _date.getMonth() + 1, day: _date.getDate() };
    }
}
