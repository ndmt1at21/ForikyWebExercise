export const timout = async function (miliseconds: number) {
   return new Promise(function (_, reject) {
      setTimeout(
         () =>
            reject(new Error('Request take a lot of time, please try again')),
         miliseconds
      );
   });
};

export const AJAX = async function (link: string, postData?: any) {
   try {
      let reqPromise: Promise<Response> = postData
         ? fetch(link, {
              method: 'POST',
              headers: {
                 'Content-Type': 'application/json'
              },
              body: JSON.stringify(postData)
           })
         : fetch(link, {
              method: 'GET'
           });

      const res = await Promise.race([reqPromise, timout(10000)]);

      // if success, it's respone
      // else throw Error timeout
      const response = res as Response;
      if (!response.ok) throw new Error('Cannot get respone');

      const json = await response.json();
      return json.data;
   } catch (error) {
      throw error;
   }
};
