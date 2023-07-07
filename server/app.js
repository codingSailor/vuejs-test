const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const fs = require('fs')
const app = express()
const port = 8081
app.use(bodyParser.json({limit: "4mb"}));
app.use(cors());
app.use('/images', express.static('images'));

var keys = []
var country_details = {}

app.get('/countries', (req, res) => {
    jsonReader('./data/data.json', (err, data) => {
        if(err) {
            console.log(err);
        } else {
            keys = data["countries"]
            res.send({
                keys: keys
            })
        }
    });
})

app.get('/country/:id', (req, res) => {
    jsonReader('./data/data.json', (err, data) => {
        if(err) {
            console.log(err);
        } else {
            country_details = data['countries'][parseInt(req.params.id)]
            res.send({
                country: country_details
            })
        }
    });
})

app.post('/country', async (req, res) => {
    var countries_data = []
    var countries_name = []
    var countries_rank = []
    jsonReader('./data/data.json', (err, list) => {
        if(err) {
            console.log(err);
        } else {
            countries_data = list["countries"]
            for (var i = 0; i < countries_data.length; i++) {
                if (!countries_rank.includes(countries_data[i].rank)) {
                    countries_rank.push(countries_data[i].rank)
                }
            }
            for (var i = 0; i < countries_data.length; i++) {
                if (!countries_name.includes(countries_data[i].name)) {
                    countries_name.push(countries_data[i].name)
                }
            }
            if(countries_name.includes(req.body.name)) {
                res.send({
                    status: 'error',
                    message: 'Name Already Exists'
                })
            }
            else if(countries_rank.includes(req.body.rank)) {
                res.send({
                    status: 'error',
                    message: 'Rank Already Exists'
                })
            }else {
                let type = req.body.new_image_type.split("/");
                flag_name = req.body.name + '.' + type[1]
                newObj = {
                    name: req.body.name,
                    continent: req.body.continent,
                    flag: 'images/' + flag_name,
                    rank: req.body.rank
                }
        
                jsonReader('./data/data.json', (err, data) => {
                    if(err) {
                        console.log(err);
                    } else {
                        data.countries.push(newObj);
                        fs.writeFile('./data/data.json', JSON.stringify(data, null, 2), err => {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                });
        
                saveImage(req.body.new_image_file, flag_name)
        
                res.send({
                    status: 'success',
                    message: `${req.body.name} was registered`
                })
            }
        }
    });  
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

function jsonReader(filePath, cb) {
    fs.readFile(filePath, 'utf-8', (err, fileData) => {
        if(err) {
            return cb && cb(err)
        }
        try{
            const object = JSON.parse(fileData);
            return cb && cb(null, object);
        } catch (err) {
            return cb && cb(err);
        }
    });
}

function saveImage(baseImage, flag_name) {
    const uploadPath = "./images/";
    const localPath = `${uploadPath}/`;
    const ext = baseImage.substring(baseImage.indexOf("/")+1, baseImage.indexOf(";base64"));
    const fileType = baseImage.substring("data:".length,baseImage.indexOf("/"));
    const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
    const base64Data = baseImage.replace(regex, "");
    const rand = Math.ceil(Math.random()*1000);
    
    if(!fs.existsSync(`${uploadPath}/`)) {
        fs.mkdirSync(`${uploadPath}/`);
    }
    if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath);
    }
    fs.writeFileSync(localPath+flag_name, base64Data, 'base64');
    return {flag_name, localPath};
}

