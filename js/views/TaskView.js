import Backbone from 'backbone';
import $ from 'jquery';
import _ from 'underscore';

let TaskView = Backbone.View.extend({
    tagName: 'div',
    className: 'task',
    template: _.template($('#task-template').html()),
    events: {
        'click .controls__start': 'startTask',
        'click .controls__pause': 'pauseTask',
        'click .controls__stop': 'stopTask',
        'click .controls__delete': 'deleteTask',
        'blur .task__name, .task__rate-input': 'saveOnBlur'
    },
    counterId: null,
    initialize: function () {
        this.listenTo(this.model, 'change:counter', this.renderTimer);
    },
    saveOnBlur: function (e) {
        let $target = $(e.target);
        if ($target.hasClass('task__name')) {
            this.model.save('name', $target.text());
        } else if ($target.hasClass('task__rate-input')) {
            this.model.save('rate', $target.val());
        }
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        this.$('.task__rate-input').val(this.model.get('rate'));
        return this;
    },
    renderTimer: function () {
        let time = this.model.get('totalTime'),
            format = this.model.addLeadingZero;
        this.$('.task__time').html(_.map(time, format).join(':'));
    },
    startTask: function () {
        let task = this.model;
        if (!task.get('completed')) {
            this.renderTimer();
            this.counterId = setInterval(function () {
                task.save({
                    totalTime: [task.getHours(), task.getMinutes(), task.getSeconds()],
                    counter: task.get('counter') + 1
                });
            }, 1000);
            if (!task.get('beginTime')) {
                task.save('beginTime', Date.now());
            }
        }
    },
    pauseTask: function () {
        clearInterval(this.counterId);
    },
    stopTask: function () {
        let task = this.model;
        if (!task.get('endTime')) {
            task.save('endTime', Date.now());
        }
        clearInterval(this.counterId);
        task.save({
            completed: true,
            cost: task.calculateCost()
        });
        this.$('.task__cost').html(`${task.get('cost').toFixed(2)} ${task.get('currency')}`);
    },
    deleteTask: function () {
        this.unbind();
        this.remove();
        Backbone.trigger('delete-task', this.model);
    }
});

export default TaskView;
