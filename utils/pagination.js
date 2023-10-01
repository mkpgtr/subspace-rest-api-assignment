const CustomError = require("../errors/parentErrorClass");

function calculateStartAndEndIndexes(blogs, page, limit) {

    if(!blogs){
        throw new CustomError('received no blogs to paginate! Either there is no resource on server or there is a problem connecting to server. PLease also check whethere the x-hasura-admin-secret was provided correctly or not ',404)
    }
    if (!Array.isArray(blogs) || typeof page !== 'number' || typeof limit !== 'number') {
      throw new Error('Invalid input');
    }
  
    // Calculate the total number of items
    const totalItems = blogs.length;
  
    // Calculate the start index for the given page
    const startIndex = (page - 1) * limit;
  
    // Calculate the end index for the given page
    const endIndex = Math.min(startIndex + limit - 1, totalItems - 1);
  
    return {
      startIndex,
      endIndex,
    };
  }
  
  // Example usage:
  const blogs = Array(400).fill('Product'); // An array of 400 blogs
  const page = 2;
  const limit = 10;
  
  const { startIndex, endIndex } = calculateStartAndEndIndexes(blogs, page, limit);
  console.log(`Page ${page}: Start Index - ${startIndex}, End Index - ${endIndex}`);
  

  module.exports = {calculateStartAndEndIndexes}