const CustomError = require("./parentErrorClass")

const checkIfValidDatastructure = (blogs)=>{

    if(Array.isArray(blogs)){
      
        if(Array.isArray(blogs[0])){
            throw new CustomError(`You have provided a 2D array bro! Please use spread Operator like this : [...jsonRes.blogs]`,400)
        }
    }
    if(!(Array.isArray(blogs))){
        
        throw new CustomError(`Invalid Data Structure! You did not provide an array of blogs. Instead you provided ${typeof(blogs)} type Data Structure`,400)
    }
}

module.exports = {checkIfValidDatastructure}