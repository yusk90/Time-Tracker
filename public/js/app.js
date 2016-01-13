var app =
webpackJsonp_name_([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _TaskModel = __webpack_require__(1);

	var _TaskModel2 = _interopRequireDefault(_TaskModel);

	var _AppView = __webpack_require__(5);

	var _AppView2 = _interopRequireDefault(_AppView);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		new _AppView2.default();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _backbone = __webpack_require__(2);

	var _backbone2 = _interopRequireDefault(_backbone);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var TaskModel = _backbone2.default.Model.extend({
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
	    calculateCost: function calculateCost() {
	        return this.get('rate') * (this.get('counter') / 3600);
	    },
	    getHours: function getHours() {
	        return parseInt(this.get('counter') / 3600);
	    },
	    getMinutes: function getMinutes() {
	        return parseInt((this.get('counter') - this.getHours() * 3600) / 60);
	    },
	    getSeconds: function getSeconds() {
	        return this.get('counter') - this.getHours() * 3600 - this.getMinutes() * 60;
	    },
	    addLeadingZero: function addLeadingZero(number) {
	        return number < 10 ? '0' + number : number;
	    }
	});

	exports.default = TaskModel;

/***/ },
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _backbone = __webpack_require__(2);

	var _backbone2 = _interopRequireDefault(_backbone);

	var _TaskView = __webpack_require__(6);

	var _TaskView2 = _interopRequireDefault(_TaskView);

	var _TaskModel = __webpack_require__(1);

	var _TaskModel2 = _interopRequireDefault(_TaskModel);

	var _TaskCollection = __webpack_require__(7);

	var _TaskCollection2 = _interopRequireDefault(_TaskCollection);

	var _jquery = __webpack_require__(4);

	var _jquery2 = _interopRequireDefault(_jquery);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var AppView = _backbone2.default.View.extend({
	    el: '#time-tracker',
	    events: {
	        'click #add-task': 'addTask'
	    },
	    initialize: function initialize() {
	        this.tasks = new _TaskCollection2.default();
	        this.listenTo(this.tasks, 'reset', this.renderAllTasks).listenTo(_backbone2.default, 'delete-task', this.deleteTask);
	        this.tasks.fetch({ reset: true });
	    },
	    addTask: function addTask() {
	        var task = new _TaskModel2.default(),
	            taskView = new _TaskView2.default({
	            model: task
	        });
	        this.tasks.create(task);
	        this.$el.append(taskView.render().el);
	    },
	    renderAllTasks: function renderAllTasks() {
	        var $fragment = (0, _jquery2.default)(document.createDocumentFragment());
	        function appendTask(task) {
	            var taskView = new _TaskView2.default({
	                model: task
	            });
	            $fragment.append(taskView.render().el);
	        }
	        this.tasks.each(appendTask, this);
	        this.$el.append($fragment);
	    },
	    deleteTask: function deleteTask(task) {
	        task.destroy();
	    }
	});

	exports.default = AppView;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _backbone = __webpack_require__(2);

	var _backbone2 = _interopRequireDefault(_backbone);

	var _jquery = __webpack_require__(4);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _underscore = __webpack_require__(3);

	var _underscore2 = _interopRequireDefault(_underscore);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var TaskView = _backbone2.default.View.extend({
	    tagName: 'div',
	    className: 'task',
	    template: _underscore2.default.template((0, _jquery2.default)('#task-template').html()),
	    events: {
	        'click .task__start': 'startTask',
	        'click .task__pause': 'pauseTask',
	        'click .task__stop': 'stopTask',
	        'click .task__delete': 'deleteTask',
	        'blur .task__name, .task__rate-input': 'saveOnBlur'
	    },
	    counterId: null,
	    initialize: function initialize() {
	        this.listenTo(this.model, 'change:counter', this.renderTimer).listenTo(this.model, 'change:cost', this.renderCost);
	    },
	    saveOnBlur: function saveOnBlur(e) {
	        var $target = (0, _jquery2.default)(e.target),
	            task = this.model;
	        if ($target.hasClass('task__name')) {
	            task.save('name', $target.text());
	        } else if ($target.hasClass('task__rate-input')) {
	            task.save('rate', Number($target.val()));
	            task.save('cost', task.calculateCost());
	        }
	    },
	    render: function render() {
	        this.$el.html(this.template(this.model.toJSON()));
	        this.$('.task__rate-input').val(this.model.get('rate'));
	        return this;
	    },
	    renderTimer: function renderTimer() {
	        var time = this.model.get('totalTime'),
	            format = this.model.addLeadingZero;
	        this.$('.task__time').html(_underscore2.default.map(time, format).join(':'));
	    },
	    renderCost: function renderCost() {
	        var task = this.model;
	        this.$('.task__cost').html(task.get('cost').toFixed(2) + ' ' + task.get('currency'));
	    },
	    startTask: function startTask() {
	        var task = this.model;
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
	    pauseTask: function pauseTask() {
	        var task = this.model;
	        clearInterval(this.counterId);
	        task.save('cost', task.calculateCost());
	        this.renderCost();
	    },
	    stopTask: function stopTask() {
	        var task = this.model;
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
	    deleteTask: function deleteTask() {
	        this.unbind();
	        this.remove();
	        _backbone2.default.trigger('delete-task', this.model);
	    }
	});

	exports.default = TaskView;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _TaskModel = __webpack_require__(1);

	var _TaskModel2 = _interopRequireDefault(_TaskModel);

	var _backbone = __webpack_require__(2);

	var _backbone2 = _interopRequireDefault(_backbone);

	var _backbone3 = __webpack_require__(8);

	var _backbone4 = _interopRequireDefault(_backbone3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var TaskCollection = _backbone2.default.Collection.extend({
	    model: _TaskModel2.default,
	    localStorage: new _backbone2.default.LocalStorage('Tasks')
	});

	exports.default = TaskCollection;

/***/ }
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vL2pzL2FwcC5qcyIsIndlYnBhY2s6Ly8vanMvbW9kZWxzL1Rhc2tNb2RlbC5qcyIsIndlYnBhY2s6Ly8vanMvdmlld3MvQXBwVmlldy5qcyIsIndlYnBhY2s6Ly8vanMvdmlld3MvVGFza1ZpZXcuanMiLCJ3ZWJwYWNrOi8vL2pzL2NvbGxlY3Rpb25zL1Rhc2tDb2xsZWN0aW9uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBUYXNrTW9kZWwgZnJvbSAnLi9tb2RlbHMvVGFza01vZGVsJztcbmltcG9ydCBBcHBWaWV3IGZyb20gJy4vdmlld3MvQXBwVmlldyc7XG5cbm5ldyBBcHBWaWV3KCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBqcy9hcHAuanNcbiAqKi8iLCJpbXBvcnQgQmFja2JvbmUgZnJvbSAnYmFja2JvbmUnO1xuXG5sZXQgVGFza01vZGVsID0gQmFja2JvbmUuTW9kZWwuZXh0ZW5kKHtcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBuYW1lOiAnVGFzayBuYW1lJyxcbiAgICAgICAgY291bnRlcjogMCxcbiAgICAgICAgdG90YWxUaW1lOiBbMCwgMCwgMF0sXG4gICAgICAgIGNvc3Q6IDAsXG4gICAgICAgIHJhdGU6IDM4MCxcbiAgICAgICAgYmVnaW5UaW1lOiAwLFxuICAgICAgICBlbmRUaW1lOiAwLFxuICAgICAgICBjb21wbGV0ZWQ6IGZhbHNlLFxuICAgICAgICBjdXJyZW5jeTogJ3J1YidcbiAgICB9LFxuICAgIGNhbGN1bGF0ZUNvc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCdyYXRlJykgKiAodGhpcy5nZXQoJ2NvdW50ZXInKSAvIDM2MDApO1xuICAgIH0sXG4gICAgZ2V0SG91cnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMuZ2V0KCdjb3VudGVyJykgLyAzNjAwKTtcbiAgICB9LFxuICAgIGdldE1pbnV0ZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KCh0aGlzLmdldCgnY291bnRlcicpIC0gdGhpcy5nZXRIb3VycygpICogMzYwMCkgLyA2MClcbiAgICB9LFxuICAgIGdldFNlY29uZHM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCdjb3VudGVyJykgLSB0aGlzLmdldEhvdXJzKCkgKiAzNjAwIC0gdGhpcy5nZXRNaW51dGVzKCkgKiA2MDtcbiAgICB9LFxuICAgIGFkZExlYWRpbmdaZXJvOiBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBudW1iZXIgPCAxMCA/ICcwJyArIG51bWJlciA6IG51bWJlcjtcbiAgICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgVGFza01vZGVsO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKioganMvbW9kZWxzL1Rhc2tNb2RlbC5qc1xuICoqLyIsImltcG9ydCBCYWNrYm9uZSBmcm9tICdiYWNrYm9uZSc7XG5pbXBvcnQgVGFza1ZpZXcgZnJvbSAnLi9UYXNrVmlldyc7XG5pbXBvcnQgVGFza01vZGVsIGZyb20gJy4uL21vZGVscy9UYXNrTW9kZWwnO1xuaW1wb3J0IFRhc2tDb2xsZWN0aW9uIGZyb20gJy4uL2NvbGxlY3Rpb25zL1Rhc2tDb2xsZWN0aW9uJztcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5cbmxldCBBcHBWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIGVsOiAnI3RpbWUtdHJhY2tlcicsXG4gICAgZXZlbnRzOiB7XG4gICAgICAgICdjbGljayAjYWRkLXRhc2snOiAnYWRkVGFzaydcbiAgICB9LFxuICAgIGluaXRpYWxpemU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50YXNrcyA9IG5ldyBUYXNrQ29sbGVjdGlvbigpO1xuICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMudGFza3MsICdyZXNldCcsIHRoaXMucmVuZGVyQWxsVGFza3MpXG4gICAgICAgICAgICAubGlzdGVuVG8oQmFja2JvbmUsICdkZWxldGUtdGFzaycsIHRoaXMuZGVsZXRlVGFzayk7XG4gICAgICAgIHRoaXMudGFza3MuZmV0Y2goeyByZXNldDogdHJ1ZSB9KTtcbiAgICB9LFxuICAgIGFkZFRhc2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHRhc2sgPSBuZXcgVGFza01vZGVsKCksXG4gICAgICAgICAgICB0YXNrVmlldyA9IG5ldyBUYXNrVmlldyh7XG4gICAgICAgICAgICAgICAgbW9kZWw6IHRhc2tcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB0aGlzLnRhc2tzLmNyZWF0ZSh0YXNrKTtcbiAgICAgICAgdGhpcy4kZWwuYXBwZW5kKHRhc2tWaWV3LnJlbmRlcigpLmVsKTtcbiAgICB9LFxuICAgIHJlbmRlckFsbFRhc2tzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxldCAkZnJhZ21lbnQgPSAkKGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSk7XG4gICAgICAgIGZ1bmN0aW9uIGFwcGVuZFRhc2sodGFzaykge1xuICAgICAgICAgICAgdmFyIHRhc2tWaWV3ID0gbmV3IFRhc2tWaWV3KHtcbiAgICAgICAgICAgICAgICBtb2RlbDogdGFza1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkZnJhZ21lbnQuYXBwZW5kKHRhc2tWaWV3LnJlbmRlcigpLmVsKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhc2tzLmVhY2goYXBwZW5kVGFzaywgdGhpcyk7XG4gICAgICAgIHRoaXMuJGVsLmFwcGVuZCgkZnJhZ21lbnQpO1xuICAgIH0sXG4gICAgZGVsZXRlVGFzazogZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgdGFzay5kZXN0cm95KCk7XG4gICAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEFwcFZpZXc7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBqcy92aWV3cy9BcHBWaWV3LmpzXG4gKiovIiwiaW1wb3J0IEJhY2tib25lIGZyb20gJ2JhY2tib25lJztcbmltcG9ydCAkIGZyb20gJ2pxdWVyeSc7XG5pbXBvcnQgXyBmcm9tICd1bmRlcnNjb3JlJztcblxubGV0IFRhc2tWaWV3ID0gQmFja2JvbmUuVmlldy5leHRlbmQoe1xuICAgIHRhZ05hbWU6ICdkaXYnLFxuICAgIGNsYXNzTmFtZTogJ3Rhc2snLFxuICAgIHRlbXBsYXRlOiBfLnRlbXBsYXRlKCQoJyN0YXNrLXRlbXBsYXRlJykuaHRtbCgpKSxcbiAgICBldmVudHM6IHtcbiAgICAgICAgJ2NsaWNrIC50YXNrX19zdGFydCc6ICdzdGFydFRhc2snLFxuICAgICAgICAnY2xpY2sgLnRhc2tfX3BhdXNlJzogJ3BhdXNlVGFzaycsXG4gICAgICAgICdjbGljayAudGFza19fc3RvcCc6ICdzdG9wVGFzaycsXG4gICAgICAgICdjbGljayAudGFza19fZGVsZXRlJzogJ2RlbGV0ZVRhc2snLFxuICAgICAgICAnYmx1ciAudGFza19fbmFtZSwgLnRhc2tfX3JhdGUtaW5wdXQnOiAnc2F2ZU9uQmx1cidcbiAgICB9LFxuICAgIGNvdW50ZXJJZDogbnVsbCxcbiAgICBpbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5tb2RlbCwgJ2NoYW5nZTpjb3VudGVyJywgdGhpcy5yZW5kZXJUaW1lcilcbiAgICAgICAgICAgIC5saXN0ZW5Ubyh0aGlzLm1vZGVsLCAnY2hhbmdlOmNvc3QnLCB0aGlzLnJlbmRlckNvc3QpO1xuICAgIH0sXG4gICAgc2F2ZU9uQmx1cjogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgbGV0ICR0YXJnZXQgPSAkKGUudGFyZ2V0KSxcbiAgICAgICAgICAgIHRhc2sgPSB0aGlzLm1vZGVsO1xuICAgICAgICBpZiAoJHRhcmdldC5oYXNDbGFzcygndGFza19fbmFtZScpKSB7XG4gICAgICAgICAgICB0YXNrLnNhdmUoJ25hbWUnLCAkdGFyZ2V0LnRleHQoKSk7XG4gICAgICAgIH0gZWxzZSBpZiAoJHRhcmdldC5oYXNDbGFzcygndGFza19fcmF0ZS1pbnB1dCcpKSB7XG4gICAgICAgICAgICB0YXNrLnNhdmUoJ3JhdGUnLCBOdW1iZXIoJHRhcmdldC52YWwoKSkpO1xuICAgICAgICAgICAgdGFzay5zYXZlKCdjb3N0JywgdGFzay5jYWxjdWxhdGVDb3N0KCkpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy4kZWwuaHRtbCh0aGlzLnRlbXBsYXRlKHRoaXMubW9kZWwudG9KU09OKCkpKTtcbiAgICAgICAgdGhpcy4kKCcudGFza19fcmF0ZS1pbnB1dCcpLnZhbCh0aGlzLm1vZGVsLmdldCgncmF0ZScpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICByZW5kZXJUaW1lcjogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgdGltZSA9IHRoaXMubW9kZWwuZ2V0KCd0b3RhbFRpbWUnKSxcbiAgICAgICAgICAgIGZvcm1hdCA9IHRoaXMubW9kZWwuYWRkTGVhZGluZ1plcm87XG4gICAgICAgIHRoaXMuJCgnLnRhc2tfX3RpbWUnKS5odG1sKF8ubWFwKHRpbWUsIGZvcm1hdCkuam9pbignOicpKTtcbiAgICB9LFxuICAgIHJlbmRlckNvc3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHRhc2sgPSB0aGlzLm1vZGVsO1xuICAgICAgICB0aGlzLiQoJy50YXNrX19jb3N0JykuaHRtbChgJHt0YXNrLmdldCgnY29zdCcpLnRvRml4ZWQoMil9ICR7dGFzay5nZXQoJ2N1cnJlbmN5Jyl9YCk7XG4gICAgfSxcbiAgICBzdGFydFRhc2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHRhc2sgPSB0aGlzLm1vZGVsO1xuICAgICAgICBpZiAoIXRhc2suZ2V0KCdjb21wbGV0ZWQnKSkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJUaW1lcigpO1xuICAgICAgICAgICAgdGhpcy5jb3VudGVySWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGFzay5zYXZlKHtcbiAgICAgICAgICAgICAgICAgICAgdG90YWxUaW1lOiBbdGFzay5nZXRIb3VycygpLCB0YXNrLmdldE1pbnV0ZXMoKSwgdGFzay5nZXRTZWNvbmRzKCldLFxuICAgICAgICAgICAgICAgICAgICBjb3VudGVyOiB0YXNrLmdldCgnY291bnRlcicpICsgMVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgICAgICBpZiAoIXRhc2suZ2V0KCdiZWdpblRpbWUnKSkge1xuICAgICAgICAgICAgICAgIHRhc2suc2F2ZSgnYmVnaW5UaW1lJywgRGF0ZS5ub3coKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHBhdXNlVGFzazogZnVuY3Rpb24gKCkge1xuICAgICAgICBsZXQgdGFzayA9IHRoaXMubW9kZWw7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jb3VudGVySWQpO1xuICAgICAgICB0YXNrLnNhdmUoJ2Nvc3QnLCB0YXNrLmNhbGN1bGF0ZUNvc3QoKSk7XG4gICAgICAgIHRoaXMucmVuZGVyQ29zdCgpO1xuICAgIH0sXG4gICAgc3RvcFRhc2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IHRhc2sgPSB0aGlzLm1vZGVsO1xuICAgICAgICBpZiAoIXRhc2suZ2V0KCdlbmRUaW1lJykpIHtcbiAgICAgICAgICAgIHRhc2suc2F2ZSgnZW5kVGltZScsIERhdGUubm93KCkpO1xuICAgICAgICB9XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jb3VudGVySWQpO1xuICAgICAgICB0YXNrLnNhdmUoe1xuICAgICAgICAgICAgY29tcGxldGVkOiB0cnVlLFxuICAgICAgICAgICAgY29zdDogdGFzay5jYWxjdWxhdGVDb3N0KClcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVuZGVyQ29zdCgpO1xuICAgIH0sXG4gICAgZGVsZXRlVGFzazogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnVuYmluZCgpO1xuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgICAgICBCYWNrYm9uZS50cmlnZ2VyKCdkZWxldGUtdGFzaycsIHRoaXMubW9kZWwpO1xuICAgIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBUYXNrVmlldztcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIGpzL3ZpZXdzL1Rhc2tWaWV3LmpzXG4gKiovIiwiaW1wb3J0IFRhc2tNb2RlbCBmcm9tICcuLi9tb2RlbHMvVGFza01vZGVsJztcbmltcG9ydCBCYWNrYm9uZSBmcm9tICdiYWNrYm9uZSc7XG5pbXBvcnQgTG9jYWxTdG9yYWdlIGZyb20gJ2JhY2tib25lLmxvY2Fsc3RvcmFnZSc7XG5cbmxldCBUYXNrQ29sbGVjdGlvbiA9IEJhY2tib25lLkNvbGxlY3Rpb24uZXh0ZW5kKHtcbiAgICBtb2RlbDogVGFza01vZGVsLFxuICAgIGxvY2FsU3RvcmFnZTogbmV3IEJhY2tib25lLkxvY2FsU3RvcmFnZSgnVGFza3MnKVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IFRhc2tDb2xsZWN0aW9uO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKioganMvY29sbGVjdGlvbnMvVGFza0NvbGxlY3Rpb24uanNcbiAqKi8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OyIsInNvdXJjZVJvb3QiOiIifQ==