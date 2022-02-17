const mongoose = require('mongoose');
const campground = require('../models/campground');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} =  require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{ useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("DATABASE CONNECTED")
})
.catch(err=>{
    console.log("ERROR !");
    console.log(err);
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque excepturi debitis dolores architecto accusantium consequuntur at odio labore eveniet unde vero consequatur laborum quos reprehenderit vitae, fugiat soluta. Dignissimos, molestiae.',
            price: price,
            author: "61e90db7b986887b067dcbbb",
            geometry: {
                type: 'Point',
                coordinates: [ cities[random1000].longitude, cities[random1000].latitude ]            
            },
            images :    [
                {
                  url: 'https://res.cloudinary.com/yelpcampcloud21/image/upload/v1643049006/YelpCamp/qxpasgc66ue4obueljcy.jpg',
                  filename: 'YelpCamp/qxpasgc66ue4obueljcy'
                },
                {
                  url: 'https://res.cloudinary.com/yelpcampcloud21/image/upload/v1643049128/YelpCamp/tnqhlb3s0qeusygzamhi.jpg',
                  filename: 'YelpCamp/tnqhlb3s0qeusygzamhi'
                }
              ]
        })
        await camp.save();
    }
}
seedDB().then(()=>{
    mongoose.connection.close()
});