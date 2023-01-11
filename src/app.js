const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const express = require('express')
//const forecast = require('../../weather-app/utils/forecast')

console.log(__dirname)
console.log(__filename)

const app = express()

// define paths for express config
const publicDirectoryPath = path.join(__dirname,'../public')
const viewPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlebars and view location

app.set('view engine','hbs')
app.set('views',viewPath)
 hbs.registerPartials(partialsPath)
// setup static directory to serve
app.use(express.static(publicDirectoryPath))


app.get('',(req,res)=>{
    res.render('index',{
        title : "Software",
        name : 'Kuldip Karangiya'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title:'About Me',
        name : 'K K'
    })
 })

 app.get('/help',(req,res)=>{
    res.render('help',{
        helptext: 'This is my help text',
        name : 'Kuldip'
    })
 })

// app.get('',(req,res)=>{
//     res.send('Hello Express')
// })

// app.get('/help',(req,res)=>{
//     res.send([{
//         name:'kuldip'
//     },{
//         name : 'karangiya'
//     }])
// })
// app.get('/about',(req,res)=>{
//     res.send('<h1>About</h1>')  
// })

// app.get('/weather',(req,res)=>{
//     res.send({
//         forecast:'It is raining',
//         location:'India'
//     }
//     )
// })

// app.get('/weather', (req, res) => {
//     if (!req.query.address) {
//         return res.send({
//             error: 'You must provide an address!'
//         })
//     }

//     res.send({
//         forecast: 'It is snowing',
//         location: 'Philadelphia',
//         address: req.query.address
//     })
// })


app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location }) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})


app.get('/products',(req,res)=>{
    if(!req.query.search){
    res.send({
        error : 'You must provide search term'
    })    
    }

    console.log(req.query.search)
    res.send({
        products:[]
        
    })
})


app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'kuldip',
        errorMessage: 'Page not found.'
    })
})

app.listen(3000,()=>{
    console.log('server is on')
})