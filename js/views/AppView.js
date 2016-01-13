import Backbone from 'backbone';
import TaskView from './TaskView';
import TaskModel from '../models/TaskModel';
import TaskCollection from '../collections/TaskCollection';
import $ from 'jquery';

let AppView = Backbone.View.extend({
    el: '#time-tracker',
    events: {
        'click #add-task': 'addTask'
    },
    initialize: function () {
        this.tasks = new TaskCollection();
        this.listenTo(this.tasks, 'reset', this.renderAllTasks)
            .listenTo(Backbone, 'delete-task', this.deleteTask);
        this.tasks.fetch({ reset: true });
    },
    addTask: function () {
        let task = new TaskModel(),
            taskView = new TaskView({
                model: task
            });
        this.tasks.create(task);
        this.$el.append(taskView.render().el);
    },
    renderAllTasks: function () {
        let $fragment = $(document.createDocumentFragment());
        function appendTask(task) {
            var taskView = new TaskView({
                model: task
            });
            $fragment.append(taskView.render().el);
        }
        this.tasks.each(appendTask, this);
        this.$el.append($fragment);
    },
    deleteTask: function (task) {
        task.destroy();
    }
});

export default AppView;
