const uploadToAnchor = require("./puppeteer-upload")

const testEpisodeData = {
  title: "Test minutka 2023 episode 1",
  description: "This is a <b>test episode</b> description",
}

const run_script = async () => {
  try {
    await uploadToAnchor({
      episode: testEpisodeData,
      audioFile: "test.m4a",
      debug: true,
      publish: false,
    })
  } catch (error) {
    console.log("🚨 error uploading to Anchor", error)
    process.exit()
  }
}

run_script()