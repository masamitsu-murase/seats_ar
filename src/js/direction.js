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

    var getUserDirections = function () {
        var hash = location.hash;
        if (hash.startsWith("#")) {
            hash = hash.slice(1);
        }

        var data = decodeHash(hash);
        return data;
    };

    var constructMarkers = function (directions) {
        var root = $("#root");
        var camera = $("#camera");
        directions.forEach((direction, index) => {
            var rad = Math.atan2(direction[1], direction[0]);
            var angle = rad * 180 / Math.PI;

            var marker = document.createElement("a-marker");
            marker.setAttribute("type", "barcode");
            marker.setAttribute("value", `${index + 1}`);

            var entity = document.createElement("a-entity");
            entity.setAttribute("position", "0 0 0");
            entity.setAttribute("scale", "1 1 1");
            entity.setAttribute("rotation", `0 ${angle} 0`);
            entity.setAttribute("gltf-model", "#arrow");

            root.insertBefore(marker, camera);
            marker.appendChild(entity);
        });
    };

    var initialize = function () {
        var directions = getUserDirections();
        constructMarkers(directions);
    };

    document.addEventListener("DOMContentLoaded", function () {
        initialize();
    });
})();
