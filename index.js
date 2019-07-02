const rp = require("request-promise");
const request = require("request");
const fs = require("fs");
const cheerio = require("cheerio");

const main = "https://x.yupoo.com";
const photo_uri = "https://photo.yupoo.com";
const url = main + "/photos/soccer-2016/collections/2921008";

const gethtml = async u => {
    const html = await rp(u);
    return html;
};

gethtml(url)
    .then(html => {
        const category = cheerio(
            ".text_overflow.showheader__menuslink.showheader__currentcate",
            html
        ).text();

        cheerio(".showindex__children a.album__main", html).map((i, e) => {
            console.log(e.attribs.href);
            gethtml(main + e.attribs.href)
                .then(ihtml => {

                    //data to cheerio
                    const jersytitle = cheerio(
                        ".showalbumheader__gallerytitle",
                        ihtml
                    ).text();

                    const jersyimages = cheerio(
                        ".showalbum__children.image__main .image__imagewrap img",
                        ihtml
                    ).map((ii, ee) => {
                        let shirt_title =
                            category.trim() +
                            "_" +
                            jersytitle.trim() +
                            " " +
                            (ii + 1) +
                            ".jpg";

                        let img_url = photo_uri + ee.attribs["data-path"];

                        options = {
                            url: img_url,
                            headers: {
                                "Referer":
                                    "https://x.yupoo.com/photos/soccer-2016",
                                "User-Agent":
                                    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
                            },
                            encoding: "binary"
                        };

                        request(options, function (
                            error,
                            response,
                            body
                        ) {
                            fs.writeFile(
                                "save_images/" + shirt_title,
                                body,
                                "binary",
                                function (ferr) {
                                    if (ferr) {
                                        console.log("Couldn't write");
                                    }
                                }
                            );
                        });

                    });
                })
                .catch(ierr => {
                    console.error(ierr);
                });
        });
    })
    .catch(err => {
        console.error(err);
    });
