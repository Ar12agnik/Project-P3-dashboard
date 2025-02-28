
$(document).ready(function () {
  
  

  // *Cache jQuery selectors
  const $salesMonth = $("#sales_month"),
  $salesMonth_modal = $("#sales_month_modal"),
        $sFText = $("#sFText"),
        $pOSText = $("#pOSText"),
        $tvaText = $("#tvaText"),
        $tvaStyle = $("#tvastyle"),
        $stockSummaryText = $("#stockSummaryText"),
        $POSSD = $("#POSSD"),
        $POSED =$("#POSED"),
        $POSED_modal =$("POSED_modal"),
        $card = $(".card"),
        $exampleModalScrollableTitle=$("#exampleModalScrollableTitle");
        


  // *Chart Section starts
  async function getData() {
    try {
      const data = await $.get("js/testdata.json");
      const data1 = data[0],
            data2 = data[1],
            keys = Object.keys(data1),
            values = Object.values(data1);
      generateChart(keys, values);
      setCardData(data2);
    } catch (error) {
      console.error("Error fetching testdata.json:", error);
    }
  }

  Chart.defaults.global.defaultFontFamily =
    'Nunito, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  Chart.defaults.global.defaultFontColor = '#858796';

  function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(',', '').replace(' ', '');
    const n = !isFinite(+number) ? 0 : +number,
          prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
          sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
          dec = (typeof dec_point === 'undefined') ? '.' : dec_point;
    let s = '';
    const toFixedFix = (n, prec) => {
      const k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  }
  function Putdata_select(data){
    keys=Object.keys(data)
    keys.forEach(key => {
      var newOption = new Option(data[key],key,false,false);
      $('#stockSelect').append(newOption);
    });
    $('#stockSelect').trigger('change');
  }
  function generateChart(keys, data) {
    const ctx = document.getElementById("myAreaChart");
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: keys,
        datasets: [{
          label: "Earnings",
          lineTension: 0.3,
          backgroundColor: "#e6ffe6",
          borderColor: "#65a765",
          pointRadius: 3,
          pointBackgroundColor: "#cdffcd",
          pointBorderColor: "#90EE90",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: data,
        }],
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: { left: 10, right: 25, top: 25, bottom: 0 }
        },
        scales: {
          xAxes: [{
            time: { unit: 'date' },
            gridLines: { display: false, drawBorder: false },
            ticks: { maxTicksLimit: 7 }
          }],
          yAxes: [{
            ticks: {
              maxTicksLimit: 5,
              padding: 10,
              callback: (value) => '₹' + number_format(value)
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2]
            }
          }],
        },
        legend: { display: false },
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          titleMarginBottom: 10,
          titleFontColor: '#6e707e',
          titleFontSize: 14,
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          intersect: false,
          mode: 'index',
          caretPadding: 10,
          callbacks: {
            label: (tooltipItem, chart) => {
              const datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
              return datasetLabel + ': ₹' + number_format(tooltipItem.yLabel);
            }
          }
        }
      }
    });
  }
 

  // Fetch data for the chart
  var myPieChart = null;  // Initialize globally to null

  $.get('https://localhost:44371/api/Vendor_chart?id=200000001', function(data) {
    var ctx = document.getElementById("myPieChart").getContext('2d');
    var labels = Object.keys(data);
    var values = Object.values(data);
  
    // Create the initial doughnut chart
    myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          hoverBorderColor: "rgba(234, 236, 244, 1)"
        }]
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10
        },
        legend: {
          display: true,
          position: 'right',
          labels: {
            boxWidth: 20,
            fontColor: '#333'
          }
        },
        title: {
          display: true,
          text: 'Vendor Location in %'
        },
        cutoutPercentage: 0
      }
    });
  });
  
  $("#cht").on('change', function() {
    var id = $("#cht").val();
    console.log(id);
    
    $.get(`https://localhost:44371/api/Vendor_chart?id=${id}`, function(data) {
      var labels = Object.keys(data);
      var values = Object.values(data);
  
      // 🛠 Check if myPieChart exists and is a valid Chart instance
      if (myPieChart instanceof Chart) {
        myPieChart.destroy();
      }
  
      var ctx = document.getElementById("myPieChart").getContext('2d');
      
      // Create a new chart with updated data
      myPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: values,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            hoverBorderColor: "rgba(234, 236, 244, 1)"
          }]
        },
        options: {
          maintainAspectRatio: false,
          tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            caretPadding: 10
          },
          legend: {
            display: true,
            position: 'right',
            labels: {
              boxWidth: 20,
              fontColor: '#333'
            }
          },
          title: {
            display: true,
            text: 'Vendor Location in %'
          },
          cutoutPercentage: 0
        }
      });
    });
  });
  

  // * chart section ends

  function getLastMonthDate() {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    return today.toISOString().slice(0, 7);
  }
// *card section
  function setCardData(data) {
    
    const lastMonth = getLastMonthDate();
    $salesMonth.val(lastMonth);
    $salesMonth_modal.val(lastMonth)
    const [year, month] = lastMonth.split('-').map(Number);

    $.get(`https://localhost:44371/api/SP?formonth=${month}&foryear=${year}`, function (data2) {
      $("#sFText").text(`₹${data2[0]["sP_total"]}`);
    });

    $.get(`https://localhost:44371/api/POSNP`, function (data) {
      $pOSText.text(`₹${data[0]["total"]}`);
    });

    $tvaText.text(`${data["tva"]}%`);
    $tvaStyle.css("width", `${data["tva"]}%`);
    $.get("https://localhost:44371/api/all_stocks",function (data) {
      $stockSummaryText.text(`${data["total"]}`);
    });
  
  }

  // * event bindings

  // Stop propagation for clicks on inputs and the ADV button
  $('input, span,svg,select,option,textarea,#stockSelect').on('click', (e) => e.stopPropagation());

  // Update sales forecasting when sales_month changes
  $('input').on('change', function () {
    if (this.id === "sales_month") {
      const [year, month] = this.value.split('-').map(Number);
      $.get(`https://localhost:44371/api/SP?formonth=${month}&foryear=${year}`, function (data) {
        $sFText.text(`₹${data[0]["sP_total"]}`);
      });
    }
  });
  function add_table(url,table,str){
    
    $("#modal-body").append(table)
    $.get(url,function(data){
      // console.log(data);
      // console.log(" str "+table);
      data.forEach(element => {
       values=Object.values(element)
       str+='<tr>'
       values.forEach(ele => {
        str+=`<td>${ele}</td>`
        
       });
       str+="</tr>"
      });
      if (str ===""){
        // console.log("HHHHHHHHHHHH");
        str+=`<tr><td class="table-danger text-dark"colspan="9"><centre>No Data Found</centre></td></tr>`
      }
      // console.log();
      $("#table_body").html(str)
      $(".table").DataTable();
    })
  }

  $POSED.on('change', function (e) {
    e.preventDefault();
    const startdate = $("#POSSD").val(),
          enddate = $("#POSED").val();
          if(startdate==+""){
            alert("please fill the startdate first")
          }else{
    if (startdate > enddate) {
      alert("Start Date cannot be more than End date");
      
    } else {
      $.get(`https://localhost:44371/api/POS?Startdate=${startdate}&enddate=${enddate}`, function (data) {
        $pOSText.text(`₹${data[0]["total"]}`);
      });
    }}
  });


  // *Set Modal
  $card.on("click",function(){
    // console.log("triggered!!!!!!");
    $("#sales_month_modal,#sales_month_modal_label,#two_inputs").attr("hidden",true);
    $("#modal-body").html(" ")
   
    const parent_id=$(this).parent().attr("id")
    if(parent_id==="sales_forcasting"){
      $exampleModalScrollableTitle.text("Sales Forcasting modal")
      lastMonth = getLastMonthDate()
      const [year, month] = lastMonth.split('-').map(Number);
      let str=''
      let table= `

          <table class="table table-successs">
            <thead>
              <tr class="table-dark">
                <th scope="col">forecastingForMonth</th>
                <th scope="col">forecastingForYear</th>
                <th scope="col">divisionName</th>
                <th scope="col">depotName</th>
                <th scope="col">productCode</th>
                <th scope="col">productName</th>
                <th scope="col">packUnit</th>
                <th scope="col">nextMonth_FinialForecastingQTY</th>
                <th scope="col">projectionValue</th>
              </tr>
            </thead>
            <tbody id="table_body">
              <!-- Data will be inserted dynamically -->
            </tbody>
          </table>`
        $("#sales_month_modal,#sales_month_modal_label").removeAttr("hidden");
        url=`https://localhost:44371/api/SP_table?formonth=${month}&foryear=${year}`
      add_table(url,table,str)
      
    }
    else if(parent_id==="pOsummary"){
      $exampleModalScrollableTitle.text("Product Order Summary")
      let str=''
      let table= `

          <table class="table table-successs">
            <thead>
              <tr class="table-dark">
                               <th scope="col">pkid</th>
                <th scope="col">entryDate</th>
                <th scope="col">series</th>
                <th scope="col">entryNo</th>
                <th scope="col">vendor</th>
                <th scope="col">grossAmt</th>
                <th scope="col">deliveryDate</th>
                <th scope="col">entryTime</th>
              </tr>
            </thead>
            <tbody id="table_body">
              <!-- Data will be inserted dynamically -->
            </tbody>
          </table>`
        $("#two_inputs").removeAttr("hidden");
        url=`https://localhost:44371/api/POS_table?Startdate=""&enddate=""`
      add_table(url,table,str)
    }
    else if(parent_id==="tva"){
      $exampleModalScrollableTitle.text("Target Vs Achevement")
    }
    else if(parent_id==="stocksummary"){
      $("#select_hidden").removeAttr("hidden")
      $exampleModalScrollableTitle.text("Stock Summary")
    let str=''
    let table=`<table>
<table class="table">
  <thead>
    <tr class="table-dark">
      <th scope="col">product</th>
      <th scope="col">category</th>
      <th scope="col">batch</th>
      <th scope="col">stockLocation</th>
      <th scope="col">total_stock</th>
      <th scope="col">cost (₹)</th>
    </tr>
  </thead>
  <tbody id="table_body">
    <!-- Data will be inserted dynamically -->
  </tbody>
</table>
`
var url =`https://localhost:44371/api/stock_tblNP`
add_table(url,table,str)
    }

   })
  $("#exampleModalScrollable").on("hiden.bs.modal",function(){
    debugger;
    // console.log("triggered!!!!!!");
    $("#sales_month_modal,#sales_month_modal_label,#two_inputs").attr("hidden",true);
    $("#modal-body").html(" ")
  })
  $("#POSED_modal").on("change",function(){
    // console.log("Triggered!!");
    const startdate = $("#POSSD_modal").val()||`""`;
    const enddate = $("#POSED_modal").val();
    let str = ""
    const url =`https://localhost:44371/api/POS_table?Startdate=${startdate}&enddate=${enddate}`
    // console.log(url);
    add_table(url,"",str=str)
  })
  $("#sales_month_modal").on("change",function(){

    lastmonth=$("#sales_month_modal").val()
    // console.log(lastmonth);
    const [year, month] = lastmonth.split('-').map(Number);
    let str=''
    add_table(`https://localhost:44371/api/SP_table?formonth=${month}&foryear=${year}`,"",str=str)
  })
  // *card section Ends

  // *Entry Point: Load chart & card data, toggle form visibility
  getData();
  // * multiple Select
  $('#stockSelect').select2({
    placeholder: " Stock Location",
    allowClear: true
  });
  $('#stockSelect2').select2({
    placeholder: " Stock Location",
    allowClear: true
  });
  $('.select2-selection--multiple').ready(function () {
    // console.log( $("#stockSelect"));
    // console.log("triggerd");
    $.get("https://localhost:44371/api/locations",function(response){
      data = response
      // console.log(data);
      keys=Object.keys(data)
      keys.forEach(key => {
        var newOption = new Option(data[key],key,false,false);
        $('#stockSelect').append(newOption);
      });
      $('#stockSelect').trigger('change');
    })


    
  })
  $('.select2-selection--multiple').ready(function () {
    // console.log( $("#stockSelect"));
    // console.log("triggerd");
    $.get("https://localhost:44371/api/locations",function(response){
      data = response
      // console.log(data);
      keys=Object.keys(data)
      keys.forEach(key => {
        var newOption = new Option(data[key],key,false,false);
        $('#stockSelect2').append(newOption);
      });
      $('#stockSelect2').trigger('change');
    })


    
  })
  
$("#stockSelect").change(function (e) { 
  e.preventDefault();
  if ($(this).val()!="") {
    var params ={
      lids:String($(this).val())
    }
    $.ajax({
      url: "https://localhost:44371/api/stock/",
      type: "POST",
      data: JSON.stringify(params),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(response) {
        $stockSummaryText.text(response['total']);
      },
      error: function(error) {
        console.error("Error fetching stock details:", error);
      }
    });
  }
  else{
    $.ajax({
      url: "https://localhost:44371/api/all_stocks/",
      type: "GET",
      // data: JSON.stringify(params),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(response) {
        $stockSummaryText.text(response['total']);
      },
      error: function(error) {
        console.error("Error fetching stock details:", error);
      }
    });
    

  }});
  $("#low_stk").ready(function(){
    
    $("#low_stk").append(`<table class="table  table-sm" id="low_stk_tbl">
  <thead>
    <tr class="table-success text-grey" >
    
      <th scope="col">Product</th>
      <th scope="col">Total Stock</th>
      
      <th scope="col">Reorder Level</th>
      

    </tr>
  </thead>
  <tbody id="table_body3">
    <!-- Data will be inserted dynamically -->
  </tbody>
</table>`)

url='https://localhost:44371/api/low_qty'
$.get(url,function(data){
  // console.log(data);
  // console.log(" str "+table);
  let str = ""; // Initialize the string

  data.forEach(element => {
    let values = Object.values(element); // Get values of the object
    if (element['diff']<0){
      str+='<tr class="text-light font-weight-bold bg-danger" >'
    }
    else if (element['percentage']<20){
      str+='<tr class="text-dark font-weight-bold bg-warning" >'
    }else{
    str += `<tr class="text-light  font-weight-bold bg-success" >`;}
    a=-1
    values.forEach(ele => {
      a+=1
      if(a!=0 && a!=4 && a!=5)
      str += `<td>${ele}</td>`;
    });
    a=-1
  
    str += "</tr>";
   
  });
  
  // Now, `str` contains the table rows
  
  
  if (str ===""){
   
    // str+=`<tr><td class="table-success text-dark"colspan="9"><centre>Hurray! No Expiring Products within 60 days</centre></td></tr>`
    $("#ct2").html()
    str=`<h1 class="text-success">Hurray! no Expiring products! </h1>`
    $("#ct2").html(str)
  }
  
  $("#table_body3").html(str)
  $("#low_stk_tbl").DataTable();

})


  })

  $("#ct2").ready(function(){
    
    $("#ct2").append(`<table class="table  table-sm" id="expiring_tbl">
  <thead>
    <tr class="table-success text-grey" >
    <th scope="col">Expiry</th>
      <th scope="col">Product</th>
      <th scope="col">Total Stock</th>
      
      <th scope="col">Stock Location</th>
      
      <th scope="col">Category</th>
    </tr>
  </thead>
  <tbody id="table_body2">
    <!-- Data will be inserted dynamically -->
  </tbody>
</table>`)

url='https://localhost:44371/api/top10exp'
$.get(url,function(data){
  // console.log(data);
  // console.log(" str "+table);
  let str = ""; // Initialize the string

  data.forEach(element => {
    let values = Object.values(element); // Get values of the object
    
    str += `<tr class="text-grey  font-weight-bold " >`;
    
    
    values.forEach(ele => {
      str += `<td>${ele}</td>`;
    });
  
    str += "</tr>";
   
  });
  
  // Now, `str` contains the table rows
  
  
  if (str ===""){
   
    // str+=`<tr><td class="table-success text-dark"colspan="9"><centre>Hurray! No Expiring Products within 60 days</centre></td></tr>`
    $("#ct2").html()
    str=`<h1 class="text-success">Hurray! no Expiring products! </h1>`
    $("#ct2").html(str)
  }
  
  $("#table_body2").html(str)
  $("#expiring_tbl").DataTable();
})

  })
  //*ct2 ends!!
    
    
  
  $("#stockSelect2").change(function (e) { 
    e.preventDefault();
    if ($(this).val()!="") {
      var params ={
        lids:String($(this).val())
      }
      $.ajax({
        url: "https://localhost:44371/api/stock_tbl/",
        type: "POST",
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
          // console.log(data);
          // console.log(" str "+table);
          let str=''
          data.forEach(element => {
           values=Object.values(element)
           str+='<tr>'
           values.forEach(ele => {
            str+=`<td>${ele}</td>`
            
           });
           str+="</tr>"
          })
          $("#table_body").html(str)
        },
        error: function(error) {
          console.error("Error fetching stock details:", error);
        }
      });
    }
    else{
      $.ajax({
        url: "https://localhost:44371/api/stock_tblNP/",
        type: "GET",
        // data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data) {
          let str=''
          data.forEach(element => {
           values=Object.values(element)
           str+='<tr>'
           values.forEach(ele => {
            str+=`<td>${ele}</td>`
            
           });
           str+="</tr>"
          })
          $("#table_body").html(str)
        },
        error: function(error) {
          console.error("Error fetching stock details:", error);
        }
      });
  
    }
  });



      
      
   
user=1

  // *Remove elements for non-admin users and show cards
  $.get(`https://localhost:44371/api/getuserpermission?user=${user}`, function (response, status) {
    if (Object.keys(response).length === 0) {
      $("#sales_forcasting").remove()
$("#POsummary").remove()
$("#tva").remove()
$("#stocksummary").remove()
$("#chart").remove()
$("#content").html(`<div class="alert alert-danger" role="alert">
  YOU ARE NOT AUTHENTICATED TO SEE THIS PAGE
</div>`)
    }else{
    
    notallowed=[]
    divs=Object.keys(response)
    divs.forEach(div => {
      
      if(response[div]===0){
        notallowed.push(div)
      }
    });

   notallowed.forEach(element => {
    

    $(`#${element}`).remove()
   });
    $(".Card1").removeAttr("hidden");
  }
    
  });
  var ctx = document.getElementById("stk_available");
$.get("https://localhost:44371/api/top10stk" ,function(data){
  keys=Object.keys(data)
  // values = Object.values(data)
  bootstrapColors = [
    "bg-primary",
    "bg-secondary",
    "bg-success",
    "bg-danger",
    "bg-warning",
    "bg-info"
  ];
  value=0
  str=''
  keys.forEach(key => {

    str+=`          <h4 class="small font-weight-bold text-grey">${key} <span
            class="float-right text-grey">${data[key]}%</span></h4>
    <div class="progress mb-4">
        <div class="progress-bar" role="progressbar" style="width: ${data[key]+30}%; background-color:#91ee91;"
            aria-valuenow="${data[key]}" aria-valuemin="0" aria-valuemax="100"></div>
    </div>`
  value+=1});

  ctx.innerHTML=str

})

});
