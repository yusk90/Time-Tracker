import TaskModel from '../models/TaskModel';
import Backbone from 'backbone';
import LocalStorage from 'backbone.localstorage';

let TaskCollection = Backbone.Collection.extend({
    model: TaskModel,
    localStorage: new Backbone.LocalStorage('Tasks')
});

export default TaskCollection;
