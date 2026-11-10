const fs = require('fs');

const files = {
  '01': '01-rides-home.html',
  '02': '02-destination-search.html',
  '03': '03-location-selection.html',
  '04': '04-ride-options.html',
  '05': '05-booking-confirmation.html',
  '06': '06-live-ride-tracking.html',
  '07': '07-skyppy-miles.html',
  '08': '08-activity.html',
  '09': '09-profile.html'
};

for (const [num, filename] of Object.entries(files)) {
  let content = fs.readFileSync(filename, 'utf8');
  const targetHash = `#screen-${num}`;
  const scriptTag = `
  <script>
    if (window === window.parent && !window.location.search.includes('standalone=true')) {
      window.location.replace('skyppy.html' + '${targetHash}');
    }
  </script>
`;
  if (!content.includes("window.location.replace('skyppy.html")) {
    content = content.replace('<head>', '<head>' + scriptTag);
    fs.writeFileSync(filename, content, 'utf8');
    console.log(`Added redirect bridge to ${filename}`);
  }
}
