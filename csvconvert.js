const fs=require("fs");
const path=require("path");
const stringify=require("csv-stringify");

function main()
{
    var logfile=fs.readFileSync("test.log",{encoding:"utf8"}).split("\n");

    var res=[];
    for (var x=0;x<logfile.length;x++)
    {
        var entryMatch=logfile[x].match(/(.{10}) .{8} (.*)/);

        if (!entryMatch)
        {
            continue;
        }

        res.push({
            date:entryMatch[1],
            name:simplifyName(entryMatch[2])
        });
    }

    writeoutCsv(res,"out.csv");
}

//given a string name, return the simplified version of it, or nothing if it
//is not the correct file type
function simplifyName(name)
{
    var extension=path.extname(name);
    if (!(extension==".mkv" || extension==".mp4"))
    {
        return "";
    }

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

main();