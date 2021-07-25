import {UserNamePasswordInput} from '../utils/UserNamePasswordInput'

export const validateRegister=(options:UserNamePasswordInput)=>{
    if (!options.email.includes("@")) {
        return  [
            {
              field: "email",
              message: "invalid email",
            },
          ]
        }
      
  
      if (options.username.length <= 2) {
        return  [
            {
              field: "username",
              message: "length must be greater than 2",
            },
          ]
        
      }

      if (options.username.includes("@")) {
        return  [
            {
              field: "username",
              message: "Can not include an @",
            },
          ] 
      }
  
      if (options.password.length <= 3) {
        return [
            {
              field: "password",
              message: "length must be greater than 3",
            },
          ]
      }

      return null
}