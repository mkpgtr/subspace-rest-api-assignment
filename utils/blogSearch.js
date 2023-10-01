const _ = require('lodash')
const blogSearch = (blogs,query)=>{

    console.log(query)
    const matchingBlogs = _.filter(blogs,blog => _.includes(blog.title?.toLowerCase(),query?.toLowerCase()))

    return matchingBlogs;

}

module.exports = {blogSearch}