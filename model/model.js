var mongoose = require('mongoose');
 
var imageSchema = new mongoose.Schema({
    title: String,
    content: String,
    heading:String,
   imageUrl: String
});
 
module.exports = new mongoose.model('Image', imageSchema);