const _ = require('lodash')
const CustomError = require('../errors/parentErrorClass')
const calculateBlogsThatContainWordPrivacy = (blogs,keyword)=>{
    if(!(Array.isArray(blogs))){
        
        throw new CustomError(`Invalid Data Structure! You did not provide an array of blogs. Instead you provided ${typeof(blogs)} type Data Structure`,400)
    }
    
    if(!keyword){
        // ! bad request
        throw new CustomError('empty keyword! Please enter something',400)
    }
    
    const titles = _.map(blogs,'title')
    
    const stringsContainingPrivacyArray = _.filter(titles,title=> _.includes(title.toLowerCase(),keyword.toLowerCase()))



    return stringsContainingPrivacyArray.length

    
}

module.exports = {calculateBlogsThatContainWordPrivacy}