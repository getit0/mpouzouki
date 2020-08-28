const axios  = require('axios');
const seed   = require('../../../utils/save-seed.js');


// Once a googel sheet is "published to the web" we can access its JSON
// via a URL of this form. We just need to pass in the ID of the sheet
// which we can find in the URL of the document.
//https://spreadsheets.google.com/feeds/list/1fRuEqt1XF4LxTlDIGjvtTm_A_lgQmFEZI4j8vRVmTG4/1/public/full?alt=json
//https://spreadsheets.google.com/feeds/list/${sheetID}/od6/public/values?alt=json
const sheetID = "1fRuEqt1XF4LxTlDIGjvtTm_A_lgQmFEZI4j8vRVmTG4";
const googleSheetUrl = `https://spreadsheets.google.com/feeds/list/${sheetID}/1/public/values?alt=json`;

module.exports = () => {
  return new Promise((resolve, reject) => {

    console.log(`Requesting data from ${googleSheetUrl}`);

    axios.get(googleSheetUrl)
      .then(response => {

        // massage the data from the Google Sheets API into
        // a shape that will more convenient for us in our SSG.
        var data = {
          "East": [],
          "West": []
        };
        response.data.feed.entry.forEach(item => {
          data[item.gsx$conference.$t].push({
            "name": item.gsx$name.$t,
            "team": item.gsx$team.$t
          })
        });

        // stash the data locally for developing without
        // needing to hit the API each time.
        seed(JSON.stringify(data), `${__dirname}/../dev/sheet.json`);

        // resolve the promise and return the data
        resolve(data);

      })

      // uh-oh. Handle any errrors we might encounter
      .catch(error => {
        console.log('Error :', error);
        reject(error);
      });
  })
}
