class CustomError extends Error {
 
    constructor(message,errorCode){
       
        super(message)
        if(errorCode===400){
            this.type = 'Bad Request' || 'unknown'
        }
        this.errorCode = errorCode
    }
}

module.exports = CustomError