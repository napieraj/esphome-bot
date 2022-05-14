const SitemapXMLParser = require('sitemap-xml-parser');
const util = require('util')
const closest_match = require("closest-match");
const { exit } = require('process');
var Datastore = require('nedb'), db = new Datastore({ filename: './docs.db', autoload: true });

const url = 'https://esphome.io/sitemap.xml';
const sitemapXMLParser = new SitemapXMLParser(url, {delay: 3000, limit: 5});

sitemapXMLParser.fetch().then(result => {
    result.forEach(sitemapEntry => {
        path = sitemapEntry['loc'][0]
        var pathname = new URL(path).pathname;
        //console.log(pathname);
        if (pathname == "/") {
            return;
        }

        let docEntry = []
        for(element of pathname.split("/").slice(1)) {
            docEntry.push(element)
        }
        
        //console.log(docEntry);
        let isComponent = docEntry[0] == 'components' ? true : false
        let componentType = isComponent ? docEntry[1] : null
        let docName = docEntry.slice(-1)[0]
        //console.log(docName);

        var doc = { _id: pathname
        , name: docName
        , isComponent: isComponent
        , componentType: componentType
        };

        // db.insert(doc, function (err, newDocs) {
        //     console.log(newDocs)
        // });

        // Upserting a document
        db.update({ _id: pathname }, doc, { upsert: true }, function (err, numReplaced, upsert) {
            console.log('numReplaced: ' + numReplaced, ' Upsert: ' + upsert); 
        });
  

        // Find all d
        db.find({}, function (err, docs) {
            //console.log(docs);
        });

        db.find({}, { name: 1, _id: 0 }, function (err, docs) {
            console.log(docs);
        });
    });
});
