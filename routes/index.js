var express = require('express');
var router = express.Router();
var tesseract = require('node-tesseract');
var fs = require('fs');
const { exec } = require('child_process');


router.get('/ocr', function(req, res, next) {

    exec('tesseract '+ 'public/images/Section.1.1.1..JPEG' +' -l fra -psm 6', (error, stdout, stderr) => {
        if (error) {
            res.send(error);
        }

        fs.readFile('-l.txt', 'utf8', function(err, data) {
            console.log(data);
            scrutateur = "";
            if (err) {
                res.send(err);
            }
            table = data.split('\n');
            final = new Array();
            for (i=0; i<table.length; i++){
                if(!(table[i]==''||table[i]==' '||table[i]=='   ')){
                    final.push(table[i]);
                }
            }
            final.pop();
            console.log(final);
            variable = {};
            variable["$class"] = "org.eeyes.ressources.ComputePV";
            variable["code"] = final[0].substring(8, final[0].length)+":"+scrutateur;
            variable["BV"] = final[1].substring(15, final[1].length);
            variable["sectionName"] = final[0].substring(8, final[0].length);
            variable["image"] = "";
            variable["nombreElecteursInscrits"] = parseInt(final[2].split('|')[1]);
            variable["nombreSuffrageEmi"] = parseInt(final[3].split('|')[1]);
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1;
            var yyyy = today.getFullYear();

            if(dd<10) {
                dd = '0'+dd
            }

            if(mm<10) {
                mm = '0'+mm
            }

            var hour =  today.getHours();
            if(hour<10) {
                hour = '0'+hour
            }
            var minute = today.getMinutes();
            if(minute<10) {
                minute = '0'+minute
            }
            var second = today.getSeconds();
            if(second<10) {
                second = '0'+second
            }

            today = yyyy + '-' + mm + '-' + dd + 'T' + hour + ':' + minute + ':' + second;

            variable["publishedDate"] = today;
            variable["candidateVoices"] = new Array();

            for (i=5;i<final.length;i++){
                voice_temp = {};
                voice_temp["$class"] = "org.eeyes.ressources.Voices";
                tab_temp = final[i].split(" ");
                voice_temp["candidate"] = "";
                for (j=0; j<tab_temp.length-1;j++){
                    voice_temp["candidate"] = voice_temp["candidate"]+tab_temp[j];
                }
                voice_temp["voice"] = tab_temp[j];
                variable["candidateVoices"].push(voice_temp);
            }
            variable["scrutateur"] = "resource:org.eeyes.ressources.Author#"+scrutateur;

            console.log(variable);

            res.send(variable);
        });
    });
});

module.exports = router;