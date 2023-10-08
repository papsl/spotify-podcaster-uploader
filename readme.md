**Project Title:**  
Automated Spotify Podcaster (Anchor) episode uploader

**Project Description:**  
As there is currently no official API for uploading new podcast episodes to Spotify via Anchor, this project offers a solution. Inspired by two other projects, this script uses Puppeteer to automate using headless browser, enabling the seamless uploading of podcast episodes to Spotify Podcaster.
Inspired by https://github.com/geeksblabla/geeksblabla.com/blob/master/scripts/puppeteer-upload.js

**Project Features:**

- **Automated Uploads:** The script automates the process of uploading podcast episodes to Spotify via the Anchor platform.

**How It Works:**  
The script interacts with the Anchor platform to fetch podcast episode details, including the audio file, title, description, and other metadata. It then uses Puppeteer to automate the steps necessary to log in to Spotify, access the podcast dashboard, and upload the episode with the provided information.

**Getting Started:**  
To use this script, follow these steps:

1. Clone this repository to your local machine.
2. Run `npm install`
3. Configure the environment with your Anchor and Spotify credentials (see *Code example*).
4. Customize the file .\scripts\puppeteer-upload.example.js.
5. Run `npm test`, and it will automate the episode upload process for you.

**Code example**
```
SET ANCHOR_EMAIL=YourAnchorLoginEmail
SET ANCHOR_PASSWORD=YourAnchorLoginPassword
npm install
node test
```

**Possible Improvements:**  
Reorganize code (location, modules), improved error handling, better html handling, code style ...

**Disclaimer:**  
Please note that this project is not affiliated with Spotify or Anchor. It provides an unofficial workaround to automate the podcast episode uploading process and may require adjustments if the platforms' websites change.

**License:**  
This project is licensed under the [MIT License](link-to-license), allowing for free use and distribution.

**Author:**  
This project is developed and maintained by [Peter A. Pirc]. If you have any questions or need assistance, feel free to reach out.

**Acknowledgments:**  
Special thanks to the creators of the two projects that inspired this script, as well as the Puppeteer community for their valuable contributions to web automation.