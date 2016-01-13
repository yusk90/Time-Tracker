import Backbone from 'backbone';
import $ from 'jquery';
import _ from 'underscore';

let TaskView = Backbone.View.extend({
    tagName: 'div',
    className: 'task',
    template: _.template($('#task-template').html()),
    events: {
        'click .task__start': 'startTask',
        'click .task__pause': 'pauseTask',
        'click .task__stop': 'stopTask',
        'click .task__delete': 'deleteTask',
        'blur .task__name, .task__rate-input': 'saveOnBlur'
    },
    counterId: null,
    initialize: function () {
        this.listenTo(this.model, 'change:counter', this.renderTimer)
            .listenTo(this.model, 'change:cost', this.renderCost);
    },
    saveOnBlur: function (e) {
        let $target = $(e.target),
            task = this.model;
        if ($target.hasClass('task__name')) {
            task.save('name', $target.text());
        } else if ($target.hasClass('task__rate-input')) {
            task.save('rate', Number($target.val()));
            task.save('cost', task.calculateCost());
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
    renderCost: function () {
        let task = this.model;
        this.$('.task__cost').html(`${task.get('cost').toFixed(2)} ${task.get('currency')}`);
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
        let task = this.model;
        clearInterval(this.counterId);
        task.save('cost', task.calculateCost());
        this.renderCost();
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
        this.renderCost();
    },
    deleteTask: function () {
        this.unbind();
        this.remove();
        Backbone.trigger('delete-task', this.model);
    }
});

export default TaskView;
