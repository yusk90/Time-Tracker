import Backbone from 'backbone';
import TaskModel from '../models/TaskModel.js';
import $ from 'jquery';

let TaskView = Backbone.View.extend({
    model: TaskModel,
    tagName: 'div',
    className: 'task',
    template: $('#task-template').html(),
    events: {
        'click .task__start': 'startTask',
        'click .task__pause': 'pauseTask',
        'click .task__stop':   'endTask',
        'click .task__delete': 'deleteTask'
    },
    initialize: function () {

    },
    render: function () {
        this.$el.html(this.template);
        return this;
    },
    startTask: function () {
        let timeStamp = new Date.now(),
            hours = timeStamp.getHours(),
            minutes = timeStamp.getMinutes(),
            seconds = timeStamp.getSeconds();
        this.model.set('beginTime', timeStamp);
    },
    endTask: function () {
        let timeStamp = new Date.now();
        this.model.set('endTime', timeStamp);
    },
    deleteTask: function () {
        this.remove();
    }
});

export default TaskView;
