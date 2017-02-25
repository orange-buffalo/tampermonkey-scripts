// ==UserScript==
// @name         ticktick
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ticktick.com
// @grant        none
// @require      https://momentjs.com/downloads/moment.js
// ==/UserScript==



function updateCounters() {
    var now = moment(new Date());
    $.getJSON("/api/v2/projects",
        function(projects) {
          projects.forEach(function(project) {
              $.getJSON("/api/v2/project/" + project.id + "/tasks",
                  function(tasks) {
                    var dueToday = 0;
                    var overdue = 0;

                    tasks.forEach(function(task) {
                      if (task.status == 0 && task.dueDate) {
                        var taskDueDate = new Date(task.dueDate);
                        if (now.isAfter(moment(taskDueDate), 'day')) {
                          overdue++;
                          console.log(task.title + " is overdue");
                        }
                        if (now.isSame(moment(taskDueDate), 'day')) {
                          dueToday++;
                          console.log(task.title + " is due today");
                        }
                      }
                    });

                    var $projectBox = $(".project-box > .project-title:contains('" + project.name + "')").parent();
                    $projectBox.find(".advanced-counter").remove();

                    if (dueToday > 0 || overdue > 0) {
                      var offset = 36;
                      var delta = 22;

                      if (dueToday > 0) {
                        var $countBox = $projectBox.find(".count");
                        $('<span style=" \
                                position: absolute; \
                                right: ' + offset + 'px; ' +
                                'font-size: 12px; \
                                display: inline-block; \
                                background-color: #1d8fba; \
                                height: 12px; \
                                line-height: 12px; \
                                top: 50%; \
                                transform: translateY(-50%); \
                                padding: 2px; \
                                box-sizing: content-box; \
                                border-radius: 12px; \
                                width: 12px; \
                                text-align: center; \
                                color: #c1d1d1; " class="advanced-counter"> ' +
                                dueToday + '</span>'
                          ).insertBefore($countBox);

                          offset += delta;
                      }

                      if (overdue > 0) {
                        var $countBox = $projectBox.find(".count");
                        $('<span style=" \
                                 \
                                right: ' + offset + 'px; ' +
                                ' \
                                 \
                                background-color: #d96969; \
                                 \
                                 \
                                 \
                                 \
                                 \
                                 \
                                 \
                                 \
                                 \
                                color: #c1d1d1; " class="advanced-counter"> ' +
                                overdue + '</span>'
                          ).insertBefore($countBox);
                      }

                    }
                  });
          });
        });
}

(function() {
    'use strict';

    function _addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
    


    _addGlobalStyle(/*jshint multistr: true */" \
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
      } \
      ");

    setTimeout(updateCounters, 1000);

    var open = window.XMLHttpRequest.prototype.open;

    window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
      if (url && url.startsWith("https://www.ticktick.com/api/v2/task") && (method == "POST" || method == "PUT" || method == "DELETE")) {
          setTimeout(updateCounters, 4000);
      }
      return open.apply(this, arguments);
    }


})();