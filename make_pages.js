const fs = require('fs');
const pages = ['Work', 'Diesel', 'Petrol', 'Labour', 'Ration', 'Extra', 'CashRegister'];
pages.forEach(p => {
    fs.writeFileSync(`src/pages/${p}.tsx`, `export const ${p} = () => <div className="p-6"><h2>${p} Module</h2><p>Coming soon...</p></div>;\n`);
});
