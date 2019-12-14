
if(process.env.NODE_ENV === "production"){
module.exports =  {
    GITHUB_CLIENT_ID:"557b8d28c7dccdaaba2b",
    GITHUB_CLIENT_SECRET:"ec085662e1d2d678f607c429cdf8584450a3e939",
    MONGO_URI:"mongodb://roopam:roopam123@ds127655.mlab.com:27655/gitforkers",
    SITE_URL:"http://13.232.101.11:8000"
}
}else{
    module.exports =  {
        GITHUB_CLIENT_ID:"c069234d4fec8a40baaf",
        GITHUB_CLIENT_SECRET:"b5acc026b41c2e58b17be2ac4ee5facdc10584e5",
        MONGO_URI:"mongodb://roopam:roopam123@ds127655.mlab.com:27655/gitforkers",
        SITE_URL:"http://13.232.101.11:8000"
}
    }

