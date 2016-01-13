import Backbone from 'backbone';

let TaskModel = Backbone.Model.extend({
    defaults: {
        name: 'Task name',
        counter: 0,
        totalTime: [0, 0, 0],
        cost: 0,
        rate: 380,
        beginTime: 0,
        endTime: 0,
        completed: false,
        currency: 'rub'
    },
    calculateCost: function () {
        return this.get('rate') * (this.get('counter') / 3600);
    },
    getHours: function () {
        return parseInt(this.get('counter') / 3600);
    },
    getMinutes: function () {
        return parseInt((this.get('counter') - this.getHours() * 3600) / 60)
    },
    getSeconds: function () {
        return this.get('counter') - this.getHours() * 3600 - this.getMinutes() * 60;
    },
    addLeadingZero: function (number) {
        return number < 10 ? '0' + number : number;
    }
});

export default TaskModel;
