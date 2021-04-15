document.addEventListener("DOMContentLoaded", function (event) {
});

var paramtersFromURL = {}

var suggestionsCreated = false;
var suggestionCount = 0;
var suggestions = {
    listOfSuggestions: [],
    get list() {
        return this.listOfSuggestions;
    },
    set list(value) {
        this.listOfSuggestions = value;
        renderSuggestions();
    }
}

// Display Reload Suggestions tooltip after the slider value change
var slider = document.getElementById("range");
slider.onchange = function() {
    getsuggestions();
}

function getsuggestions() {
    clearSuggestions();

    parametersFromURL = getURLParameters();

    processType = parametersFromURL['processType'];
    issueKey = parametersFromURL['parentIssueKey'];

    if (document.getElementById("slider") != null) {
        sliderValue = document.getElementById("slider").value;
        generateSuggestions(processType, issueKey, sliderValue);
    }
    else {
        generateSuggestions(processType, issueKey, 0);
    }
}

function generateSuggestions(processType, issueKey, sliderValue) {
    var jsonOfIssueKey = JSON.stringify({ 'issueKey': issueKey, 'sliderValue': sliderValue });

    insertLoader();

    switch (processType) {
        //for the epic decomposition process
        case 'epicDecomposition':

            console.log("Epic Decomposition Generate Suggestions: " + jsonOfIssueKey)

            $.ajax({
                type: "POST",
                url: "https://ai4agileaibackendproduction.azurewebsites.net/epicDecompositionCreateSuggestions",
                crossDomain: true,
                data: jsonOfIssueKey,
                contentType: "application/json",
                success: function (data) {
                    replyData = JSON.parse(data);
                    suggestions.list = replyData['suggestions'];
                }
            });
            break;

        //for the story optimization process
        case 'storyOptimization':

            console.log("Story Optimization Generate Suggestions: " + jsonOfIssueKey)

            $.ajax({
                type: "POST",
                url: "https://ai4agileaibackendproduction.azurewebsites.net/storyOptimizationCreateSuggestions",
                crossDomain: true,
                data: jsonOfIssueKey,
                contentType: "application/json",
                success: function (data) {
                    replyData = JSON.parse(data);
                    if (replyData['suggestions'].length > 1) {
                        suggestions.list = replyData['suggestions'];
                    }
                    else {
                        suggestions.list = ['No Story Optimization Possible'];
                    }
                }
            });
            break;

        //for the task generation process
        case 'taskGeneration':

            console.log("Task Generation Generate Suggestions: " + jsonOfIssueKey)

            $.ajax({
                type: "POST",
                url: "https://ai4agileaibackendproduction.azurewebsites.net/taskGenerationCreateSuggestions",
                crossDomain: true,
                data: jsonOfIssueKey,
                contentType: "application/json",
                success: function (data) {
                    replyData = JSON.parse(data);
                    suggestions.list = replyData['suggestions'];
                }
            });
            break;
    }
}

function syncCheckboxes() {
    updateSelectDeselectCheckboxWithResult();
    enableDisableCreateSelectedButton();
}

function renderSuggestions() {
    removeLoader();
    var div = document.getElementById('suggestions');
    suggestionsToRender = suggestions.list;
    for (suggestion of suggestionsToRender) {
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class", "suggestion")

        // create the necessary elements
        var label = document.createElement("label");
        label.setAttribute("contenteditable", "true");
        label.setAttribute("for", "suggestion");
        label.setAttribute('onChange', 'suggestionDeleted(this)');
        label.appendChild(document.createTextNode(suggestion));

        var checkbox = document.createElement("input");
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('name', 'suggestion');
        checkbox.setAttribute("onChange", "syncCheckboxes()")
        
        //console.log(suggestionsToRender)
        if (suggestion == "No Story Optimization Possible" && suggestionsToRender.length == 1) {
            checkbox.disabled = true;
            label.setAttribute("contenteditable", "false");
        }

        // add the label element to your div
        newDiv.appendChild(checkbox);
        newDiv.appendChild(label);
        newDiv.appendChild(document.createElement("br"));
    
        div.appendChild(newDiv);
    }
}

// For demo button
function createSuggestions() {
    var div = document.getElementById('suggestions');
    suggestionsToRender = suggestions;
    for (suggestion of suggestionsToRender) {
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class", "suggestion")
        // create the necessary elements
        var label = document.createElement("label");
        label.setAttribute("contenteditable", "true");
        label.setAttribute("for", "suggestion");
        label.appendChild(document.createTextNode(suggestion));

        var checkbox = document.createElement("input");
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('name', 'suggestion');
        checkbox.setAttribute('class', '')
        //checkbox.setAttribute('checked', 'True');

        // add the label element to your div
        newDiv.appendChild(checkbox);
        newDiv.appendChild(label);
        newDiv.appendChild(document.createElement("br"));
        div.appendChild(newDiv);
    }
}

// Select or deselect all check boxes
function selectDeselectAllCheckboxes() {
    var selectDeselectAllCheckBox = document.getElementsByName('selectDeselectAll');
    var selectDeselectCheck = selectDeselectAllCheckBox[0].checked

    var checkboxes = document.getElementsByName('suggestion');

    for (checkbox of checkboxes) {
        checkbox.checked = selectDeselectCheck;
    }
    syncCheckboxes();
}

function enableDisableCreateSelectedButton() {
    var checkboxes = document.getElementsByName('suggestion');
    var counter = 0;
    for (checkbox of checkboxes) {
        if (checkbox.checked) {
            counter++;
        }
    }

    if (counter > 0) {
        document.getElementById("createSelected").disabled = false;
    } else {
        document.getElementById("createSelected").disabled = true;
    }
}

// Update the select/deselect all check box depends on the check boxes
function updateSelectDeselectCheckboxWithResult() {
    var selectDeselectAllCheckBox = document.getElementsByName('selectDeselectAll')[0];
    var checkboxes = document.getElementsByName('suggestion');

    var counter = 0;
    for (checkbox of checkboxes) {
        if (checkbox.checked) {
            counter++;
        }
    }

    if (counter == checkboxes.length) {
        selectDeselectAllCheckBox.checked = true;
    } else {
        selectDeselectAllCheckBox.checked = false;
    }
}

function createSelectedSuggestions() {
    var populatedSuggestions = document.getElementsByName('suggestion');
    var checkedSuggestions = new Array();
    for (i = 0; i < populatedSuggestions.length; i++) {
        if (populatedSuggestions[i].checked == true) {
            checkedSuggestions.push(populatedSuggestions[i].parentElement.childNodes[1].innerHTML);
        }
    }

    if (checkedSuggestions.length == 0)
    {
        return;
    }

    var paramtersFromURL = getURLParameters();

    var processType = paramtersFromURL['processType'];

    var suggestionsToSend = {
        'projectKey': paramtersFromURL['projectKey'],
        'parentIssueKey': paramtersFromURL['parentIssueKey'],
        'suggestions': checkedSuggestions
    };

    //console.log("Process Type: " + processType)

    switch (processType) {
        //for the epic decomposition process
        case 'epicDecomposition':

            //console.log("Epic Decomposition Suggestion Creation: " + JSON.stringify(suggestionsToSend))

            $.ajax({
                type: "POST",
                url: "https://ai4agileaibackendproduction.azurewebsites.net/epicDecompositionCreateIssues",
                crossDomain: true,
                data: JSON.stringify(suggestionsToSend),
                contentType: "application/json",
            });
            break;

        //for the story optimization process
        case 'storyOptimization':

            //console.log("Story Optimization Suggestion Creation: " + JSON.stringify(suggestionsToSend))

            $.ajax({
                type: "POST",
                url: "https://ai4agileaibackendproduction.azurewebsites.net/storyOptimizationCreateIssues",
                crossDomain: true,
                data: JSON.stringify(suggestionsToSend),
                contentType: "application/json",
            });
            break;

        //for the task generation process
        case 'taskGeneration':

            //console.log("Task Generation Suggestion Creation: " + JSON.stringify(suggestionsToSend))

            $.ajax({
                type: "POST",
                url: "https://ai4agileaibackendproduction.azurewebsites.net/taskGenerationCreateIssues",
                crossDomain: true,
                data: JSON.stringify(suggestionsToSend),
                contentType: "application/json",
            });
            break;
    }

    for (i = populatedSuggestions.length - 1; i >= 0; i--) {
        if (populatedSuggestions[i].checked == true) {
            suggestionDeleted(populatedSuggestions[i]);
        }
    }

    if (document.getElementById('suggestions').childElementCount == 0) {
        document.getElementById('createSuggestions').disabled = false;
    }

    //CLOSE FIELD
}

function suggestionDeleted(suggestion) {
    suggestion.parentElement.remove();
}

function addSuggestion(suggestion) {
    var issues = document.getElementById("issues");
    issues.appendChild(document.createTextNode(suggestion.parentElement.childNodes[1].innerHTML));
    issues.appendChild(document.createElement("br"));
}

// Get the process type used (Epic Decomposition, Story Optimization, or Task Generation)
function getURLParameters() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    var parameterSet = {};
    parameterSet['projectKey'] = urlParams.get('projectKey');
    parameterSet['parentIssueKey'] = urlParams.get('parentIssueKey');
    parameterSet['processType'] = urlParams.get('processType');

    return parameterSet;
}

function populateRange() {
    processType = getURLParameters()['processType'];

    // Loads the range for the Epic Decomposition Process
    if (processType == 'epicDecomposition') {
        var div = document.getElementById("range");

        var range = document.createElement("input");
        range.setAttribute("type", "range");
        range.setAttribute("id", "slider");
        range.setAttribute("class", "slider");
        range.setAttribute("name", "range");
        range.setAttribute("min", "2");
        range.setAttribute("max", "10");
        range.setAttribute("value", "5");

        var rangeLabel = document.createElement("range");
        rangeLabel.appendChild(document.createTextNode("Number of Stories"));

        var rangeValueLabel = document.createElement("span");
        rangeValueLabel.setAttribute("class", "slider_label");
        rangeValueLabel.innerHTML = range.value;

        range.oninput = function () {
            rangeValueLabel.innerHTML = this.value;
        }

        div.appendChild(rangeLabel);
        div.appendChild(document.createElement("br"));
        div.appendChild(range);
        div.appendChild(rangeValueLabel);
    }

    // Loads the range for the Story Optimization Process
    else if (processType == 'storyOptimization') {
        var div = document.getElementById("range");

        var range = document.createElement("input");
        range.setAttribute("type", "range");
        range.setAttribute("id", "slider");
        range.setAttribute("class", "slider");
        range.setAttribute("name", "range");
        range.setAttribute("min", "0");
        range.setAttribute("max", "10");
        range.setAttribute("value", "5");

        var rangeLabel = document.createElement("range");
        rangeLabel.appendChild(document.createTextNode("Degree of Connectivity"));

        var rangeValueLabel = document.createElement("span");
        rangeValueLabel.setAttribute("class", "slider_label");
        rangeValueLabel.innerHTML = range.value;

        range.oninput = function () {
            rangeValueLabel.innerHTML = this.value;
        }

        div.appendChild(rangeLabel);
        div.appendChild(document.createElement("br"));
        div.appendChild(range);
        div.appendChild(rangeValueLabel);
    }
}

function insertLoader() {
    var div = document.getElementById('suggestions');

    var loading = document.createElement("div");
    loading.setAttribute('id', 'loading');
    loading.setAttribute('class', 'loading');

    var loader = document.createElement("div");
    loader.setAttribute('id', 'loader');
    loader.setAttribute('class', 'loader');

    loading.appendChild(loader);

    div.appendChild(loading);
}

function removeLoader() {
    var loading = document.getElementById('loading');
    loading.parentNode.removeChild(loading);
}

function clearSuggestions() {
    var populatedSuggestions = document.getElementsByName('suggestion');
    for (i = populatedSuggestions.length - 1; i >= 0; i--) {
        suggestionDeleted(populatedSuggestions[i]);
    }
}

var documentationLinkBase = 'https://aricmonary.github.io/AI4AgileJiraCloudApp/help/';

function openDocumentation() {
    var processType = getURLParameters()['processType'];
    var documentationPageToOpen = '';
    switch(processType) {
        case 'epicDecomposition':
            documentationPageToOpen = documentationLinkBase + 'epic-decomposition' + '.html';
            break;
        case 'storyOptimization':
            documentationPageToOpen = documentationLinkBase + 'story-optimization' + '.html';
            break;
        case 'taskGeneration':
            documentationPageToOpen = documentationLinkBase + 'task-generation' + '.html';
            break;
    }
    
    if (documentationPageToOpen != '')
    {
        window.open(documentationPageToOpen,'_blank');
    }
}