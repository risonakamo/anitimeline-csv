const fs=require("fs");
const stringify=require("csv-stringify");
const _=require("lodash");

/*-- configuration --*/
const _targetLog="test2.log";

//replace the name on the left with the name on the right
const _namereplace={
    "blackfoxend":"blackfox",
    "blackfoxh":"blackfox",

    "kandagawajetgirlsuncensored":"kandagawa",
    "kandagawajetgirlsuncut":"kandagawa",
    "kandagawajetgirlsuncutend":"kandagawa",

    "watashinouryokuwaheikinchidetteittayone":"watashi",

    "lovelivesunshinetheschoolidolmovieovertherainbowhm":"lovelivesunshinetheschoolidolmovieovertherainbow",
    "caroletuesdayrawcxxxaac":"caroletuesdaywebpaac",

    "tsuujoukougekigazentaikougekidenikaikougekinookaasanwasukidesuka":"okaasan",
    "tsuujoukougekigazentaikougekidenikaikougekinookaasanwasukidesukaend":"okaasan"
};

var _nameremove=[
    // "caroletuesdaywebpaac",
    // "gochuumonwausagidesukasingforyoup",
    // "magiarecord",
    // "sounandesuka",
    // "yuruyuritenova"
];

const _minimumCount=4; //items with counts that are not greater than or equal to this number
                       //will not be included
/*-- end configuration --*/

function main()
{
    _nameremove=new Set(_nameremove);

    var logfile=fs.readFileSync(_targetLog,{encoding:"utf8"}).split("\n");

    var res=[];
    var counts={};
    for (var x=0;x<logfile.length;x++)
    {
        //attempt to get date and file name
        var entryMatch=logfile[x].match(/(.{10}) .{8} (.*)/);

        //skip if failed
        if (!entryMatch)
        {
            continue;
        }

        //reduce the name
        var simpleName=simplifyName(entryMatch[2]);

        //if the name is set to be excluded, skip
        if (_nameremove.has(simpleName))
        {
            continue;
        }

        //replace the name if the name is set to be replaced
        if (_namereplace[simpleName])
        {
            simpleName=_namereplace[simpleName];
        }

        //add to result
        res.push({
            date:entryMatch[1],
            name:simpleName
        });

        //increment the count
        if (counts[simpleName])
        {
            counts[simpleName]++;
        }

        else
        {
            counts[simpleName]=1;
        }
    }

    //determine which names do not have enough to meet
    //the minimum count requirement
    var minimumRemoveSet=_.reduce(counts,(r,x,i)=>{
        //if it does not meet, also remove it from the counts
        if (x<_minimumCount)
        {
            delete counts[i];
            r.add(i);
        }

        return r;
    },new Set());

    //remove all things that need to be removed from the result array
    _.remove(res,(x)=>{
        if (minimumRemoveSet.has(x.name))
        {
            return true;
        }
    });

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