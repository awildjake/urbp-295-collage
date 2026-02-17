# URBP 295 Urban Montage

## Steps to add image to map

Use [this](https://awildjake.github.io/urbp-295-collage/tool-ref.html) tool to place your image on the map.

Once placed, press the "Export & Copy Coordinates" button; The copied code will only have the image coordinates and looks like this:

```json
{
    "id": "",
    "imageUrl": "",
    "soundUrl": "",
    "bounds": {
    "northEast": [
        37.36003497,
        -121.85926795
    ],
    "southWest": [
        37.35639889,
        -121.85113549
    ]
    }
}
```

Add the code to assets/data/overlays.json. The overlays.json will have many entries that look like this:

```json
{
  "overlays": [
    {
      "id": "example",
      "imageUrl": "https://example.com/example.jpg",
      "soundUrl": "",
      "bounds": {
        "northEast": [
          37.36003497,
          -121.85926795
        ],
        "southWest": [
          37.35639889,
          -121.85113549
        ]
      }
    }
  ]
}
```

Go to the bottom of the file and place a comma after the last entry in the list. Paste your image code after the comma.

```json
{
  "overlays": [
    {
      "id": "example",
      "imageUrl": "https://example.com/example.jpg",
      "soundUrl": "",
      "bounds": {
        "northEast": [
          37.36003497,
          -121.85926795
        ],
        "southWest": [
          37.35639889,
          -121.85113549
        ]
      }
    },
    {
      "id": "",
      "imageUrl": "",
      "soundUrl": "",
      "bounds": {
      "northEast": [
          37.36003497,
          -121.85926795
        ],
      "southWest": [
          37.35639889,
          -121.85113549
        ]
      }
    }
  ]
}
```

Assing your image a name with the `id` attribute. Upload your image online somewhere and paste it in the `imageUrl` attribute field.

```json
{
  "overlays": [
    {
      "id": "example",
      "imageUrl": "https://example.com/example.jpg",
      "soundUrl": "",
      "bounds": {
        "northEast": [
          37.36003497,
          -121.85926795
        ],
        "southWest": [
          37.35639889,
          -121.85113549
        ]
      }
    },
    {
      "id": "my_image",
      "imageUrl": "https://example.com/my_image.jpg",
      "soundUrl": "",
      "bounds": {
      "northEast": [
          37.36003497,
          -121.85926795
        ],
      "southWest": [
          37.35639889,
          -121.85113549
        ]
      }
    }
  ]
}
```

Save. The image will appear on the map after a few moments.
