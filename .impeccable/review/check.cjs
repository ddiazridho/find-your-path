const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
 const browser = await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const page = await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
 await page.screenshot({path:'.impeccable/review/desktop.png',fullPage:true});
 if(await page.locator('.major-card').count()!==6) throw Error('Missing majors');
 await page.getByRole('button',{name:'Design',exact:true}).click();
 if(await page.locator('.major-card').count()!==2) throw Error('Design filter');
 await page.getByRole('button',{name:'All majors',exact:true}).click();
 await page.getByRole('searchbox').fill('empathy');
 if(await page.locator('.major-card').count()!==1) throw Error('Skill search');
 await page.getByRole('searchbox').fill('no-such-major');
 if(!await page.getByText('No majors found yet').isVisible()) throw Error('Empty state');
 await page.getByRole('button',{name:'Show all majors'}).click();
 await page.getByRole('button',{name:'Preview Computer Science simulation'}).click();
 await page.locator('dialog').waitFor({state:'visible'});
 await page.screenshot({path:'.impeccable/review/popup.png'});
 await page.keyboard.press('Escape');
 if(await page.locator('dialog').isVisible()) throw Error('Escape failed');
 await page.getByRole('button',{name:'How it works'}).click();
 if(!await page.getByRole('heading',{name:'Find out by trying it out.'}).isVisible()) throw Error('How it works');
 await page.getByRole('button',{name:/explore/,exact:false}).click();
 for (const width of [390,768,1280]) {
  await page.setViewportSize({width,height:844});await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  if(overflow) throw Error(`Overflow ${width}`);
  if(width===390) await page.screenshot({path:'.impeccable/review/mobile.png',fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'Preview Architecture simulation'}).click();
 await page.screenshot({path:'.impeccable/review/popup-mobile.png'});
 await page.getByRole('button',{name:'Close preview'}).click();
 if(errors.length) throw Error(errors.join('\n'));
 console.log('Passed: six cards, category filtering, skill search, empty reset, dialogs, Escape, and no overflow at 390/768/1280.');
 await browser.close();
})();

