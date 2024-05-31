# Image to Text OCR chrome extension

### Extract Text from an Image on any webpage.

## features:

> - Available for multiple languages.
> - Right click on any image and click on 'extract text' from context menu to extract the text from an Image.
> - Click on extension icon to select a part of current tab and extract text from it.
> - Play extracted text as an Audio(tts)
> - PDF text extraction from any language.

## Prerequisites

- yarn v1.17.3
- node v12.3.1

### Install toolchain utility globally

- npm install -g `manifest.js`

### Build

#### For Local Development

#### For Chromium Development Build

```
npm install
manifest build
```

#### For Firefox Development Build

```
yarn
yarn dev:firefox
```

#### For Production Release

#### For Chromium Build

```
yarn
yarn build:chromium
```

#### For Firefox Build

```
yarn
yarn build:firefox
```
