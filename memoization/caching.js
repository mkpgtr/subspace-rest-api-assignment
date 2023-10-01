const {exec} = require('child_process');
const CustomError = require('../errors/parentErrorClass');
const { checkIfConnectionProblem } = require('../errors/checkIfConnectionProblem');
const curlCommand = 'curl';
const url = 'https://intent-kit-16.hasura.app/api/rest/blogs';
const header = 'x-hasura-admin-secret: 32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6';
let memoCache = {};


// ! after one minute cache resets itself & expires
// ! only then we re-fetch from api
setInterval(() => {
    console.log('Resetting memoCache');
    memoCache = {};
  }, 60000);

// const newFetch = ()=>{
//     console.log('inside new fetch')
//     try {
//       const child =  exec(`${curlCommand} -X GET ${url} -H "${header}"`, (error, stdout, stderr) => {
//           checkIfConnectionProblem(JSON.parse(stdout))
  
//           const jsonRes = JSON.parse(stdout)

          
  
//           const responseData = {
//               cURLResponse : jsonRes.blogs
//           }
//           if (error) {
//               console.log(`cURL error: ${error}`);
//             }
      
//             child.on('error', (err) => {
//               console.log(err)
//               console.error(`Error running cURL: ${err}`);
//             });
//             // Send the JSON response

            

//             return responseData.cURLResponse
//         })  
        
      
  
//     } catch (error) {
  
//       throw new CustomError(error.message,error.errorCode,error.type)
//     }
        
//   }


const newFetch = () => {
    console.log('inside new fetch');
    return new Promise((resolve, reject) => {
      const child = exec(`${curlCommand} -X GET ${url} -H "${header}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`cURL error: ${error}`);
          reject(error);
          return;
        }
  
        try {
          checkIfConnectionProblem(JSON.parse(stdout));
          const jsonRes = JSON.parse(stdout);
          const responseData = {
            cURLResponse: jsonRes,
          };
          resolve(responseData.cURLResponse);
        } catch (error) {
          reject(error);
        }
      });
  
      child.on('error', (err) => {
        console.log(err);
        console.error(`Error running cURL: ${err}`);
        reject(err);
      });
    });
  };


const fetchDataMemo =async (urlEndpoint)=>{
    if (memoCache[urlEndpoint] !== undefined) {
        console.log('Using memoized result for', urlEndpoint);
        return memoCache[urlEndpoint];
      }




const result =  await newFetch()
  // Store the result in the cache
  memoCache[urlEndpoint] = result;

  return result;
}

module.exports = {fetchDataMemo}