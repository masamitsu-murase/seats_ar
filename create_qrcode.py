
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


base_url = "https://masamitsu-murase.github.io/seats_ar/src/qr_index.html"
# base_url = "http://localhost:3000/src/qr_index.html"
param = {
    "users": [
        ("Murase", (0, 0)),
        ("Masamitsu", (2, 2)),
        ("Masamitsu", (2, 0)),
        ("Masamitsu", (0, 2)),
        ("Masamitsu", (-1, 2)),
    ],

    "markers": [
        (-1, 1),
        (-3, -2),
        (5, 5),
        (-3, -2),
        (5, 5),
        (-3, -2),
        (5, 5),
        (-3, -2),
        (5, 5),
        (-1, -1),
        (1, 1),
        (1, -1),
        (5, 5),
        (-3, -2),
        (5, 5),
        (-3, -2),
        (5, 5),
        (-3, -2),
        (5, 5),
        (-3, -2),
        (5, 5),
        (-3, -2),
        (5, 5),
        (-3, -2),
        (5, 5),
        (0, 0),
    ]
}

url = create_url(base_url, param)
print(url)
qr = qrcode.QRCode(
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=2,
    border=8
)
qr.add_data(url)
qr.make()
img = qr.make_image()
img.save('hoge.png')
