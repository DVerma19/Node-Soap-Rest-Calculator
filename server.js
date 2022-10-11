const {soap} = require('strong-soap');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const path = require("path")

const app = require('express')();
const port = process.env.PORT || 8000;


app.use(express.static(path.join(__dirname, "client", "build")))

// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


// Using Soap WSDL
const calc_url = 'http://www.dneonline.com/calculator.asmx?WSDL';
const word_url = 'https://www.dataaccess.com/webservicesserver/numberconversion.wso?WSDL';


const clientPromise = new Promise((resolve, reject) => (
    soap.createClient(calc_url, {}, (err, client) => err ? reject(err) : resolve(client))
));

const clientWordPromise = new Promise((resolve, reject) => (
    soap.createClient(word_url, {}, (err, client) => err ? reject(err) : resolve(client))
));

app.use(bodyParser.json())
app.use(cors());

// Rest Apis
app.get('/', (req, res) => {
    res.status(200).send('Welcome to a Simple SOAP and REST Service');
});

app.post('/add', (req, res) => (clientPromise.then(client => ({ client, requests: req.body }))
        .then(invokeAdd)
        .then(results => res.status(200).send(results))
        .catch(({ message: error }) => res.status(500).send({ error }))
    ));

app.post('/sub', (req, res) => (clientPromise.then(client => ({ client, requests: req.body }))
    .then(invokeSub)
    .then(results => res.status(200).send(results))
    .catch(({ message: error }) => res.status(500).send({ error }))
));

app.post('/mult', (req, res) => (clientPromise.then(client => ({ client, requests: req.body }))
        .then(invokeMult)
        .then(results => res.status(200).send(results))
        .catch(({ message: error }) => res.status(500).send({ error }))
));

app.post('/div', (req, res) => (clientPromise.then(client => ({ client, requests: req.body }))
    .then(invokeDiv)
    .then(results => res.status(200).send(results))
    .catch(({ message: error }) => res.status(500).send({ error }))
));

app.post('/word', (req, res) => (clientWordPromise.then(client => ({client, requests: req.body}))
    .then(invokeCel)
    .then(results => res.status(200).send(results))
    .catch(({ message: error }) => res.status(500).send({ error }))
));

const invokeAdd = ({ client, requests }) => Promise.all(requests.map(request => (
    new Promise((resolve, reject) => client.Add(request, (err, result) => (
        err ? reject(err) : resolve(result))
    ))
)));

const invokeSub = ({ client, requests }) => Promise.all(requests.map(request => (
    new Promise((resolve, reject) => client.Subtract(request, (err, result) => (
        err ? reject(err) : resolve(result))
    ))
)));

const invokeMult = ({client, requests}) => Promise.all(requests.map(request => (
    new Promise((resolve, reject) => client.Multiply(request, (err, result) => (
        err ? reject(err) : resolve(result))
    ))
)));

const invokeDiv = ({client, requests}) => Promise.all(requests.map(request => (
    new Promise((resolve, reject) => client.Divide(request, (err, result) => (
        err ? reject(err) : resolve(result))
    ))
)));

const invokeCel = ({client, requests}) => Promise.all(requests.map(request => (
    new Promise((resolve, reject) => client.NumberToWords(request, (err, result) => (
        err ? reject(err) : resolve(result)
    )))
)));

app.listen(port);