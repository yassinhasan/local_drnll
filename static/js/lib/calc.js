// tfqeet
function Tafgeet(digit) {
    var currency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "SDG";

    //Split fractions
    var splitted = digit.toString().split(".");
    this.fraction = 0;
    if (splitted.length > 1) {
        var fraction;
        if (splitted[1].length > 1) {
            fraction = parseInt(splitted[1]);
            if (fraction >= 1 && fraction <= 99) {
                this.fraction = splitted[1].length === 1 ? fraction * 10 : fraction;
            } else {
                //trim it
                var trimmed = Array.from(splitted[1]);
                this.fraction = "";
                for (var index = 0; index < this.currencies[currency].decimals; index++) {
                    this.fraction += trimmed[index];
                }
            }
        } else {
            this.fraction = parseInt(splitted[1]);
        }
    }
    this.digit = splitted[0];
    this.currency = currency;
}

Tafgeet.prototype.parse = function () {
    var serialized = [];
    var tmp = [];
    var inc = 1;
    var count = this.length();
    var column = this.getColumnIndex();
    if (count >= 16) {
        console.error("Number out of range!");
        return;
    }
    //Sperate the number into columns
    Array.from(this.digit.toString()).reverse().forEach(function (d, i) {
        tmp.push(d);
        if (inc == 3) {
            serialized.unshift(tmp);
            tmp = [];
            inc = 0;
        }
        if (inc == 0 && count - (i + 1) < 3 && count - (i + 1) != 0) {
            serialized.unshift(tmp);
        }
        inc++;
    });

    // Generate concatenation array
    var concats = []
    for (i = this.getColumnIndex(); i < this.columns.length; i++) {
        concats[i] = " و";
    }

    //We do not need some "و"s check last column if 000 drill down until otherwise
    if (this.digit > 999) {
        if (parseInt(Array.from(serialized[serialized.length - 1]).join("")) == 0) {
            concats[parseInt(concats.length - 1)] = ""
            for (i = serialized.length - 1; i >= 1; i--) {
                if (parseInt(Array.from(serialized[i]).join("")) == 0) {
                    concats[i] = ""
                } else {
                    break;
                }
            }
        }
    }

    var str = "";
    str += "فقط ";

    if (this.length() >= 1 && this.length() <= 3) {
        str += this.read(this.digit);
    } else {
        for (i = 0; i < serialized.length; i++) {
            var joinedNumber = parseInt(serialized[i].reverse().join(""));
            if (joinedNumber == 0) {
                column++;
                continue;
            }
            if (column == null || column + 1 > this.columns.length) {
                str += this.read(joinedNumber);
            } else {
                str += this.addSuffixPrefix(serialized[i], column) + concats[column];
            }
            column++;
        }
    }

    if (this.currency != "") {
        if (this.digit >= 3 && this.digit <= 10) {
            str += " " + this.currencies[this.currency].plural;
        } else {
            str += " " + this.currencies[this.currency].singular;
        }
        if (this.fraction != 0) {
            if (this.digit >= 3 && this.digit <= 10) {
                str +=
                    " و" +
                    this.read(this.fraction) +
                    " " +
                    this.currencies[this.currency].fractions;
            } else {
                str +=
                    " و" +
                    this.read(this.fraction) +
                    " " +
                    this.currencies[this.currency].fraction;
            }
        }
    }

    str += " لا غير";
    return str;
};

Tafgeet.prototype.addSuffixPrefix = function (arr, column) {
    if (arr.length == 1) {
        if (parseInt(arr[0]) == 1) {
            return this[this.columns[column]].singular;
        }
        if (parseInt(arr[0]) == 2) {
            return this[this.columns[column]].binary;
        }
        if (parseInt(arr[0]) > 2 && parseInt(arr[0]) <= 9) {
            return (
                this.readOnes(parseInt(arr[0])) +
                " " +
                this[this.columns[column]].plural
            );
        }
    } else {
        var joinedNumber = parseInt(arr.join(""));
        if (joinedNumber > 1) {
            return this.read(joinedNumber) + " " + this[this.columns[column]].singular;
        } else {
            return this[this.columns[column]].singular;
        }
    }
};

Tafgeet.prototype.read = function (d) {
    var str = "";
    var len = Array.from(d.toString()).length;
    if (len == 1) {
        str += this.readOnes(d);
    } else if (len == 2) {
        str += this.readTens(d);
    } else if (len == 3) {
        str += this.readHundreds(d);
    }
    return str;
};

Tafgeet.prototype.readOnes = function (d) {
    if (d == 0) return;
    return this.ones["_" + d.toString()];
};

Tafgeet.prototype.readTens = function (d) {
    if (Array.from(d.toString())[1] === "0") {
        return this.tens["_" + d.toString()];
    }
    if (d > 10 && d < 20) {
        return this.teens["_" + d.toString()];
    }
    if (d > 19 && d < 100 && Array.from(d.toString())[1] !== "0") {
        return (
            this.readOnes(Array.from(d.toString())[1]) +
            " و" +
            this.tens["_" + Array.from(d.toString())[0] + "0"]
        );
    }
};

Tafgeet.prototype.readHundreds = function (d) {
    var str = "";
    str += this.hundreds["_" + Array.from(d.toString())[0] + "00"];

    if (
        Array.from(d.toString())[1] === "0" &&
        Array.from(d.toString())[2] !== "0"
    ) {
        str += " و" + this.readOnes(Array.from(d.toString())[2]);
    }

    if (Array.from(d.toString())[1] !== "0") {
        str +=
            " و" +
            this.readTens(
                (Array.from(d.toString())[1] + Array.from(d.toString())[2]).toString()
            );
    }
    return str;
};

Tafgeet.prototype.length = function () {
    return Array.from(this.digit.toString()).length;
};

Tafgeet.prototype.getColumnIndex = function () {
    var column = null;
    if (this.length() > 12) {
        column = 0;
    } else if (this.length() <= 12 && this.length() > 9) {
        column = 1;
    } else if (this.length() <= 9 && this.length() > 6) {
        column = 2;
    } else if (this.length() <= 6 && this.length() >= 4) {
        column = 3;
    }
    return column;
};

Tafgeet.prototype.ones = {
    _1: "واحد",
    _2: "ٱثنين",
    _3: "ثلاثة",
    _4: "أربعة",
    _5: "خمسة",
    _6: "ستة",
    _7: "سبعة",
    _8: "ثمانية",
    _9: "تسعة"
};

Tafgeet.prototype.teens = {
    _11: "أحد عشر",
    _12: "أثني عشر",
    _13: "ثلاثة عشر",
    _14: "أربعة عشر",
    _15: "خمسة عشر",
    _16: "ستة عشر",
    _17: "سبعة عشر",
    _18: "ثمانية عشر",
    _19: "تسعة عشر"
};

Tafgeet.prototype.tens = {
    _10: "عشرة",
    _20: "عشرون",
    _30: "ثلاثون",
    _40: "أربعون",
    _50: "خمسون",
    _60: "ستون",
    _70: "سبعون",
    _80: "ثمانون",
    _90: "تسعون"
};
Tafgeet.prototype.hundreds = {
    _100: "مائة",
    _200: "مائتين",
    _300: "ثلاثمائة",
    _400: "أربعمائة",
    _500: "خمسمائة",
    _600: "ستمائة",
    _700: "سبعمائة",
    _800: "ثمانمائة",
    _900: "تسعمائة"
};
Tafgeet.prototype.thousands = {
    singular: "ألف",
    binary: "ألفين",
    plural: "ألآف"
};
Tafgeet.prototype.milions = {
    singular: "مليون",
    binary: "مليونين",
    plural: "ملايين"
};
Tafgeet.prototype.bilions = {
    singular: "مليار",
    binary: "مليارين",
    plural: "مليارات"
};
Tafgeet.prototype.trilions = {
    singular: "ترليون",
    binary: "ترليونين",
    plural: "ترليونات"
};
Tafgeet.prototype.columns = ["trilions", "bilions", "milions", "thousands"];

Tafgeet.prototype.currencies = {
    SDG: {
        singular: "جنيه سوداني",
        plural: "جنيهات سودانية",
        fraction: "قرش",
        fractions: "قروش",
        decimals: 2
    },
    SAR: {
        singular: "ريال سعودي",
        plural: "ريالات سعودية",
        fraction: "هللة",
        fractions: "هللات",
        decimals: 2
    },
    QAR: {
        singular: "ريال قطري",
        plural: "ريالات قطرية",
        fraction: "درهم",
        fractions: "دراهم",
        decimals: 2
    },
    AED: {
        singular: "درهم أماراتي",
        plural: "دراهم أماراتية",
        fraction: "فلس",
        fractions: "فلوس",
        decimals: 2
    },
    EGP: {
        singular: "جنيه مصري",
        plural: "جنيهات مصرية",
        fraction: "قرش",
        fractions: "قروش",
        decimals: 2
    },
    USD: {
        singular: "دولار أمريكي",
        plural: "دولارات أمريكية",
        fraction: "سنت",
        fractions: "سنتات",
        decimals: 2
    },
    AUD: {
        singular: "دولار أسترالي",
        plural: "دولارات أسترالية",
        fraction: "سنت",
        fractions: "سنتات",
        decimals: 2
    },
    TND: {
        singular: "دينار تونسي",
        plural: "دنانير تونسية",
        fraction: "مليم",
        fractions: "مليمات",
        decimals: 3
    },
    TRY: {
        singular: "ليرة تركية",
        plural: "ليرات تركية",
        fraction: "قرش",
        fractions: "قروش",
        decimals: 2
    }
};

let totalVal = 0, creditVal = 0, qitafVal = 0, arbahiVal = 0, rajhiVal = 0, onlineVal = 0, mwzna1Val = 0, mwzna2Val = 0
let totalTextVal = 0
let cashTextVal = 0
let spanTextVal = 0


let total = document.getElementById("total")
let credit = document.getElementById("credit")
let arbahi = document.getElementById("arbahi")
let qitaf = document.getElementById("qitaf")
let rajhi = document.getElementById("rajhi")
let online = document.getElementById("online")
let mwzna1 = document.getElementById("mwzna1")
let mwzna2 = document.getElementById("mwzna2")
let totalText = document.querySelector(".total-text")
let cashText = document.querySelector(".cash-text")
let spanText = document.querySelector(".span-text")



total.addEventListener("input", e => {
    totalVal = parseFloat(e.target.value == "" ? 0 : e.target.value)
    calc()
})
credit.addEventListener("input", e => {
    creditVal = parseFloat(e.target.value == "" ? 0 : e.target.value)
    calc()
})
arbahi.addEventListener("input", e => {
    arbahiVal = parseFloat(e.target.value == "" ? 0 : e.target.value)
    calc()
})
qitaf.addEventListener("input", e => {
    qitafVal = parseFloat(e.target.value == "" ? 0 : e.target.value)
    calc()
})
rajhi.addEventListener("input", e => {
    rajhiVal = parseFloat(e.target.value == "" ? 0 : e.target.value)
    calc()
})
online.addEventListener("input", e => {
    onlineVal = parseFloat(e.target.value == "" ? 0 : e.target.value)
    calc()
})

mwzna1.addEventListener("input", e => {
    mwzna1Val = parseFloat(eval(e.target.value) == "" ? 0 :eval( e.target.value))
    calc(true)

})

mwzna2.addEventListener("input", e => {
    mwzna2Val = parseFloat(eval(e.target.value) == "" ? 0 :eval( e.target.value))
    calc(true)
})


let clearBtn = document.querySelector(".clear-btn")
clearBtn.addEventListener("click", e => {
    total.focus()
    totalText.innerHTML = ""
    cashText.innerHTML = ""
    spanText.innerHTML = ""

})




const calcModal = document.getElementById('calcModal')

calcModal.addEventListener('shown.bs.modal', () => {
    total.focus()
})



function calc(mwzna = false)
{

    netSpan= parseFloat(mwzna1Val + mwzna2Val).toFixed(2)
    netTotal = parseFloat(totalVal - (creditVal + qitafVal + arbahiVal + rajhiVal + onlineVal)).toFixed(2)
    let oldTotal = netTotal.split(".")
    let spanSplit = netSpan.split(".")
    let leftTotal = oldTotal[0]
    netCash = Math.round(totalVal - (creditVal + qitafVal + arbahiVal + rajhiVal + onlineVal + mwzna1Val + mwzna2Val))
    if(mwzna == true)
        {
            netTotal = leftTotal+"."+spanSplit[1]
        }


    totalText.innerHTML = netTotal + "<small> S.R </small>"
    cashText.innerHTML = netCash + "<small> S.R </small>"

    spanText.innerHTML = netSpan + "<small> S.R </small>"
  
    //   new Tafgeet(netSpan, 'SAR').parse();  
}
let netTotal =0
let netCash = 0
let netSpan = 0
let linkUrl = ""
let totalWithoutComma =""
let totalHellah =""
let cashWithoutComma =""
let cashHellah =""
let spanWithoutComma =""
let spanHellah =""
let cashTafqeet = ""
let spanTafqeet = ""

function addTextToImage(imagePath, netTotal,netCash,netSpan) {
    var circle_canvas = document.getElementById("canvas2");
    var context = circle_canvas.getContext("2d");
    let dateNow = getTimeFormatting(864e5).time
   let newDatenow =  dateNow.split(",")
    let customDay = newDatenow[0].split("/")
    let calcDay = customDay[0]
    let calcMonth = customDay[1]
    let calcYear = customDay[2]

    var arabicDays = days[new Date(Date.now() - 864e5).getDay()];
   

    if(netTotal != 0)
    {
        let newNettotal = (netTotal+"").split(".")
        totalWithoutComma = newNettotal[0]
        totalHellah = newNettotal[1]
    }
    if(netCash != 0)
    {

        cashWithoutComma = netCash
        cashTafqeet = new Tafgeet(netCash, 'SAR').parse()
        cashHellah = "-"
    }
    if(netSpan != 0)
    {
        let newNetspam = (netSpan+"").split(".")
        spanWithoutComma = newNetspam[0]
        spanHellah = newNetspam[1] == "undefined" ? "" : newNetspam[1]
        spanTafqeet = new Tafgeet(netSpan, 'SAR').parse()
    }
    

    // Draw Image function
    var img = new Image(3264,1472);
    img.src = imagePath;
    let loadedImageWidth = img.width;
    let loadedImageHeight = img.height;
    // Set the canvas to the same size as the image.
    circle_canvas.width = loadedImageWidth;
    circle_canvas.height = loadedImageHeight;
    img.style.position ="relative"

    img.onload = function () {
        context.drawImage(img, 0, 0);
        // total
        context.lineWidth = 24;
        context.fillStyle = "#343a40";
        context.lineStyle = "#343a40";
        context.font = "60px sans-serif";
        context.fillText(totalWithoutComma, 1210, 300);
        context.lineWidth = 24;
        context.fillStyle = "#343a40";
        context.lineStyle = "#343a40";
        context.font = "60px sans-serif";
        context.fillText(totalHellah, 1520, 300);
        // cash
        context.lineWidth = 24;
        context.fillStyle = "#343a40";
        context.lineStyle = "#343a40";
        context.font = "60px sans-serif";
        context.fillText(cashWithoutComma, 2230, 570);
        context.lineWidth = 24;
        context.fillStyle = "#343a40";
        context.lineStyle = "#343a40";
        context.font = "60px sans-serif";
        context.fillText(cashHellah, 2460, 570);

        // cash tafqeet
        context.lineWidth = 24;
        context.fillStyle = "#343a40";
        context.lineStyle = "#343a40";
        context.font = "60px Aref Ruqaa, serif";
        context.direction = "rtl";
        context.fillText(cashTafqeet, 1870, 570);

     

        // span
        
        context.lineWidth = 24;
        context.fillStyle = "#343a40";
        context.lineStyle = "#343a40";
        context.font = "60px sans-serif";
        context.direction = "ltr";
        context.fillText(spanWithoutComma, 2250, 740);
        context.lineWidth = 24;
        context.fillStyle = "#343a40";
        context.lineStyle = "#343a40";
        context.font = "60px sans-serif";
        context.fillText(spanHellah, 2490, 740);
       
       // span tafqeet
       context.lineWidth = 24;
       context.fillStyle = "#343a40";
       context.lineStyle = "#343a40";
       context.font = "60px Aref Ruqaa, serif";
       context.direction = "rtl";
       context.fillText(spanTafqeet, 1870, 730);

        // add day
        context.lineWidth = 24;
        context.fillStyle = "#343a40";
        context.lineStyle = "#343a40";
        context.font = "50px sans-serif";
        context.direction = "ltr";
        context.fillText(calcDay, 1610, 918);

        // add month
        context.lineWidth = 24;
        context.fillStyle = "#343a40";
        context.lineStyle = "#343a40";
        context.font = "50px sans-serif";
        context.fillText(calcMonth, 1450, 918);

        // add yaer
        context.lineWidth = 24;
        context.fillStyle = "#343a40";
        context.lineStyle = "#343a40";
        context.font = "50px sans-serif";
        context.fillText(calcYear, 1270, 918);

        // arabic day
        context.lineWidth = 24;
        context.fillStyle = "#343a40";
        context.lineStyle = "#343a40";
        context.font = "60px Aref Ruqaa, serif";
        context.fillText(arabicDays, 2100, 920);

        linkUrl = circle_canvas.toDataURL()
        downloadCalc.style.display= "block"
    };
}  


addTextToImage("../static/images/calc.jpeg", netTotal,netCash,netSpan);

let downloadCalc = document.querySelector(".download-calc")
downloadCalc.addEventListener("click",e=>{
    e.preventDefault()
    addTextToImage("../static/images/calc.jpeg", netTotal,netCash,netSpan);
    downloadURI(linkUrl,"calc.jpeg")
})

let printCalc = document.querySelector(".print-calc")

printCalc.addEventListener("click",e=>{
    e.preventDefault()
    let w = window.innerWidth
    let h = window.innerHeight
    addTextToImage("../static/images/calc.jpeg", netTotal,netCash,netSpan);
    let windowContent = '';
    windowContent += '';
    windowContent += '<title>Print canvas</title>';
    windowContent += '';
    windowContent +=  `<img src=${linkUrl} width="100%"  style="position:relative">`;
    windowContent += '';
    windowContent += '';

    const printWin = window.open('','_self',w,h);
    printWin.document.open();
    printWin.document.write(windowContent); 

    printWin.document.addEventListener('load', function() {
        printWin.focus();
        printWin.print();
        printWin.document.close();
        printWin.close();            
    }, true);
    
})
let viewCalc = document.querySelector(".view-calc")

viewCalc.addEventListener("click",e=>{
    e.preventDefault()
    let w = window.innerWidth
    let h = window.innerHeight
    addTextToImage("../static/images/calc.jpeg", netTotal,netCash,netSpan);
    let windowContent = '';
    windowContent += '';
    windowContent += '<title>Print canvas</title>';
    windowContent += '<div style="text-align:center;margin-top:24px">';
    windowContent += `<button style='color: #fbfbfb;
    border: none;
    padding: 8px 16px;
    background: #6c757d;
    font-size: 18px;
    border-radius: 8px;
    margin-left: 16px;
    margin-bottom:16px;
    cursor: pointer;' onClick="window.close();"
    >Close</button>
    </div>
    `
    
    ;
    windowContent +=  `<div style=""><img src=${linkUrl} width="100%"  style="position:relative"></div>`;

    windowContent += '';

    const printWin = window.open('','_blank',w,h);
    printWin.document.open();
    printWin.document.write(windowContent); 

    printWin.document.addEventListener('load', function() {
        printWin.focus();  
    }, true);
    
})

total.addEventListener("blur", e => {
    addTextToImage("../static/images/calc.jpeg", netTotal,netCash,netSpan);
})
credit.addEventListener("blur", e => {
    addTextToImage("../static/images/calc.jpeg", netTotal,netCash,netSpan);
})
arbahi.addEventListener("blur", e => {
    addTextToImage("../static/images/calc.jpeg", netTotal,netCash,netSpan);
})
qitaf.addEventListener("blur", e => {
    addTextToImage("../static/images/calc.jpeg", netTotal,netCash,netSpan);
})
rajhi.addEventListener("blur", e => {
    addTextToImage("../static/images/calc.jpeg", netTotal,netCash,netSpan);
})
online.addEventListener("blur", e => {
    addTextToImage("../static/images/calc.jpeg", netTotal,netCash,netSpan);
})

mwzna1.addEventListener("blur", e => {
    addTextToImage("../static/images/calc.jpeg", netTotal,netCash,netSpan);

})

mwzna2.addEventListener("blur", e => {
    addTextToImage("../static/images/calc.jpeg", netTotal,netCash,netSpan);
})


