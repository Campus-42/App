# AlchemyAlcove Color Calculator

ColorCalculator is color manipulation library.

[![CircleCI](https://circleci.com/gh/AlchemyAlcove/ColorCalculator.svg?style=svg&circle-token=dc04a87232f2fce84b4c2bd54980c5d105485b76)](https://circleci.com/gh/AlchemyAlcove/ColorCalculator)

2KB download size minified.

This project has two dependencies.

[RGBtoHSL](https://github.com/AlchemyAlcove/RGBtoHSL)

[HSLtoRGB](https://github.com/AlchemyAlcove/HSLtoRGB)

![Color Calculator](https://media.giphy.com/media/G0vaYbZDJV0cM/giphy.gif)

## Install

npm install --save @alchemyalcove/color-calculator

## Use

Color Calculator is chainable function library. Simple create a Color Calculator object and then run as many functions as you want. Finally, export back to a hex color with the toHex function.

```javascript
import Color from "@alchemyalcove/color-calculator";

new Color("#2cf366").toHex();
// #2CF366

// Is a color light. Great for contrast comparison.
new Color("#666666").isLight();
// false

// Is a color dark.
new Color("#666666").isDark();
// true

// Lighten a color by 5%.
new Color("#2C3E50").lighten(5).toHex()
// #354A60

// Darken a color by 33%.
new Color("#FFF").darken(33).toHex()
// #AAAAAA

// Increase hue by 10%.
new Color("#2C3E50").increaseHue(10).toHex()
// #2F2C50

// Decrease hue by 10%.
new Color("#2C3E50").decreaseHue(10).toHex()
// #2C504C

// Increase saturation by 10%.
expect(new Color("#2C3E50").increaseSaturation(10).toHex()
// #253D56

// Decrease saturation by 10%.
  expect(new Color("#2C3E50").decreaseSaturation(10).toHex()
// #323D49
```