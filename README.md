# Asset Scraper

Extensible scraper for collecting assets from existing websites and uploading them to our onboarding and image management services.

## Getting Started

```
cd g5-asset-scraper
npm i
cp .env.TEMPLATE .env
# Fill in variables in .env file.
npm run dev
```

## API

`GET /` Heartbeat. 

`POST /` Submit a scrape request.

``` json
{
    "rootProtocol": "https",
    "locationId": 55,
    "pages": [],
    "scrapers": {
        "photos": true,
        "emails": true,
        "amenities": true,
        "phoneNumber": true,
        "social": true
    },
    "template": {
        "address": { "selector": null },
        "phone": { "selector": null },
        "email": { "selector": null },
        "amenities": { "selector": null, "slug": null } 
    },
    "config": {
        "photos": {
            "folder": "parentDir/childDir"
        }
    },
    "rootDomain": "example.com"
}
```
> `pages` is an array of website URLS and must be provided. _This tool does NOT include link discovery or a sitemap reader._

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/04b766ca2d72e54e2c60)

## Deployment

```
npm run docker:build
npm run docker:tag
npm run docker:push
```

Deploy via your favorite cloud function service.

> Don't forget to set your runtime variables!

## References

- [Cloud Run —Node.js](https://cloud.google.com/run/docs/quickstarts/build-and-deploy#node.js)