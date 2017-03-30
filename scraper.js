const request = require('tinyreq');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
var Post = require('./model');
var config = require('./config/config');

const db = mongoose.connection;

const scrape = (url, selectors, context) => {
  request(url, function(err, body) {
    if (!err) {
      const $ = cheerio.load(body);
      const firstKey = Object.keys(selectors)[0];
      const items = $(selectors[firstKey]);

      items.map((item) => {
        let pageData = {};
        Object.keys(selectors).forEach(k => {
          const dataItem = $(context).eq([item]).find(selectors[k]);
          if (dataItem.length > 1) {
              let dataArray = [];
              dataItem.map((arrayItem) => {
                dataArray.push(dataItem.eq(arrayItem).text());
              });
              pageData[k] = dataArray;
          } else {
            pageData[k] = dataItem.text();
          }
        });

        new Post(pageData).save();
        // console.log(pageData);
      });

      console.log('scrapping finished. safe to disconnect');
    }
  });
}

mongoose.connect(config.db.url);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected to the db!')
  const selectors = {
    title: '.title',
    comments: '.comments',
    karma: '.score.unvoted'
  }
  const context = '.thing'
  scrape('http://reddit.com/r/overwatch', selectors, context);
});
