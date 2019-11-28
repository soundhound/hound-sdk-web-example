# Hound SDK Web Official Example

![screenshot](https://p59.f1.n0.cdn.getcloudapp.com/items/7Kuy4GyN/Screen+Shot+2019-11-28+at+3.53.46+PM.png?v=e1b369fc4ddfc6458ada2aad1271f68d)

This repository provides examples using the [Houndify Web SDK](https://npmjs.com/package/houndify), which allows you to integrate Voice AI into your web, server, or React Native application.

Here, we've prepared an example **website** and **server** using the SDK. This repo doesn't include a React Native demo in the interest of keeping the build process similar. If you're interested in using React Native, check [the houndify-react-native repository](https://npmjs.com/package/houndify-react-native) for more information.

Feel free to explore the code to get a feel for how to use the Houndify Web SDK. If you're looking to do some quick prototyping for your own voice enabled project, this is a great place to start!

## Installation

1. Clone this repository.
2. run `npm install`
3. Add your Client ID and Client Key into the `config.json` file.
4. Add your Client ID into index.html (line 114) if you are using the browser.
5. To start the server and website, run `npm start`, or see below for how to run the example command line tools.

## Repository Structure and Usage

### config.json

This file contains some configuration information for the example project. Open it and enter your clientId/clientKey from your houndify account.

**WHENEVER** you change your clientId here, also change it in `public/index.html`. You can easily find it there by searching for the following text

> [INSERT CLIENT ID BELOW]

Please remember that if you'd like to use HTTPS, you must create a SSL key and certificate, and add their locations here.

### public

This is the sample website we've created.

#### index.html

Here, you'll find an example webpage. There's a script tag where we use the Houndify API to make requests and process responses. At the top of the page, we include the houndify web sdk from unpkg:

```
<script src="https://unpkg.com/houndify@3.1.1/dist/houndify.js"></script>
```

### server.js

This library does not directly make requests using the SDK, but sets up some important routes which allow the website to work, as we discussed [here.](https://npmjs.com/package/houndify) You can run it using

```bash
npm start
```

It will run on whatever port was set up in `config.json`, 3446 by default. Use this rather than starting the server directly, it runs some configuration in the background.

### node-client-text.js & node-client-voice.js

These are server-side implementations of Houndify's text and voice query features. If you've read the [Web SDK Tutorial.](https://npmjs.com/package/houndify) (which we highly recommend you do), you'll see that these files use the API we discussed.

You can run these using the following.

#### Sending a text query.

```bash
node node-client-text.js --query "What is the weather like in New York?"
```

#### Sending a voice query from a saved WAV file.

```bash
node node-client-voice.js --audio ./path/to/audio.wav
```
