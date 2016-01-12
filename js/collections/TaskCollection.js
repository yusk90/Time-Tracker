import Backbone from 'backbone';
import LocalStorage from 'backbone.localstorage';

let TaskCollection = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage('SomeCollection')
});

export default TaskCollection;
