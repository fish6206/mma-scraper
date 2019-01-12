var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {
    request("https://bleacherreport.com/mma", function (err, res, body) {
        var $ = cheerio.load(body);
        var articles = [];
        $(".articleContent").each(function (i, element) {
            var head = $(this).children("a").text().trim();
            var sum = $(this).children("h3").text().trim();

            if (head && sum) {
                /*
                var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                */
                var dataToAdd = {
                    headline: headNeat,
                    summary: sumNeat
                };

                articles.push(dataToAdd);
            }
        });
        cb(articles);
    });
};

module.exports = scrape;