export const rootGrpahqlCodeMaker = (query) => {
    return `
   {
     ${query.rootTable.name} ${query.rootTable.where ? `(${query.
        rootTable.where[0].key} = ${query.rootTable.where[0].value})` : ''} {
         ${query.rootTable.fields.map((a) => {
        return '\n       ' + a.name;
    }).join(',')}

     }
   }
   `;
};
