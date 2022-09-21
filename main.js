import fs from "fs";
import puppeteer from "puppeteer";
const config = fs.readFileSync("./config.json");
const globalConfig = JSON.parse(config);
import io  from "console-read-write"
import clipboard from 'clipboardy';


(async () => {
  const browser = await puppeteer.launch({
    headless: globalConfig.browser.headless,
  });
  const context = await browser.defaultBrowserContext()
  console.info("AMAZON QUICK CREDENTIALS IS RUNNING");
  const page = await browser.newPage();
  await page.goto(globalConfig.browser.url);
  await page.waitForSelector("#awsui-input-0");
  await page.type("#awsui-input-0", globalConfig.credentials.username);

  await page.click(".awsui-button");
  await page.waitForSelector("#awsui-input-1");
  await page.type("#awsui-input-1", globalConfig.credentials.password);
  await page.click(".awsui-button-variant-primary");
  await page.waitForSelector(".awsui-form-field-label").then(() => {
    console.log("Code MAF requis");
  });
  console.info("Entrer votre code MFA :");
  let userEntryControl = new RegExp("^[0-9]*$");
  let userEntry = await io.read();
  let isValid = false;
  if (!userEntryControl.test(userEntry)) {
    console.info("Le code est inccorecte");
    while (!isValid) {
      userEntry = await io.read();
      userEntryControl.test(userEntry) ? (isValid = true) : console.info("Caractères non autorisé ! merci de saisir le code MFA ");
    }
  }
    await page.type('#awsui-input-0',userEntry)
    await page.type('#awsui-input-0',String.fromCharCode(13))
    console.info('Vérification du code')
    //  await page.waitForSelector('.awsui-alert-type-error').then(()=>{
    //   (async()=>{
    //     await page.$('.awsui-alert-type-error')
    //     console.error('Le code est incorrect veuillez réessayer') 
    //   })()
    // })
    await page.waitForSelector('#app-03e8643328913682')
    await page.click('#app-03e8643328913682').then(()=>{
      (async()=>{
        let profil = await page.$$('.instance-section') //Récupére tout les profil du compte


     

        for(let i=0; i < profil.length; i++){ // Se position sur le profil définit dans la config
          if(i === globalConfig.aws_profil.position){
            await profil[i].click()
            break
          }
        }
      
          //Overture de la popup 
          await page.waitForSelector('#temp-credentials-button')

          let profilAccess = await page.$$('#temp-credentials-button')
          setTimeout(() => {
            (async()=>{
              await profilAccess[1].click()
              await page.waitForSelector('#hover-copy-env')
              let copyCredentials = await page.$('#hover-copy-env')
              copyCredentials.click()
              await context.overridePermissions(globalConfig.browser.url, ['clipboard-read'])
              const copiedText = await page.evaluate(`(async () => await navigator.clipboard.readText())()`)
            
              console.log(copiedText)
             
            })()
          }, 8000)
        

    
   
        
     
      })()
      
      
      
    })
 
    
   
    
    
    // await page.waitForSelector('.awsui-alert-type-error').then(()=>{
    //     console.error('Le code est incorrect veuillez réessayer')
    // })

})();
