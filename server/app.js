const express = require('express');
const app = express();

app.get('/videos',function(request,response){
    return response.send('node application');
});

app.listen(8000);