const mongooes = require('mongoose');
const Review = require('./review');
const Schema = mongooes.Schema;
const {cloudinary} = require('../cloudinary');
const opts = { toJSON: { virtuals: true}};

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});

const campgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: {type: Number, min: 0},
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: 
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
}, opts);

campgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<string><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0,30)}...</p>`;
});

campgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
    
    if (doc && doc.images) {
        for (const img of doc.images) {
          await cloudinary.uploader.destroy(img.filename);
        }
      }
})

module.exports = mongooes.model('Campground', campgroundSchema);

