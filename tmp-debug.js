const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({viewport:{width:1280,height:800}});
  const userEmail = `debug-${Date.now()}@example.test`;
  const password = 'testpass';
  await page.goto('http://127.0.0.1:4173');
  await page.evaluate(async (email,password)=>{
    await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password,returnSecureToken:true})}).catch(()=>null);
  }, userEmail, password);
  await page.waitForFunction(()=>typeof window.__test_signInWithEmail === 'function');
  await page.evaluate(async (email,password)=> window.__test_signInWithEmail({ email, password }), userEmail, password);
  await page.waitForTimeout(1500);
  await page.goto('http://127.0.0.1:4173/trips');
  await page.waitForTimeout(1500);
  const addTripButton = await page.$('button:has-text("Add Trip"), button:has-text("Crear viaje"), button:has-text("Agregar viaje")');
  if (!addTripButton) {
    console.log('no add trip button'); await browser.close(); return; }
  console.log('got add trip button');
  await addTripButton.click();
  await page.waitForTimeout(1500);
  const allInputs = await page.$$('input');
  console.log('input count', allInputs.length);
  for (const input of allInputs) {
    console.log(await input.getAttribute('name'), await input.getAttribute('placeholder'), await input.inputValue());
  }
  const titleInput = await page.$('input[name="titulo"]');
  console.log('title input present? ', !!titleInput);
  await browser.close();
})();
