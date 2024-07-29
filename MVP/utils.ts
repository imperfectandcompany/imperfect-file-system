/** src/utils.ts **/

// set the token cookies for the user
export const setUserToken = (token: string) => {
  const d = new Date();
  d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie =
    "IGSUPPORT=" + token + ";" + expires + ";path=/";
  document.cookie = "IGSUPPORT_=1;" + expires + ";path=/";
}

 // return the token from the session storage
 export const getToken = () => {
  const getCookieValue = (name: string) =>
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";
  if(getCookieValue('IGSUPPORT_') === "1"){
    if(getCookieValue('IGSUPPORT') !== "1"){
      return getCookieValue('IGSUPPORT');
    } else{
      return false;
    }
  } else {
    return false;
  }
}

  // remove the token and user from the session storage
  export const removeUserToken = async () => {
    //update and or create cookies
    let expires = "expires=expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie =
      "IGSUPPORT=1;" +
      expires +
      ";path=/";
    document.cookie = "IGSUPPORT_=1;" + expires + ";path=/";
    const token = getToken();
    if(!token){
      console.log('Removed Token from frontend');
      return true;
    } else {
      console.log('Could not remove token from frontend (removeUserToken() in utils.ts)');
      return true;
    }
  }  
  

export const removeLoginSession = async (): Promise<boolean> => {
  try {
    const backendRemoved = await deleteToken();
    if (!backendRemoved) {
      throw new Error("Failed to remove backend session.");
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const deleteToken = async (): Promise<boolean> => {
  const token = getToken();
  if (!token) {
    console.error("Token does not exist in frontend! Cannot delete token in backend.");
    return false;
  }

  try {
    const response = await fetch("https://api.imperfectgamers.org/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization": `${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to logout from backend.");
    }

    return true;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return false;
  }
};