const express = require('express');
const { exec } = require('child_process');
const { calculateStartAndEndIndexes } = require('./utils/pagination');
const _ = require('lodash');
const { calculateLongestTitle } = require('./utils/calculateLongestTitle');
const { containsPrivacy, calculateBlogsThatContainWordPrivacy } = require('./utils/containsPrivacy');
const { getUniqueBlogTitles } = require('./utils/uniqueBlogTitles');
const { blogSearch } = require('./utils/blogSearch');
const CustomError = require('./errors/parentErrorClass');
const { checkIfConnectionProblem } = require('./errors/checkIfConnectionProblem');
const { fetchDataMemo } = require('./memoization/caching');

const app = express();
const port = 5000;

const curlCommand = 'curl';
const url = 'https://intent-kit-16.hasura.app/api/rest/blogs';
const header = 'x-hasura-admin-secret: 32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6';

app.get('/api/blog-stats', async(req, res) => {
    

    try {
        const defaultPage= 1  
    const defaultPerPage = 10
    const page = Number(req.query.page) || defaultPage
    const limit = Number(req.query.limit) || defaultPerPage
    const keyword = 'privacy'
    
    
    // ! pagination switch
    const paginate = true
        const child = exec(`${curlCommand} -X GET ${url} -H "${header}"`, async(error, stdout, stderr) => {

            console.log(req.url)

            const memoData =  await fetchDataMemo(req.url)

            console.log(memoData.blogs.length,'pending')


          
            const jsonRes = memoData

            


            checkIfConnectionProblem(JSON.parse(stdout))
            
            
            
            let start = calculateStartAndEndIndexes(jsonRes.blogs,page,limit).startIndex
            let end = calculateStartAndEndIndexes(jsonRes.blogs,page,limit).endIndex
            if (error) {
          console.log(`cURL error: ${error}`);
        }
        
        const longestBlogTitle = calculateLongestTitle([...jsonRes.blogs])
        const blogsWithPrivacyWord = calculateBlogsThatContainWordPrivacy([...jsonRes.blogs],keyword)
    
        // ! try calling getUniqueBlogTitles([jsonRes.blogs]) it will throw 'You have provided 2D array bro' Error
        const uniqueBlogTitles = getUniqueBlogTitles(jsonRes.blogs)
      
        const responseData = {
    
            // ! paginate only when pagination switch is on (pagination = true)
          cURLResponse: {blogs :  [...jsonRes.blogs].slice(paginate ? start : 0,paginate?end : jsonRes.blogs.length-1), totalBlogs:_.size([...jsonRes.blogs]),longestTitle:longestBlogTitle,
            privacyWordContainingBlogs  : blogsWithPrivacyWord,
            uniqueBlogTitles
        },
          cURLErrorOutput: stderr
        };

        child.on('error', (err) => {
            console.log(err)
            console.error(`Error running cURL: ${err}`);
          });
    
        res.json(responseData.cURLResponse);
      });
    } catch (error) {
        
        res.json({error:error.message,errorCode : error.errorCode,errorType:error.type})
    }

   
   
  

});


// ! search route
app.get('/api/blog-search', (req, res) => {

    const defaultPage= 1  
    const defaultPerPage = 10
    const page = Number(req.query.page) || defaultPage
    const limit = Number(req.query.limit) || defaultPerPage
    const query = req.query.query
    
    
    // ! pagination switch
    const paginate = false 
    
  
    const child = exec(`${curlCommand} -X GET ${url} -H "${header}"`, (error, stdout, stderr) => {
        const jsonRes = JSON.parse(stdout)
        const searchResults = blogSearch([...jsonRes.blogs],query)
        console.log(searchResults)
        // console.log(jsonRes)
        let start = calculateStartAndEndIndexes(jsonRes.blogs,page,limit).startIndex
        let end = calculateStartAndEndIndexes(jsonRes.blogs,page,limit).endIndex
    if (error) {
      console.error(`cURL error: ${error}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    

    const responseData = {

        // ! paginate only when pagination switch is on (pagination = true)
      cURLResponse: {
        searchResults,totalSearchResults : searchResults.length
    },
      cURLErrorOutput: stderr
    };

    res.json(responseData.cURLResponse);
  });

  child.on('error', (err) => {
    console.error(`Error running cURL: ${err}`);
    res.status(500).json({ error: 'Internal Server Error' });
  });

});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
