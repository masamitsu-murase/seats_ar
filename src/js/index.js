(function () {
    var $ = function (selector) {
        return document.querySelector(selector);
    };

    var encodeHash = function (obj) {
        var uint8_array = msgpack.encode(obj);
        var binary = String.fromCharCode.apply(null, uint8_array);
        var base64 = btoa(binary);
        return base64.replace(/\+/g, "-").replace(/\//g, "_");
    };

    var decodeHash = function (hash) {
        var hash_base64 = hash.replace(/-/g, "+").replace(/_/g, "/");
        var binary = atob(hash_base64);
        var uint8_array = Uint8Array.from(binary, c => c.charCodeAt(0));
        return msgpack.decode(uint8_array);
    };

    var getMemberData = function () {
        var hash = location.hash;
        if (hash.startsWith("#")) {
            hash = hash.slice(1);
        }

        var data = decodeHash(hash);
        return data;
    };

    var calculateMarkerDirection = function (user, marker) {
        var user_x = user[1][0];
        var user_y = user[1][1];
        var marker_x = marker[0];
        var marker_y = marker[1];

        var diff_x = user_x - marker_x;
        var diff_y = user_y - marker_y;
        return [diff_x, diff_y];
    };

    var constructSelectOptions = function (users, markers) {
        // Remove all
        var select = $("#select_item");
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }

        // Add members
        users.forEach(user => {
            var name = user[0];
            var marker_directions = markers.map(m => calculateMarkerDirection(user, m));
            var node = document.createElement("option");
            node.setAttribute("value", encodeHash(marker_directions));
            node.appendChild(document.createTextNode(name));
            select.appendChild(node);
        });
    };

    var synchronizeSelectAndLink = function () {
        var href = location.href;
        var url = href.slice(0, href.lastIndexOf("/")) + "/direction.html#" + $("#select_item").value;
        $("#link_to_demo").href = url;
    };

    var initialize = function () {
        var data = getMemberData();
        var users = data.users;
        var markers = data.markers;
        constructSelectOptions(users, markers);

        $("#select_item").addEventListener("change", function () {
            synchronizeSelectAndLink();
        });
        synchronizeSelectAndLink();
    };

    initialize();
})();
