// ==UserScript==
// @name         Select next task line
// @namespace    https://www.emakina.com/
// @version      1.4
// @author       Wouter Versyck
// @connect      self
// @icon         https://emakina.my.workfront.com/static/img/favicon.ico
// @supportURL   https://bugtracking.emakina.net/projects/ENWORKFNAV/summary
// @homepage     https://github.com/EmakinaBE/tampermonkey-scripts
// @match        https://emakina.my.workfront.com/timesheet/*
// @match        https://emakina.preview.workfront.com/timesheet/*
// @match        https://emakina.sb01.workfront.com/timesheet/*
// @match        https://emakina.my.workfront.com/timesheets/current*
// @match        https://emakina.preview.workfront.com/timesheets/current*
// @match        https://emakina.sb01.workfront.com/timesheets/current*
// @downloadURL  https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/select-next-task-line.js
// @updateURL    https://raw.githubusercontent.com/EmakinaBE/tampermonkey-scripts/feature/New-UI/src/workfront/select-next-task-line.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    document.head.addEventListener('WF_NEW-TASK', handleEvent);

    async function handleEvent(e) {
        const { newLine, workitemobjid } = e.detail;

        // Open drop down on lew line
        const hoursDropDown = newLine.getElement('.hour-type-drop-down');
        hoursDropDown.click();

        const lines = await getElementFromDocument(`[data-workitemobjid='${workitemobjid}'].TASK`);
        const itemList = await getElementFromDocument('.item-list');

        // get option that is not yet picked and click it
        const option = getFirstUnusedOption(lines, itemList);
        option.click();
    }

    function getFirstUnusedOption(lines, itemList) {
        const usedValues = getDropDown(lines).map(e => e.querySelector('.dd-hidden-input')[0].value);

        const options = [...itemList[0].children];
        const leftOver = options.filter(e => !usedValues.contains(e.getAttribute('data-value')));

        return leftOver.length > 0 ? leftOver[0] : options[0];
    }

    function getDropDown(lines) {
        var dropdown = {};
        lines.forEach(line => {
            dropdown.push(line.querySelector('.hour-type-drop-down'));
        });
        return dropdown;
    }

})();
