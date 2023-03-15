const express = require('express');
const app = express();
const {v4 :uuidv4} = require('uuid');
const port = 3030;

//Setting view engine
app.set('view engine', 'ejs');

//telling express where to find static files
app.use(express.static('public'));

//listening on port for requests
app.listen(port, () => {
    console.log('Server connected on port: ', port);
});

//we wat ot create our first view and render it 
//we have to install ejs first and use it
//and then when rendering a page, node will auto search in the views folder 

app.get('/', (req, res) => {
    // res.render('room');
    let uuid = uuidv4();
    res.redirect(`/${uuid}`);
})

//to give each room a unique id we will use uuid pkg
//we heading to the home page we will crete a uuid for our room then get redirected to a url containing this uuid we just created 

app.get('/:roomId', (req, res) => {
    let uuid = req.params.roomId;
    res.render('room', {roomId: uuid});
})