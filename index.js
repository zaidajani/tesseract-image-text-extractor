const express = require("express");
const PORT = 3000;
const upload = require("express-fileupload");
const app = express();
const Tesseract = require("tesseract.js");

app.use(upload());
app.use("/static", express.static(__dirname + "/static"));
app.use(express.json());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/image", (req, res) => {
  if (req.files.filename) {
    const file = req.files.filename;
    file.mv("./static/" + file.name).catch((err) => {
      console.log("err", err);
    });

    Tesseract.recognize(__dirname + "/static/" + file.name, "eng", {
      tessedit_create_pdf: '1'
    })
      .progress(function (p) {
        console.log("progress", p);
      })
      .then(function (result) {
        res.send(result.text)
      });
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
