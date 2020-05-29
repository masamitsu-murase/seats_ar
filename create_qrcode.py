
import base64
import json
import msgpack
import qrcode


def encode_param_msgpack(obj):
    msgpack_str = msgpack.dumps(obj)
    return base64.urlsafe_b64encode(msgpack_str).decode("ascii")


def encode_param(obj):
    return encode_param_msgpack(obj)


def create_url(base_url, param):
    return base_url + "#" + encode_param(param)


base_url = "http://localhost:8000/src/qr_index.html"
param = {
    "users": [
        ("村瀬", (3, 5)),
        ("昌満", (-13, 0.3)),
    ],

    "markers": [
        (5, 5),
        (-3, -2),
    ]
}

print(create_url(base_url, param))
