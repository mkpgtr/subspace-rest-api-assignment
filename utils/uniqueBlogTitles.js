const _ = require('lodash')
const CustomError = require('../errors/parentErrorClass')
const { checkIfValidDatastructure } = require('../errors/checkIfValidDatastructure')

const getUniqueBlogTitles = (blogs)=>{

    checkIfValidDatastructure(blogs)

   
    const titles = _.map(blogs,blog=>blog.title)


    return _.uniq(titles).length
}


module.exports = {getUniqueBlogTitles}