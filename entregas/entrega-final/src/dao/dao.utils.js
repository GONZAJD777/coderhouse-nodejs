import { StringToDate } from "../utils.js"

export function matches(query) {
    return function (elem) {
      try {
            for (const key in query) {
              if ((!elem.hasOwnProperty(key) || elem[key] !== query[key]) && 
                !(elem[key] >= query[key]['$gte'] || elem[key] <= query[key]['$lte']) && 
                !( new Date((elem[key])) >= new Date(query[key]['$gte']) || new Date((elem[key])) <= new Date(query[key]['$lte']))

                  ) 
                {
                  return false
                }
            }
            return true
        } catch (e){
          //logger.log('error',e)
        }
    }
  }
  
  export function toPOJO(obj) {
    return JSON.parse(JSON.stringify(obj))
  }