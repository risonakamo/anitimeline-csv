const fs=require("fs");
const stringify=require("csv-stringify");

function main()
{
    var logfile=fs.readFileSync("test.log",{encoding:"utf8"}).split("\n");

    var res=[];
    var entryMatch=logfile[0].match(/(.{10}) .{8} (.*)\s/);

    if (!entryMatch)
    {
        return;
    }

    res.push({
        date:entryMatch[1],
        name:entryMatch[2]
    });

    console.log(res);

    // var res=[];
    // for (var x=0;x<logfile.length;x++)
    // {

    // }
}

main();