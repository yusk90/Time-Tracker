import Backbone from 'backbone';
import TaskView from './TaskView.js';

let AppView = Backbone.View.extend({
    el: '#time-tracker',
    events: {
        'click #add-task': 'addTask'
    },
    initialize: function () {

    },
    addTask: function () {
        let task = new TaskView();
        this.$el.append(task.render().el);
    }
});

export default AppView;
