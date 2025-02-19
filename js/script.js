
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
        $exampleModalScrollableTitle=$("#exampleModalScrollableTitle")
        


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

  function generateChart(keys, data) {
    const ctx = document.getElementById("myAreaChart");
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: keys,
        datasets: [{
          label: "Earnings",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
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
      $sFText.text(`₹${data2[0]["sP_total"]}`);
    });

    $.get(`https://localhost:44371/api/POSNP`, function (data) {
      $pOSText.text(`₹${data[0]["total"]}`);
    });

    $tvaText.text(`${data["tva"]}%`);
    $tvaStyle.css("width", `${data["tva"]}%`);
    $stockSummaryText.text(`${data["stock"]}`);
  }

  // * event bindings

  // Stop propagation for clicks on inputs and the ADV button
  $('input, span,svg').on('click', (e) => e.stopPropagation());

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
      console.log(" str "+table);
      data.forEach(element => {
       values=Object.values(element)
       str+='<tr>'
       values.forEach(ele => {
        str+=`<td>${ele}</td>`
        
       });
       str+="</tr>"
      });
      if (str ===""){
        console.log("HHHHHHHHHHHH");
        str+=`<tr><td class="table-danger text-dark"colspan="9"><centre>No Data Found</centre></td></tr>`
      }
      console.log();
      $("#table_body").html(str)
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
    debugger;
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
    else if(parent_id==="tva")
      $exampleModalScrollableTitle.text("Target Vs Achevement")
    else if(parent_id==="stocksummary")
      $exampleModalScrollableTitle.text("Stock Summary")

  })
  $("#exampleModalScrollable").on("hidden.bs.modal",function(){
    $("#sales_month_modal,#sales_month_modal_label,#two_inputs").attr("hidden",true);
    $("#modal-body ").html("")
  })
  $("#POSED_modal").on("change",function(){
    console.log("Triggered!!");
    const startdate = $("#POSSD_modal").val()||`""`;
    const enddate = $("#POSED_modal").val();
    let str = ""
    const url =`https://localhost:44371/api/POS_table?Startdate=${startdate}&enddate=${enddate}`
    console.log(url);
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
    console.log(response);
    notallowed=[]
    divs=Object.keys(response)
    divs.forEach(div => {
      console.log(div+" "+response[div]);
      if(response[div]===0){
        notallowed.push(div)
      }
    });
   notallowed.forEach(element => {
    console.log($(`#${element}`));

    $(`#${element}`).remove()
   });
    $(".Card1").removeAttr("hidden");
  }
    // console.log(status);
  });
});
