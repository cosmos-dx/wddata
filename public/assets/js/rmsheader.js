function POSDICT(){
    const posdict = {'01':'Jammu And Kashmir','02':'Himachal Pradesh','03':'Punjab','04':'Chandigarh','05':'Uttarakhand','06':'Haryana',
    '07':'Delhi','08':'Rajasthan','09':'Uttar Pradesh','10':'Bihar','11':'Sikkim','12':'Arunachal Pradesh',
    '13':'Nagaland','14':'Manipur','15':'Mizoram','16':'Tripura','17':'Meghalaya','18':'Assam','19':'West Bengal','20':'Jharkhand',
    '21':'Odisa','22':'Chattisgarh','23':'Madhya Pradesh','24':'Gujarat','25':'Daman and Diu','26':'Dadar and Nagar Haveli',
    '27':'Maharashtra','28':'Andra Pradesh','29':'Karanataka','30':'Goa','31':'Lakshwadeep','32':'Kerala','33':'Tamil Nadu',
    '34':'Punducherry','35':'Andaman and Nicobar Island','36':'Telangana','37':'Andra Pradesh(New)', 15:true,
    'C':'COMPANY', 'P':'PERSON', 'H':'HUF', 'F':'FIRM', 'A':'(AOP)', 'T':'AOP(TRUST)','B':'(BOI)','L':'LOCAL AUTHORITY',
    'J': 'JURIDICAL PERSON', 'G':'GOVERNMENT', 'true':('Writing..','blue'), 'false':('Wrong Input','red'), }
    return posdict;}

function getAmount(qty, rate, bbv=true, b1=1, b2=0){
    var amt = 0;

    if (bbv){amt = qty*rate}
    else{amt = ((rate*b1)/(b1+b2))*qty}    // net given like 10+2
    return amt    
    }
function getDiscAmt(amt, dis){
    if (Number.isNaN(dis)){dis = 0;}
   
    var discountamount = ((amt*(100-dis))/100.0);
    return [amt-discountamount, discountamount];}

// [1, 2, 3, 4].reduce((a, b) => a + b, 0) 
// default 0 required for first number of array; otherwise raise TypeError

function getTaxAmt(amt, tax, discamt){
    var amt_discamt = amt-discamt;
    var amtaftertax = (amt_discamt*(100+tax)/100.0);
    var taxamt = amtaftertax-amt_discamt
    return [taxamt, amtaftertax] ; }
 //return ((amt-discamt)*(100+tax)/100.0)-(amt-discamt) ; }
//function amtAfterTax(amt, tax){return (amt*(100+tax)/100.0) ; } // OR NetAmt

function getBonus(bonus){
    var bbool = false; // true when bonus in Integer value; false when bonus in netvalue format like 10+2;
    var b = bonus.split("+").map(Number);
    var intbonus = 0
    var b1 = b[0]
    var b2 = b[1]
    
    if (Number.isNaN(b1)){
        b1 = 1;
        intbonus = b[0]; 
        bbool = false; }
    if (b1 === 0) {b1 = 1;
        intbonus = 0;
        bbool = true; }
    if (b2 === undefined) {b2 = 0;
        intbonus = parseInt(b[0]);
        bbool = true; }
    if (isNumeric(b[0])){
        bbool = true;
        intbonus=parseInt(b[0]);
        b1 = 1;
        b2 = 0;}    
    
    return [bbool, intbonus, b1, b2]; }

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
function getQty(qty, bonus){
    var b = getBonus(bonus);
    var b1 = b[0];
    var tqty = qty+b1;
    return tqty; }

//var enterhitcount = 0; 
//function onQtyCalculation(evt, evtidf='qty', evtnxtidf='qty'){
function onQtyCalculation(evt){
    if (typeof(recdic['grid'][idcount]) == "undefined"){
        CreateAlertDiv("Item Name Not Selected OR Page Re-Loaded !! Select Item First !! ");
        document.getElementById(idcount+'_itemsearch').value = '';
        document.getElementById(idcount+'_itemsearch').focus();
        return;
    }
   
    var rate =  parseFloat($('#'+idcount+'_rate').val());
    var qty = parseInt($('#'+idcount+'_qty').val()); //$('#'+idcount+'_qty').val(); 
    var tax = parseFloat($('#'+idcount+'_tax').html());
    var dis = parseFloat($('#'+idcount+'_dis').val());
    var rawbonus = $('#'+idcount+'_bonus').val();
    var bonuscheck = getBonus(rawbonus) 
  
    var bbool = bonuscheck[0];
    var bonus= bonuscheck[1];
    var b1 = bonuscheck[2];
    var b2 = bonuscheck[3];
    var tqty = qty+bonus;
     
    var amt = getAmount(qty, rate, bbool, b1, b2) //never add total or qty+bonus in getAmount;

    if (Number.isNaN(amt)){amt = 0}
    else{amt = amt}

    var disc_ = getDiscAmt(amt, dis); //disc_[0] << is discaount value; disc_[1] << is amount after discount
    
    var disamt = disc_[1];

    var tax_ = getTaxAmt(amt, tax, disc_[0]);
    var netamt = tax_[1]
    var netrate = netamt/qty;
    var amttot = disc_[1]
    var csgst = tax_[0]/2
    //var netrate = 
    

    $('#'+idcount+'_amt').val(amttot.toFixed(2));
    $('#'+idcount+'_netrate').html(netrate.toFixed(2));   
    
    
    recdic['grid'][idcount]['qty']=qty;
    recdic['grid'][idcount]['bbool']=bbool;
    recdic['grid'][idcount]['bonus']=bonus;
    recdic['grid'][idcount]['tqty']=tqty;
    recdic['grid'][idcount]['rate']=rate;
    recdic['grid'][idcount]['dis']=dis;
    recdic['grid'][idcount]['tax']=tax;
    recdic['grid'][idcount]['amt']=amt;  
    recdic['grid'][idcount]['tdisamt']=disc_[0];  
    recdic['grid'][idcount]['ttaxamt']=tax_[0]; 
    recdic['grid'][idcount]['cgst']=csgst; 
    recdic['grid'][idcount]['sgst']=csgst; 
    recdic['grid'][idcount]['amttot']=amttot;
    recdic['grid'][idcount]['netrate']=netrate;
    recdic['grid'][idcount]['netamt']=netamt;

    let totnetamt = 0;
    let totamttot = 0;
    let totamt = 0;
    let tottaxamt = 0;
    let totdisamt = 0;
    let totcgst = 0;
    let totsgst = 0;
    
    for (const [key, value] of Object.entries(recdic['grid'])) {
        totnetamt += parseFloat(value.netamt);
        totamttot += parseFloat(value.amttot);
        totamt += parseFloat(value.amt);
        tottaxamt += parseFloat(value.ttaxamt);
        totdisamt += parseFloat(value.tdisamt);
        totcgst += parseFloat(value.cgst);
        totsgst += parseFloat(value.sgst);
        }
    
    recdic['pan']['gtot']=totnetamt.toFixed(2);
    recdic['pan']['tsubtot']=totamttot.toFixed(2);
    recdic['pan']['tamt']=totamt.toFixed(2);
    recdic['pan']['ttaxamt']=tottaxamt.toFixed(2);
    recdic['pan']['tdisamt']=totdisamt.toFixed(2);
    recdic['pan']['cgst']=totcgst.toFixed(2);
    recdic['pan']['sgst']=totsgst.toFixed(2);
    
    document.getElementById("gtot").innerHTML=totnetamt.toFixed(2);
    document.getElementById("tsubtot").innerHTML= totamttot.toFixed(2);
    document.getElementById("tamt").innerHTML=totamt.toFixed(2);
    document.getElementById("ttaxamt").innerHTML= tottaxamt.toFixed(2);
    document.getElementById("tdisamt").innerHTML= totdisamt.toFixed(2);
    document.getElementById("cgst").innerHTML=totcgst.toFixed(2);
    document.getElementById("sgst").innerHTML=totsgst.toFixed(2);
    
    /*
    var keyc = evt.keyCode || evt.which;
    if (keyc==13){
        ++enterhitcount ;
        if (enterhitcount===2){
            document.getElementById("statusinfo2").innerHTML=evtidf;
            if (evtnxtidf==='_incbtn'){appendRow(); document.getElementById(idcount+'_itemsearch').focus();}
            else{document.getElementById(idcount+evtnxtidf).focus();}
            enterhitcount = 0;
            }
        }
    */
    }

function RecdicPanFill(){
    let billdate = document.getElementById("billdate").value;
    let invdate = document.getElementById("invoicedate").value;
    let cscr = document.getElementById("cscr").value;
    let esti = document.getElementById("esti").value;
    let ddisc = document.getElementById("ddisc").value;
    let billno = document.getElementById("billno").value.toUpperCase();
    
    recdic['pan']['dbbilldate']=billdate;     
    recdic['pan']['dbinvdate']=invdate;
    recdic['pan']['billdate']=xdateFormat(billdate);     
    recdic['pan']['invdate']=xdateFormat(invdate);
    recdic['pan']['esti']=estidict[esti];
    recdic['pan']['ddisc']=ddisc;
    recdic['pan']['cscr']=cscr;
    recdic['pan']['dbcscr']=dbcscr[cscr];
    recdic['pan']['billno']=billno;
    
    };

function rmstoday(){return new Date().toISOString().substring(0, 10);}

function CreateAlertDiv(message){
    $('#alerts').append(
        '<div class="alert " >' +
            '<span class="alertclosebtn" onclick="alertMessDP()">' +           
            '&times;</span>' + message + '</div>');}

function alertMessDP(){
  var close = document.getElementsByClassName("alertclosebtn");
  var i;
  for (i = 0; i < close.length; i++) {
      close[i].onclick = function(){
      var div = this.parentElement;
      div.style.opacity = "0";
      setTimeout(function(){ div.style.display = "none"; }, 600);
            }
        }
    }