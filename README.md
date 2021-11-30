# VieWLED

An alternative frontend for WLED built with Vue and Tailwind CSS.

## What is this?

[WLED](https://github.com/Aircoookie/WLED) is an excellent controller software for your LED projects. VieWLED is an experimental alternative frontend built with Vue and Tailwind CSS. VieWLED is meant to be device-specific.
## Installation

Please see [JeffSchofield/WLED](https://github.com/JeffSchofield/WLED) for a version of WLED with the frontend pre-installed.

This repository holds the source code for the vue frontend. To install it into WLED you will need to clone this project, build it with `yarn build`, and replace the files in `/wled00/data` in your WLED folder with the files from `./build` in this folder. Then you can [compile WLED](https://kno.wled.ge/advanced/compile-wled/) to create your custom .bin for flashing.

## Roadmap

The first goal is to gain feature parity with the original WLED frontend.
