const fs = require('fs');
const html = fs.readFileSync('docs/keeptrip-app-staging.web.app-20260415T131035.html', 'utf8');
const searchStr = 'window.__LIGHTHOUSE_JSON__ = ';
const idx = html.indexOf(searchStr);
if (idx !== -1) {
  const start = idx + searchStr.length;
  // find the end, usually </script>
  let end = html.indexOf(';</script>', start);
  if (end === -1) end = html.indexOf('</script>', start);
  const jsonStr = html.slice(start, end);
  try {
    const data = JSON.parse(jsonStr);
    const lcp = data.audits['largest-contentful-paint'];
    const lcpElement = data.audits['largest-contentful-paint-element'];
    console.log('Score:', data.categories.performance.score);
    console.log('LCP Time:', lcp.displayValue);
    if (lcpElement && lcpElement.details && lcpElement.details.items) {
      console.log('LCP Element:', lcpElement.details.items[0].node.snippet);
    }
    console.log('TBT:', data.audits['total-blocking-time'].displayValue);
  } catch(e) {
    console.error('Error parsing JSON:', e);
  }
}
