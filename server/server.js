const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/native-example';

// Start a connection and provide a callback function to be invoked when a connection is made.
MongoClient.connect(url, function(err, db) {
  // Ready to interact with `db`
  // (All of the following examples would go here)
  db.collection('cars')
    .insertOne({
        make: 'Ford',
        model: 'Focus',
        year: 2017,
    })
    .then(response => {
        console.log('Inserted a car');
        const insertedCar = response.result;
    })
    .catch(console.error);

	// db.collection('cars')
  //   .findOne({ _id: '507f191e810c19729de860ea' }) // replace this for an existing object id in your collection
  //   .then(car => {
  //       console.log('Found the requested car');
  //   })
  //   .catch(console.error);

	// db.collection('cars')
  //   .find({ make: 'Ford' })
  //   .toArray()
  //   .then(cars => {
  //       console.log(`Found ${cars.length} cars`);
  //   })
  //   .catch(console.error);

	// db.collections('cars')
  //   .updateOne({ _id: '507f191e810c19729de860ea' }, { $set: { year: 2018 } })
  //   .then(response => {
  //       console.log(`Updated ${response.upsertedCount} records`);
  //   });

	// db.collection('cars')
  //   .update({ make: 'Datsun' }, { $set: { make: 'Nissan' } })
  //   .then(result => {
  //       console.log('Updated all Datsuns to be Nissans');
  //   })
  //   .catch(console.error);

  // db.collection('cars')
  //   .removeOne({ _id: '507f191e810c19729de860ea' })
  //   .then(response => {
  //       console.log('Removed a record');
  //   });

	// db.collection('cars')
  //   .remove({ make: 'Rover' })
  //   .then(result => {
  //       console.log(`Removed ${result.result.n} cars`);
  //   })
  //   .catch(console.error);

  // Remember to close the connection once you're finished.
    db.close();
});

app.get('/api/cars', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        if(err) {
            return res.status(500).send('An internal server error has occured');
        }

        db.collection('cars')
            .find()
            .then(cars => res.status(200).json(cars))
            .catch(error => res.status(500).send('An internal server error has occured'));
    });
});


app.get('/', (req, res) => {
	res.render('index');
});

app.get('*', function( req, res){
  res.status(404).send('Sorry, no page was found at this address');
});

module.exports = app;
