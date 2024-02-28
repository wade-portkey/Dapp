 (()=>{
   try {
     if(!window.opener) window.opener = {}
     window.opener.postMessage = obj => {
         bgt_postMessage(obj);
//         window.dispatchEvent('message', obj);
     };
   } catch (error) {
     alert(JSON.stringify(error));
   }
 })()
