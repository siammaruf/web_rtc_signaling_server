const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback)=>{
        if (allowedOrigins.indexOf(origin) || !origin){
            callback(null, true)
        }else {
            callback(new Error('Not allowed by CORS!'))
        }
    }
}

module.exports = corsOptions