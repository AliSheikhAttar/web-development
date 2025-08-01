import apiClient from "./api-client";


interface signUpProps {
    username: string,
    email: string,
    password: string,
}
interface logInProps {
    username: string,
    password: string,
}
interface verifyEmailProps  {
    otp: string,
}


interface resetConfirmEmail {
    email: string,
}
interface resetPassword {
    password: string,
}



class UserSerive {
    createUser(user: signUpProps) {
        const controller = new AbortController();
        return apiClient.post('/authentication/register/', user, {signal: controller.signal});
    }
    logInUser(user:logInProps){
        const controller = new AbortController();
        return apiClient.post('/authentication/login/', user, {signal: controller.signal});
    }
    verifyEmail(otp :verifyEmailProps){
        const controller = new AbortController();
        console.log("verifying", otp);
        return apiClient.post('/authentication/verify-email/', otp, {signal: controller.signal});
    }

    PasswrodResetConfirm(otp :verifyEmailProps){
      const controller = new AbortController();
      console.log("verifying", otp);
      return apiClient.post('/authentication/password-reset-confirm/', otp, {signal: controller.signal});
  }

  
  ResendVerificatonEmail(email:resetConfirmEmail){
    const controller = new AbortController();
    return apiClient.post('authentication/password-reset/', email, {signal: controller.signal});
}

    UserProfileInfo(userToken:string)
    {

        return apiClient.get('/authentication/users/retrieve/', {
            headers: {
                Authorization: `Bearer ${userToken}`, 
            },
        });  
    }

  


    resetConfirmPassword(email:resetConfirmEmail){
        const controller = new AbortController();
        return apiClient.post('authentication/password-reset/', email, {signal: controller.signal});
    }
    resetPassword(password:resetPassword, param1:string, param2:string){
        const controller = new AbortController();
        return apiClient.post(`/password-reset-confirm/${param1}/${param2}`, password, {signal: controller.signal});
    }
    


    fetchAllGroups(userToken:string,params: Record<string, any>) {
        return apiClient.get('scheduling/all-groups/', {headers:{
            Authorization: `Bearer ${userToken}` ,
        },
        params,});
      }

    fetchAllSuggestionsGroups(userToken:string) {
        return apiClient.get('/scheduling/suggestions/', {
            headers:{
                Authorization: `Bearer ${userToken}` ,
            },
        });
    }

    fetchMyGroups(userToken: string,params: Record<string, any>) {
        return apiClient.get('/scheduling/', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },params,
        });
      }

      joinGroup(userToken: string, groupTitle: string) {
        return apiClient.post(
          `/groups/${groupTitle}/join/`,
          {}, // Empty body
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
      }

      cancelJoinRequest(userToken: string, groupTitle: string) {
        return apiClient.post(
          `/groups/${groupTitle}/cancel/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
      }
    
      leaveGroup(userToken: string, groupTitle: string) {
        return apiClient.post(
          `/groups/${groupTitle}/leave/`,
          {}, // Empty body
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
      }
      error_generator(error:string) {
        const controller = new AbortController();
        return apiClient.get(`trigger_${error}`,{signal: controller.signal});
      }
    
}


export default new UserSerive();