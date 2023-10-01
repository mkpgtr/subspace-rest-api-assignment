const CustomError = require("./parentErrorClass")

const checkIfConnectionProblem = (payload)=>{

    if(payload.error==='invalid x-hasura-admin-secret/x-hasura-access-key')

    {
        console.log('yes connection problem')
        throw new CustomError('invalid admin secret',401,'Unauthorized')
    }
}

module.exports = {checkIfConnectionProblem}