const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const Twit = require('twit');
const T = new Twit({
  consumer_key: "Qy0YdA1OoHevI4jvF9Ou2l4zp",
  consumer_secret: "U2ceb7ilFJqb5c9dJRLG34bbdjN88Qo3RwUzvTG6VPMJCNx1mO",
  access_token: "1128149585589751808-WLKkm2bS3xALBLz1EeuUMDQkv2uQM2",
  access_token_secret: "0XeFjoegnGZakDHsoXnlWghomRPlgwwzCPpPTLAQzXFv7",
})
var htmlData = [];


app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index');

})

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/", async function (req,res) {
    try{
        var name = req.body.handle;
        console.log(name);
        result = await twet(name);
        console.log("The thing above is val");
        setTimeout(render, 15000, res);
    }
    catch(error){
        console.log(error)
    }
    
})

function render(res){
    res.render('new',{array: htmlData});
    console.log("HOORAYY!!!")
}

app.post("/twitter", function (req,res){
    res.render('new', {array: htmlData})
})


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})





var twet = async function (nam) {
    try{
        let count = 0;
        let allTweets = {};
        let topTweets = {};
        getIt(); 
        async function getIt(){
            try{
                T.get('users/show', {screen_name: nam}, (err, data, response) => {
                    if (err) {
                        console.log(err)
                    } 
                    else {
                        status_count = data.statuses_count;
                        
                        repeats = Math.ceil(status_count/200);

                        if(repeats > 16){
                        repeats = 16
                        }
                        
                        doIt(data.status.id, nam);
                        
                    }
                });
            }
            catch(error){
                console.log(error)
            }
        }



        async function doIt(ids, name){
            try{
                T.get('statuses/user_timeline', {screen_name: name,count: 200, tweet_mode: "extended", max_id: ids, include_rts: true, exclude_replies: false }, (err,data) =>{
                    if (err){
                        console.log(err)
                    }
                    else{
                        count += 1;
                        console.log(count);
                        for(var j in data){
                            if(typeof data[j] !== "undefined"){
                                allTweets[data[j].id_str] = data[j].favorite_count;
                            }
                        }
                        //testing
                        if(count < repeats){
                            doIt(data[data.length-1].id, name);
                        }
                        else{
                            sortIt(allTweets, topTweets,10);
                        }
                    }
                    
                });
            }
            catch(error){
                console.log(error)
            }
        }

        async function sortIt(obj, newObj, times){
            try{
                for(var j=0; j < times; j++){
                    let likesArray = Object.values(obj);
                    let tweetArray = Object.keys(obj);
                    let max = 0
                    let num = 0
                    for(var i=0; i < likesArray.length; i++){
                        if(likesArray[i] >= max){
                            max = likesArray[i];
                            num = i
                        }
                    }
                    tw = tweetArray[num];
                    newObj[tw] = max;
                    delete obj[tw]
                }
                embed(newObj)
            }
            catch(error){
                console.log(error)
            }
        }
        async function embed(obj){
            try{
                let i = 0;
                console.log(obj)
                let tweetIdArray = Object.keys(obj);
                console.log(tweetIdArray + "\n/////////////////////////////////////////////////////////////////////");
                embedTweet(tweetIdArray[i])
                function embedTweet(str){
                    T.get("statuses/oembed", {id: str, omit_script: true}, function (err,data){
                        if(err){
                            console.log(err)
                            //Promise.reject("Nothing");
                        }
                        else{
                            i++;
                            htmlData.push(data.html)
                            if (i < tweetIdArray.length){
                                embedTweet(tweetIdArray[i]);
                                
                            }
                            else{
                                console.log("Hello there")
                                console.log(htmlData)
                                return htmlData;

                                
                            }

                        }
                    })
                }

            }
            catch(error){
                console.log(error)
            }
        }

    }
    catch(error){
        console.log(error)
    }

}
