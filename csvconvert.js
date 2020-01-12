const fs=require("fs");
const stringify=require("csv-stringify");

const _targetLog="test.log";

//replace the name on the left with the name on the right
const _namereplace={
    "blackfoxend":"blackfox",
    "blackfoxh":"blackfox",

    "kandagawajetgirlsuncensored":"kandagawa",
    "kandagawajetgirlsuncut":"kandagawa",
    "kandagawajetgirlsuncutend":"kandagawa",

    "watashinouryokuwaheikinchidetteittayone":"watashi"
};

var _nameremove=[
    "caroletuesdaywebpaac",
    "gochuumonwausagidesukasingforyoup",
    "magiarecord",
    "sounandesuka",
    "yuruyuritenova"
];

function main()
{
    _nameremove=new Set(_nameremove);

    var logfile=fs.readFileSync(_targetLog,{encoding:"utf8"}).split("\n");

    var res=[];
    var counts={};
    for (var x=0;x<logfile.length;x++)
    {
        var entryMatch=logfile[x].match(/(.{10}) .{8} (.*)/);

        if (!entryMatch)
        {
            continue;
        }

        var simpleName=simplifyName(entryMatch[2]);

        if (_nameremove.has(simpleName))
        {
            continue;
        }

        if (_namereplace[simpleName])
        {
            simpleName=_namereplace[simpleName];
        }

        res.push({
            date:entryMatch[1],
            name:simpleName
        });

        if (counts[simpleName])
        {
            counts[simpleName]++;
        }

        else
        {
            counts[simpleName]=1;
        }
    }

    objectAlphabetPrint(counts);
    writeoutCsv(res,"out.csv");
}

//given a string name, return the simplified version of it, or nothing if it
//is not the correct file type
function simplifyName(name)
{
    return name.replace(/\[.*?\]|\.mkv|\.mp4/g,"").replace(/[^\w]|\d/g,"").toLowerCase();
}

//given data of objects with all the same keys, do a csv write out into the
//target filename. the data can have any kind of keys as long as its all the same
//keys
function writeoutCsv(data,outfile)
{
    var outstream=fs.createWriteStream(outfile,{flags:"w"});
    stringify(data,{columns:Object.keys[data[0]],header:true},(err,output)=>{
        outstream.write(output);
    });
}

//print an object and its values in key alphabetical order
function objectAlphabetPrint(dict)
{
    var keys=Object.keys(dict);
    keys.sort();

    for (var x=0;x<keys.length;x++)
    {
        console.log(`${keys[x]}: ${dict[keys[x]]}`);
    }
}

main();