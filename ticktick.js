// ==UserScript==
// @name         ticktick
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       orange-buffalo
// @match        https://www.ticktick.com
// @grant        none
// @require      https://momentjs.com/downloads/moment.js
// ==/UserScript==

(function () {
  'use strict';

  function _addGlobalStyle(css) {
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }

  function _calculateTasksSummary(tasks) {
    var dueTodayTasksCount = 0;
    var overdueTasksCount = 0;
    var now = moment(new Date());

    tasks.forEach(function (task) {
      if (task.status == 0 && task.dueDate) {
        var taskDueDate = new Date(task.dueDate);
        if (now.isAfter(moment(taskDueDate), 'day')) {
          overdueTasksCount++;
          console.log(task.title + " is overdue");
        }
        if (now.isSame(moment(taskDueDate), 'day')) {
          dueTodayTasksCount++;
          console.log(task.title + " is due today");
        }
      }
    });

    return {
      dueTodayTasksCount: dueTodayTasksCount,
      overdueTasksCount: overdueTasksCount
    }
  }

  function _insertCounterLabel($parent, countValue, backgroundColor, labelOffset) {
    if (countValue == 0) {
      return labelOffset;
    }

    const counterLabelOffsetStep = 22;

    $('<span class="advanced-counter"></span>')
      .css('right', labelOffset)
      .css('background-color', backgroundColor)
      .innerText(countValue)
      .insertBefore($parent);

    return labelOffset + counterLabelOffsetStep;
  }

  function _updateCounters() {
    $.getJSON("/api/v2/projects",
      function (projects) {
        projects.forEach(function (project) {
          $.getJSON("/api/v2/project/" + project.id + "/tasks",
            function (tasks) {
              var tasksSummary = _calculateTasksSummary(tasks);

              var $projectBox = $(".project-box > .project-title:contains('" + project.name + "')").parent();
              $projectBox.find(".advanced-counter").remove();

              var $countBox = $projectBox.find(".count");
              var counterLabelOffset = _insertCounterLabel($countBox, tasksSummary.dueTodayTasksCount, '#1d8fba', 36);
              _insertCounterLabel($countBox, tasksSummary.overdueTasksCount, '#d96969', counterLabelOffset);
            });
        });
      });
  }

  function _interceptAjaxRequests() {
    var open = window.XMLHttpRequest.prototype.open;

    window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
      if (url && url.startsWith('https://www.ticktick.com/api/v2/task') &&
        (method == 'POST' || method == 'PUT' || method == 'DELETE')) {
        setTimeout(_updateCounters, 3000);
      }
      return open.apply(this, arguments);
    }
  }

  _interceptAjaxRequests();

  _addGlobalStyle(/*jshint multistr: true */' \
      .upgrade-button { \
         display: none !important; \
      } \
      .g-right { \
         width: 45% !important; \
      } \
      .g-center { \
         right: 45% !important; \
      } \
      .lists { \
         padding-bottom: 0 !important; \
      } \
      .advanced-counter { \
         position: absolute; \
         font-size: 12px; \
         display: inline-block; \
         height: 12px; \
         line-height: 12px; \
         top: 50%; \
         transform: translateY(-50%); \
         padding: 2px; \
         box-sizing: content-box; \
         border-radius: 12px; \
         width: 12px; \
         text-align: center; \
         color: #c1d1d1; \
      } \
      ');

  setTimeout(_updateCounters, 1000);

})();
