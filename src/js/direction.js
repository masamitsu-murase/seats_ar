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

    const createElement = function (name, attrs) {
        const elem = document.createElement(name);
        if (attrs) {
            for (const [key, value] of Object.entries(attrs)) {
                elem.setAttribute(key, value);
            }
        }
        return elem;
    };

    var constructMarkers = function (directions) {
        const angle_offset = -90;  // arrow indicates y-axis direction.
        const distance_unit = 0.5; // 0.5m
        var root = $("#root");
        var camera = $("#camera");
        directions.forEach((direction, index) => {
            var rad = Math.atan2(direction[1], direction[0]);
            var angle = rad * 180 / Math.PI + angle_offset;

            var marker = createElement("a-marker", {
                "type": "barcode",
                "value": `${index + 1}`
            });

            var entity = createElement("a-entity", {
                "position": "0 0 0",
                "scale": "1 1 1",
                "rotation": `0 ${angle} 0`,
                "gltf-model": "#arrow"
            });

            const distance = Math.sqrt(direction[0] ** 2 + direction[1] ** 2) * distance_unit;
            const rounded_distance = Math.round(distance * 10);
            const distance_str = `${Math.floor(rounded_distance / 10)}.${rounded_distance % 10}`;
            const distance_rad = -(rad - Math.PI);
            const position = `${Math.cos(distance_rad)} 0.1 ${Math.sin(distance_rad)}`;
            var text = createElement("a-text", {
                "value": `${distance_str}m`,
                "align": "center",
                "scale": "2 2 2",
                "rotation": `-70 ${angle} 0`,
                "position": position,
                "color": "#FF8888"
            });

            root.insertBefore(marker, camera);
            marker.appendChild(entity);
            marker.appendChild(text);
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
