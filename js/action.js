var obj;
var split;
var FJS;
var statusListGUI = [];
var activeListGUI = [];

// get single elements in array
let remDoub = (arr) => {
    var temp = new Array();
    arr.sort();
    for (i = 0; i < arr.length; i++) {
        if (arr[i] == arr[i + 1]) {
            continue
        }
        temp[temp.length] = arr[i];
    }
    return temp;
}

// get data from server
let setData = (response) => {
    console.log("call", "setData");
    try {
        response = JSON.parse(response);
    } catch (e) {}
    obj = response;
    console.log(obj);
    for (var i = 0; i < obj.length; i++) {
        statusListGUI.push(obj[i].status);
        activeListGUI.push(obj[i].active);
    }
    // fill Filter GUI values
    statusListGUI = remDoub(statusListGUI);
    for (var i = 0; i < statusListGUI.length; i++) {
        var string = "<div class='checkbox'><label><input type='checkbox' value='" + statusListGUI[i] + "' id='status_criteria-" + i + "'><span>" + statusListGUI[i] + "</span></label></div>";
        $(string).appendTo("#status_criteria");
    }
    activeListGUI = remDoub(activeListGUI);
    for (var i = 0; i < activeListGUI.length; i++) {
        var string = "<div class='checkbox'><label><input type='checkbox' value='" + activeListGUI[i] + "' id='active_criteria-" + i + "'><span>" + activeListGUI[i] + "</span></label></div>";
        $(string).appendTo("#active_criteria");
    }
    // show number of elements
    $('#total_data').text(obj.length);
    console.log(obj.length);
    // init
    initFiltersHTML();
};

function initFiltersHTML() {
    $('#status_criteria :checkbox').prop('checked', false);
    $('#active_criteria :checkbox').prop('checked', false);
    initFilters();
}

function initFilters() {
    FJS = FilterJS(obj, '#data', {
        template: '#main_template',
        criterias: [{
            field: 'level',
            ele: '#status_criteria input:checkbox'
        }, {
            field: 'consumes',
            ele: '#active_criteria input:checkbox'
        }],
        search: {
            ele: '#searchbox'
        },
        callbacks: {
            afterFilter: function(result, jQ) {
                //console.log(result);
                $('#total_data').text(result.length);
            }
        }
    });
    window.FJS = FJS;
    // init filters
}

var highlight = function(id, opt) {
    var thumbnails = document.getElementsByClassName("thumbnail");
    for (var i = 0; i < thumbnails.length; i++) {
        if (id === thumbnails[i].id) {
            $(thumbnails[i]).addClass("active");
        } else {
            $(thumbnails[i]).removeClass("active");
        }
    }
}

var resethighlight = function() {
    var thumbnails = document.getElementsByClassName("thumbnail");
    for (var i = 0; i < thumbnails.length; i++) {
        $(thumbnails[i]).removeClass("active");
    }
}

$(document).ready(function() {
    let q = "SELECT DISTINCT * WHERE { ?s a rset:LittleMinion. ?s rset:name ?name. ?s rset:description ?description. ?s rset:dateOfEntry ?date. ?s rset:toolState ?state. ?s rset:active ?active. ?s rset:gitrepository ?gitrepository. ?s rset:author ?author. ?s rset:wikidataid ?id. ?s rset:link ?link. } ORDER BY ASC(?name)";
    TS.query(q, setData);
});
