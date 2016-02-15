function createFieldMap(array, field) {
    var map = {};

    array.forEach(function (item) {
        var fieldValue = item[field];
        map[fieldValue] = item;
    });

    return map;
}

function getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = value;
        }
    );
    return vars;
}
