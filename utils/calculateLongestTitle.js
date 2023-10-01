
const _ = require('lodash');
const CustomError = require('../errors/parentErrorClass');
function calculateLongestTitle(blogs){
    const A = [1,2,4,5]

    if(!(Array.isArray(blogs))){
        
        throw new CustomError(`from calculateInvalid Data Structure! You did not provide an array of blogs. Instead you provided ${typeof(blogs)} type Data Structure`,400)
    }
    const strings = _.map(blogs,'title')
    const longestString = _.maxBy(strings, string => _.size(string));

    const blogWithLongestTitle = _.filter(blogs,_.iteratee({"title":longestString}))
    return blogWithLongestTitle
}

module.exports = {calculateLongestTitle}