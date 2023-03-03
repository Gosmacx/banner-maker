# banner-maker

This application allows you to make a description poster for a product.

`Electron`, `JSDOM`, `Puppeteer`

## Working Logic

It processes an existing HTML file with JSDOM and takes a screenshot with the puppeteer, and as a result of the process, a picture is created.

Transactions in order:
- The banner html file, which also contains the style file, is read as a string and processed with the JSDOM library. 
- We process the data we obtain from the user to the DOM with the JSDOM library. 
- When the data is processed, your HTML data, which is in the form of a string, is saved as a file in the out folder.
- In this case, the out HTML file is a simple website version of the banner we want as a photo. 
- Then we run this file with puppeteer, take a screenshot and save the screenshot we get.

![howitsworking](https://user-images.githubusercontent.com/50182711/191128760-f418ccda-77a7-40db-9c58-1d677c07ccf0.jpg)

## Screenshots

https://user-images.githubusercontent.com/50182711/189491020-12a8954c-42ee-43c3-9b7f-445e591b54aa.mp4

## Out Example Banner

![best-banner](https://user-images.githubusercontent.com/50182711/189492128-48cff88f-6caf-466e-9207-6efd7d2b8046.jpg)
