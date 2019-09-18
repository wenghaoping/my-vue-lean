'use strict'
function Archiver() {
    let temperature = null;
    let archive = [];

    Object.defineProperty(this, 'temperature', {
        get: () => {
            console.log('get!');
            return temperature;
        },
        set: (value) => {
            temperature = value;
            archive.push({ val: temperature });
        }
    });

    this.getArchive = ()  => {
        console.log(archive);
        return archive;
    };
}

let arc = new Archiver();
console.log(arc.temperature); // 'get!'
// arc.temperature = 11;
// arc.temperature = 13;
// arc.getArchive(); // [{ val: 11 }, { val: 13 }]
