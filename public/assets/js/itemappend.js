

function appendRow(){
    
    ++idcount ;
   
    document.getElementById("itembox").insertRow(-1).innerHTML = '<tr><td><button id='+idcount+'_incbtn'+' name="addbtn" onclick="appendRow()">+</button></td>'+
    '<td><label id='+idcount+'_sno'+' name="sno" class="rmslabelwidth0" >'+idcount+'</label></td>'+
    '<td><input id='+idcount+'_itemsearch'+' name="typeahead" class="typeahead" autocomplete="on" spellcheck="false" '+
    ' placeholder="Items Name" onkeyup="onItemChange(event)" onfocus="onItemSearchFocus(event)"></td >'+
    '<td><label id='+idcount+'_pack'+' name="pack" class="tdgridpacklabel0" ></label></td >'+
    '<td><input type="text" id='+idcount+'_qty'+' name="qty" class="rmsqtyvalidate" placeholder="Qty" '+
    ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" ></td >'+
    '<td><input type="text" id='+idcount+'_bonus'+' name="bonus" class="bonusvalidate" placeholder="Bonus" '+
    ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" ></td >'+
    '<td><input type="text" id='+idcount+'_rate'+' name="rate" class="rmsgridfloatval" placeholder="Rate" '+
    ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" ></td >'+
    '<td><input type="text" id='+idcount+'_dis'+' name="dis" class="rmsgriddiscount" maxlength="4" placeholder="Discount" '+
    ' onfocus="getFocusedID(event)" onkeyup="onQtyCalculation(event)" ></td >'+
    '<td><input type="text" id='+idcount+'_amt'+' name="amt" class="gridamtlabel1" placeholder="0.00" '+
    ' onfocus="getFocusedID(event)" readonly ></td >'+
    '<td><label id='+idcount+'_tax'+' name="tax" class="tdgridlabel" >0.00</label></td >'+
    '<td><label id='+idcount+'_netrate'+' name="netrate" class="tdgridlabel" >0.00</label></td ></tr>';

    itemhost = document.URL.substring(0, document.URL.lastIndexOf("/")+1)+'itemsearchenter';
    $('.typeahead').on('typeahead:selected', function(evt, item) {
    // item has value ; item.value
        var searchtxt = this.value;  
        propostAjax('products', searchtxt, itemhost ,'POST', '1from appendRow activated', 0, {'limit':itemdatalimit,});    
            });
    
    
    searchTypeAhead('#'+idcount+'_itemsearch','products','POST', 
        itemhost+"?key=%QUERY"+"&info="+info+"&limit="+itemdatalimit,
        itemdatalimit)
   
    
    setInputFilter(document.getElementById(idcount+'_qty'), function(value) {
        return /^-?\d*$/.test(value); }); 
    setInputFilter(document.getElementById(idcount+'_bonus'), function(value) {
        return /^[0-9 +]*$/i.test(value); });
    setInputFilter(document.getElementById(idcount+'_rate'), function(value) {
        return /^-?\d*[.,]?\d*$/.test(value); });
    setInputFilter(document.getElementById(idcount+'_dis'), function(value) {
        return /^-?\d*[.,]?\d*$/.test(value); });
}

function searchTypeAhead(s, n, m, r, l){$(s).typeahead({name:n, method:m, remote:r, limit:l });} ;

function suppostAjax(searchtxt, seturl, gptype, idf, keyc,){
    var dbrows = [];  
    var csname = document.getElementById("cssearch").innerHTML;
    
    $.ajax({
        url: seturl,
        type: gptype,
        data: {name:csname,searchtxt:searchtxt, idf:idf, keyc:keyc},
        dataType: 'json',
        success: function(result) {
            recdic['pan'] = result.dbrows[0]; 
            $('.tt-dropdown-menu').css('display', 'none');
            $('#add1').html(result.dbrows[0].add1);
            $('#add2').html(result.dbrows[0].add2);
            //$('#add3').html(result.dbrows[0].add3);
            $('#add3').html(posdict[result.dbrows[0].add3].toUpperCase());
            $('#gstn').html(result.dbrows[0].gstn);
            $('#regn').html(result.dbrows[0].regn);
            $('#supsearch').val(result.dbrows[0].name );
            document.getElementById('0_itemsearch').focus();

            //document.getElementById('supsearch').value = result.dbrows[0].name;    
                }
            });
    }

function propostAjax(name, searchtxt, seturl, gptype, idf, keyc, info){
    $.ajax({
        url: seturl,
        type: gptype,
        data: {name:name,searchtxt:searchtxt, idf:idf, keyc:keyc, info:info},
        dataType: 'json',
        success: function(result) {
            recdic['grid'][idcount] = result.dbrows[0]; 
            $('.tt-dropdown-menu').css('display', 'none');
            $('#'+idcount+'_pack').html(result.dbrows[0].pack);
            $('#'+idcount+'_rate').val(result.dbrows[0].srate);
            $('#'+idcount+'_tax').html(result.dbrows[0].tax);
            
            document.getElementById(idcount+'_qty').focus();
            $('#'+idcount+'_itemsearch').val(result.dbrows[0].name);
        }
        });
     }

$('.typeahead').on('typeahead:selected', function(evt, item, name) {
    // item has value ; item.value
    var searchtxt = this.value; 
    if (name.trim()=='suppliers'){
        suppostAjax(searchtxt, cshost, 'POST', 'typeahead, selected', 0, );
        }
    if (name.trim()=='customer'){
        suppostAjax(searchtxt, cshost, 'POST', 'typeahead, selected', 0, );
        }
    if (name.trim()=='products'){
        propostAjax(name, searchtxt, itemhost, 'POST', 'Mouce Click On 1st Items Row', 0, {'limit':itemdatalimit,});
        }
    });

$('#0_itemsearch').on('keydown', function(e) {
    var keyc = e.keyCode || e.which;
    var searchtxt = this.value; 
    if (keyc == 13){propostAjax('products',searchtxt, itemhost, 'POST', '0_itemsearch Hit Enter ', 
        keyc, {'limit':itemdatalimit,});} ;
    });


$('#supsearch').on('keydown', function(e) {
    var keyc = e.keyCode || e.which;
    var searchtxt = this.value; 
    $("#add1").html('');
    $("#add2").html('');
    $("#add3").html('');
    if (keyc === 13){ 
        suppostAjax(searchtxt, cshost, 'POST', 'supsearch keydown enter', keyc,); };
        });


function suppostAjax(searchtxt, seturl, gptype, idf, keyc,){
    var dbrows = [];  
    var csname = document.getElementById("cssearch").innerHTML;
    
    $.ajax({
        url: seturl,
        type: gptype,
        data: {name:csname,searchtxt:searchtxt, idf:idf, keyc:keyc},
        dataType: 'json',
        success: function(result) {
            recdic['pan'] = result.dbrows[0]; 
            $('.tt-dropdown-menu').css('display', 'none');
            $('#add1').html(result.dbrows[0].add1);
            $('#add2').html(result.dbrows[0].add2);
            //$('#add3').html(result.dbrows[0].add3);
            $('#add3').html(posdict[result.dbrows[0].add3].toUpperCase());
            $('#gstn').html(result.dbrows[0].gstn);
            $('#regn').html(result.dbrows[0].regn);
            $('#supsearch').val(result.dbrows[0].name );
            
            document.getElementById('0_itemsearch').focus();
            document.getElementById('supsearch').value = result.dbrows[0].name;    
                }
            });
        }

function onItemSearchFocus(evt){
    idcount = document.activeElement.id.split('_')[0];
    document.getElementById("0_itemsearch").scrollIntoView();};

function getFocusedID(evt){
    idcount = document.activeElement.id.split('_')[0]
    document.getElementById("statusinfo").innerHTML = 'Calculation on Qty _  : '+idcount;
    }

function onItemChange(e){
    
    var keyc = e.keyCode || e.which;
   
    var activeid = document.activeElement.id;

    var hasid = '#'+activeid;
    
    var searchtxt = document.getElementById(activeid).value ;
    
    document.getElementById('statusinfo').innerHTML = hasid+keyc + searchtxt;
   
    $(idcount+'_pack').html('');
   
    searchTypeAhead(hasid,'products','POST', 
        itemhost+"?key=%QUERY"+"&info="+info+"&limit="+itemdatalimit, itemdatalimit);
        
    
    if (keyc == 13){propostAjax('products',searchtxt, itemhost, 'POST', 'onItemChanged Hit Enter',
     keyc, {'limit':itemdatalimit,});}
    document.getElementById(activeid).focus();
}