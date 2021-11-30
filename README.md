# VieWLED

An alternative frontend for WLED built with Vue and Tailwind CSS.


|||
|-|-|
| <img src="docs/images/preview.png?raw=true" width="200"> | <img src="docs/images/preview2.png?raw=true" width="200"> |
|||

## What is this?

[WLED](https://github.com/Aircoookie/WLED) is an excellent controller software for your LED projects. VieWLED is an experimental alternative frontend built with Vue and Tailwind CSS.
## Installation

VieWLED is currently being developed and has not been integrated or tested on-device yet. For now you can serve a local development version of the project to test with devices on the same network.

To get started, clone this repo and install dependencies with `npm install`. Then create `.env` and put in `WLED_DEVICE_HOST=<YOUR DEVICE IP>`, or rename and edit `.env.example`. This file tells VieWLED which device to connect to.

Then launch the development environment with `npm run dev`, or `npm run dev --host` to expose the dev server to your local network (for testing on a phone, for example). In a browser, open `http://localhost:3000` to view the UI.

## Roadmap

The first goal is to gain feature parity with the original WLED frontend.

## License

VieWLED is [MIT](LICENSE) licensed.
