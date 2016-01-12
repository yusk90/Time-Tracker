import Backbone from 'backbone';

let TaskModel = Backbone.Model.extend({
    defaults: {
        taskName: '',
        time: 0,
        cost: 0
    }
});

export default TaskModel;