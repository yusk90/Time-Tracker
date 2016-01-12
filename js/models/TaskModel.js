import Backbone from 'backbone';

let TaskModel = Backbone.Model.extend({
    defaults: {
        name: '',
        hours: 0,
        minutes: 0,
        seconds: 0,
        cost: 0,
        beginTime: 0,
        endTime: 0
    }
});

export default TaskModel;
