# drawio-local

Pure local deploy of [draw.io](https://github.com/jgraph/drawio), disable all features that require external internet connections.

Demo: <https://test2go.github.io/drawio-local/>

Features:

- [x] Disable all online storages, such as Google Drive, OneDrive, Dropbox etc.
- [x] Disable logo click to draw io official website.
- [x] Disable "Download Desktop" notification.
- [ ] Disable sharing links and export links via draw.io.

![demo](images/demo.jpg)

## Why this project

You may want to deploy [draw.io](https://github.com/jgraph/drawio) in your company without any external features and connections, just download the repo then host it to nginx as a static website.

You may use python simple server to preview it:

```bash
cd drawio-local
python3 -m http.server 8000
```

To avoid unexpected errors or problems, please serve the folder as web root:

- `http://draw.example.com:8000/` (Recommended)
- `http://www.example.com:8080/draw` (Not Recommended)

## Deploy with docker

A docker image already has been built for this repo.

```bash
# local-port:docker-port, update it on your need
docker run --name="drawio-local" --restart=always -p 5000:5000  tobyqin/drawio-local
```

If you want to build such image base on other image, checkout the `Dockerfile`.

## How does it work

You can build a local draw io by yourself, steps are like this:

1. Download latest version of [drawio](https://github.com/jgraph/drawio)
2. Just keep the `src/main/webapp` folder
3. Modify [PreConfig](https://github.com/jgraph/drawio/blob/master/src/main/webapp/js/PreConfig.js) with [supported parameters](https://desk.draw.io/support/solutions/articles/16000042546-what-url-parameters-are-supported-).
4. To total disable `external connections`, please set `offline='1'` and `local='1'`

However, when set `offline='1'` will disable template feature, while enable it will show "Download Desktop" notification. So I modified `js/app.min.js` change the behavior, check my commit history to learn the some other hacks.

## Supported Browsers

diagrams.net supports IE 11, Chrome 32+, Firefox 38+, Safari 9.1.x, 10.1.x and 11.0.x, Opera 20+, Native Android browser 5.1.x+, the default browser in the current and previous major iOS versions (e.g. 11.2.x and 10.3.x) and Edge 23+.

## License

diagrams.net is licensed under the Apache v2.
