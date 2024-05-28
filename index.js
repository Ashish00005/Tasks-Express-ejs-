const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    fs.readdir(`./files`, function(err, files) {
        res.render("index", { files: files });
    });
});

app.get('/file/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err, filedata) {
        if (err) {
            return res.status(404).send("File not found.");
        }
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});

app.get('/edit/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
        if (err) {
            return res.status(404).send("File not found.");
        }
        res.render('edit', { filename: req.params.filename, filedata });
    });
});

app.post('/edit', (req, res) => {
    const originalFilename = req.body.originalFilename;
    const newContent = req.body.newdetails;

    fs.writeFile(`./files/${originalFilename}`, newContent, (err) => {
        if (err) {
            return res.status(500).send("Error updating the file.");
        }
        res.redirect('/');
    });
});

app.post('/delete', (req, res) => {
    const filename = req.body.originalFilename;

    fs.unlink(`./files/${filename}`, (err) => {
        if (err) {
            return res.status(500).send("Error deleting the file.");
        }
        res.redirect('/');
    });
});

app.post('/create', (req, res) => {
    if (!req.body.title || !req.body.details) {
        return res.status(400).send("Please provide both title and details.");
    }

    const filename = req.body.title.split(' ').join('_') + '.txt';
    fs.writeFile(`./files/${filename}`, req.body.details, (err) => {
        if (err) {
            return res.status(500).send("Error creating the file.");
        }
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
