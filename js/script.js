$(document).ready(function () {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    function hiddenPreloader() {
      let preloader = document.getElementById('preloader');
    
      setTimeout(() => {
        preloader.classList.add('preloader--invisible');
        document.querySelector('html').style.overflowY = 'auto';
    
        setTimeout(() => {
          preloader.classList.add('preloader--hidden');
        }, 500)
      }, 2000)
    }

  function displaymsg(type,message){
    let alert_var=$("#alert_div")    
    alert_var.addClass(`alert-${type}`)
    alert_var.html(`${message} <button type="button" class="close" id="alert_close_btn">&times;</button> <div id="progress" class="progress progress-alert"></div>`)
    
    alert_var.addClass("show")
    alert_var.ready(()=>{
      progressbar=document.querySelector("#progress")
      progressbar.style.width = "100%"
      let duration = 3000; // 3 seconds
      let step = 10;
      let decrement = (100 / (duration / step));
      let intervel = setInterval(() => {
        let width = parseFloat(progressbar.style.width);
        // console.log(width);
        if (width<=0.9){
          console.log("hello");
          clearInterval(intervel);
          $("#alert_close_btn").trigger("click")
        }
        else{
          progressbar.style.width= (width-decrement)+"%"
        }
        
      }, step);
    $("#alert_close_btn").click(function (e) { 
      alert_var.removeClass("show")
      alert_var.removeClass(`alert-${type}`)
      
    });
    })
    
  }

  // displaymsg("success","test")

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
        
const base_url="http://localhost:37736/api"

  //*chart and Target vs achevement
  function getData() {
    $.ajax({
        url: `${base_url}/getPredictions`,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json;charset=utf-8',
        success: function (data) {
            const data2 = { "tva": 100 },
                  keys = Object.keys(data),
                  values = Object.values(data);
            try{
            generateChart(keys, values);
            }
            catch{

            }
            setCardData(data2);
        },
        error: function (errormessage) {
            try {
                let jsonResponse = JSON.parse(errormessage.responseText);               
            } catch (e) {
                console.error("Error fetching sales data:", errormessage);
            }
        }
    });
  }//*config for chart
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
          label: "Predicted ",
          lineTension: 0.3,
          backgroundColor: "rgba(0, 128, 128, 0.2)",
          borderColor: "#008080",
          pointRadius: 0,
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
              
              color: "rgba(0, 128, 128, 0.2)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [9]
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
 
//* vendor Pie chart
  var myPieChart = null;  // Initialize globally to null

  $.get(`${base_url}/Vendor_chart?id=200000001`, function(data) {
    var ctx = document.getElementById("myPieChart").getContext('2d');
    var labels = Object.keys(data);
    var values = Object.values(data);
  
    // Create the initial doughnut chart
    myPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
          
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
          displayColors: true,
          caretPadding: 10
        },
        legend: {
          display: true,
          position: 'right',
          labels: {
            boxWidth: 20,
            

          }
        },
        title: {
          display: true,
          text: 'Vendor Location in %',
          fontColor:'#FFFFFF'

        },
        cutoutPercentage: 0
      }
    });
  });
  
  $("#cht").on('change', function() {
    var id = $("#cht").val();

    
    $.get(`${base_url}/Vendor_chart?id=${id}`, function(data) {
      var labels = Object.keys(data);
      var values = Object.values(data);
  
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
            displayColors: true,
            caretPadding: 10
          },
          legend: {
            display: true,
            position: 'right',
            labels: {
              boxWidth: 20,
            }
          },
          title: {
            display: true,
            text: 'Vendor Location in %',
            fontColor: '#ffffff'
          },
          cutoutPercentage: 0,
          
        }
      });
    });
  });
  

  // * chart section ends

  // *card section
  function getLastMonthDate() {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    return today.toISOString().slice(0, 7);
  }
  function setCardData(tva_data) {
    //sales forcasting
    const lastMonth = getLastMonthDate();
    $salesMonth.val(lastMonth);
    $salesMonth_modal.val(lastMonth)
    const [year, month] = lastMonth.split('-').map(Number);
    //*sales forcasting Data
    $.get(`${base_url}/SP?formonth=${month}&foryear=${year}`, function (data2) {
      $("#sFText").text(`₹${data2[0]["sP_total"]}`);
    });
    //*product order summary
    $.get(`${base_url}/POSNP`, function (data) {
      $pOSText.text(`₹${data[0]["total"]}`);
    });
    //*target Vs achevement
    data=tva_data
    $tvaText.text(`${data["tva"]}%`);
    $tvaStyle.css("width", `${data["tva"]}%`);
    //*stock Summary
    $.get(`${base_url}/all_stocks`,function (data) {
      $stockSummaryText.text(`${data["total"]}`);
    });
  
  }

  // * event bindings

  // Stop propagation for clicks on inputs and the ADV button
  $('input, span,select,option,textarea,#stockSelect').on('click', (e) => e.stopPropagation());


  $("#sales_month").change(function (e) { 
    e.preventDefault();
    const [year, month] = this.value.split('-').map(Number);
        $.get(`${base_url}/SP?formonth=${month}&foryear=${year}`)
        .done(function (data) {
          $sFText.text(`₹${data[0]["sP_total"]}`);
        })
        .fail(function () {
          displaymsg("danger", "Error while Fetching data");
        }
        )
    
  });
  function add_table(url, table, str) {
    $("#modal-body").append(table);

    $.get(url, function (data) {
        data.forEach(element => {
            values = Object.values(element);
            str += '<tr>';
            values.forEach(ele => {
                str += `<td>${ele}</td>`;
            });
            str += "</tr>";
        });

        if (str === "") {
            displaymsg("danger","No data Found")
            $("#table_body").html(str);
            if ($.fn.DataTable.isDataTable("#modal_table")) {
              $("#modal_table").DataTable().rows().remove().destroy();
          }


        } else {
          if ($.fn.DataTable.isDataTable("#modal_table")) {
              $("#modal_table").DataTable().destroy();
          }
            $("#table_body").html(str);
            $("#modal_table").DataTable({
                dom: 'Bfrtip',
                buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
                destroy: true // Allows reinitialization without issues
            });
        }
    });
}


  $POSED.on('change', function (e) {
        let startdate = $("#POSSD").val(),
          enddate = $("#POSED").val();
        if(startdate===""){
          startdate=null
        }
      
          $.get(encodeURI(`${base_url}/POS?Startdate=${startdate}&enddate=${enddate}`), function (data) {
            
        $pOSText.text(`₹${data[0]["total"]}`);
      });
  });


  // *Set Modal
  $card.on("click",function(){
    $("#select_hidden").attr("hidden",true)
    $("#sales_month_modal,#sales_month_modal_label,#two_inputs").attr("hidden",true);
    $("#modal-body").html(" ")

   
    const parent_id=$(this).parent().attr("id")
    if(parent_id==="sales_forcasting"){
      $exampleModalScrollableTitle.text("Sales Forcasting modal")
      month_preset_modal=$("#sales_month_modal").val()
       lastMonth=month_preset_modal
      const [year, month] = lastMonth.split('-').map(Number);
      let str=''
      let table= `

          <table class="table table-successs overflow-x" id="modal_table">
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
        url=`${base_url}/SP_table?formonth=${month}&foryear=${year}`
      add_table(url,table,str)
      
    }
    else if(parent_id==="pOsummary"){
      $exampleModalScrollableTitle.text("Product Order Summary")
      let str=''
      let table= `

          <table class="table table-successs" id="modal_table">
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
        url=`${base_url}/POS_table?Startdate=""&enddate=""`
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
<table class="table" id="modal_table">
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
var url =`${base_url}/stock_tblNP`
add_table(url,table,str)
    }

   })
  $("#exampleModalScrollable").on("hiden.bs.modal",function(){

    $("#sales_month_modal,#sales_month_modal_label,#two_inputs").attr("hidden",true);
    $("#modal-body").html(" ")
  })
  $("#POSED_modal").on("change",function(){ 
    const startdate = $("#POSSD_modal").val()||`""`;
    const enddate = $("#POSED_modal").val();
    let str = ""
    const url =`${base_url}/POS_table?Startdate=${startdate}&enddate=${enddate}`
    add_table(url,"",str=str)
  })
  $("#sales_month_modal").on("change",function(){

    lastmonth=$("#sales_month_modal").val()
    const [year, month] = lastmonth.split('-').map(Number);
    let str=''
    add_table(`${base_url}/SP_table?formonth=${month}&foryear=${year}`,str=str)
  })
  
  // *card section Ends


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
    $.get(`${base_url}/locations`,function(response){
      data = response
      keys=Object.keys(data)
      keys.forEach(key => {
        var newOption = new Option(data[key],key,false,false);
        $('#stockSelect').append(newOption);
      });
      $('#stockSelect').trigger('change');
    })


    
  })
  $('.select2-selection--multiple').ready(function () {
    $.get(`${base_url}/locations`,function(response){
      data = response
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
      url: `${base_url}/stock/`,
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
      url: `${base_url}/all_stocks/`,
      type: "GET",
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

url=`${base_url}/low_qty`
$.get(url,function(data){
  let str = ""; // Initialize the string

  data.forEach(element => {
    let values = Object.values(element); // Get values of the object
    if (element['diff']<0){
      str+='<tr class="text-light font-weight-bold bg-danger" >'
    }
    else if (element['percentage']<20){
      str+='<tr class="text-dark font-weight-bold " style=" background-color:#F2C94C;" >'
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
       $("#ct2").html()
    str=`<h1 class="text-success">Hurray no Expiring products Within 60 days! </h1>`
    $("#ct2").html(str)
  }
  
  $("#table_body3").html(str)
  $("#low_stk_tbl").DataTable();

})


  })

  $("#ct2").ready(function(){
    
    $("#ct2").append(`<table class="table   text-light table-sm" id="expiring_tbl">
  <thead>
    <tr class="table-success text-dark" >
    <th scope="col">Expiry    (in days)</th>
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

url=`${base_url}/top10exp`
$.get(url,function(data){
  let str = ""; // Initialize the string

  data.forEach(element => {
    let values = Object.values(element); // Get values of the object
    
    str += `<tr class="text-grey  font-weight-bold" >`;
    
    
    values.forEach(ele => {
      str += `<td>${ele}</td>`;
    });
  
    str += "</tr>";
   
  });
  

  
  
  if (str ===""){
   
    $("#ct2").html()
    str=`<h3 class="text-success font-weight-bold text-center"><i class="bi bi-check-circle-fill"></i> Hurray no Expiring products within 60 days </h3>`
    $("#ct2").html(str)
  }
  
  $("#table_body2").html(str)
  $("#expiring_tbl").DataTable();
})

  })
  //*ct2 ends!!
    
    
  
  $("#stockSelect2").change(function (e) { 
    e.preventDefault();
    $("#modal_table").DataTable().destroy()
    if ($(this).val()!="") {
      var params ={
        lids:String($(this).val())
      }
      $.ajax({
        url: `${base_url}/stock_tbl/`,
        type: "POST",
        data: JSON.stringify(params),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data){
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

          $("#modal_table").DataTable({
            dom:"Bfrtip"
            , destroy:true
          }
          )
        },
        error: function(error) {
          console.error("Error fetching stock details:", error);
        }
      });
    }
    else{
      $.ajax({
        url: `${base_url}/stock_tblNP/`,
        type: "GET",
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
          $("#modal_table").DataTable({
            dom:"Bfrtip",
            destroy:true
          })
        },
        error: function(error) {
          console.error("Error fetching stock details:", error);
        }
      });
  
    }
  });
  // cookiees 
  
  function setcookie(data){

    data = data.split(",");
    str=`tasks = ${data} ;`
    document.cookie = str
    }
    function getcookie(name) {
      let cookies = document.cookie.split("; ");
      for (let cookie of cookies) {
          let [key, value] = cookie.split("=");
          if (key === name) {
              return decodeURIComponent(value);
          }
      }
      return null;
  }
    function delete_cookie(cname){
        document.cookie=`${cname}=;  max-age=-10`
    
    }
    // cookies part end 
    // to-do list starts 
    function addTask(task) {
      if (getcookie("tasks")!==null){
      str=getcookie("tasks")}
    else{
    str=''}
    if(str.indexOf(task)!==-1){

    }
    else{
    
    str+=`,${task}`
    setcookie(str)}
    if(task!==''){
      
      const todoList = document.getElementById("todo-list");
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
  <span class="task-text ui-icon ui-icon-arrowthick-2-n-s ">${task}</span>
  <input type="text" class="form-control edit-input" style="display: none;" value="${task}">
  <div class="btn-group">
    <button class="btn btn-success btn-sm delete-btn" value="${task}">Mark as Done</button>
    
  </div>
`;
      todoList.appendChild(li);}
  }

  // Event listener for form submission
  document.getElementById("todo-form").addEventListener("submit",
      function (event) {
          event.preventDefault();
          const taskInput = document.getElementById("todo-input");
          const task = taskInput.value.trim();
          if (task !== "") {
              addTask(task);
              taskInput.value = "";
          }
      });

  // Event listener for delete button click
  document.getElementById("todo-list").addEventListener("click",
      function (event) {
          if (event.target.classList.contains("delete-btn")) {
            temp=event.target.value
            //console.log(temp)
            str=getcookie("tasks")
            str=str.replace(`${temp},`,"").trim();
            str=str.replace(`${temp}`,"").trim();
            if (getcookie(temp)!==','){
            setcookie(str)
          }
          else{
            delete_cookie()
          }

              event.target.parentElement.parentElement.remove();
          }
      });

  // Event listener for edit button click
  document.getElementById("todo-list").addEventListener("click", function (event) {
      if (event.target.classList.contains("delete-btn")) {
       displaymsg("success","Hooray you have Completed a task!!")
      }
  });
if (getcookie("tasks")!==null){
  // Add default tasks
  const defaultTasks = getcookie("tasks").split(",");
  defaultTasks.forEach(task => addTask(task));
}
// to-do list ends 
// user specific div
// !Entry Point: Load chart & card data, toggle form visibility

// top 10 peoducts 
  var ctx = document.getElementById("stk_available");
$.get(`${base_url}/top10stk` ,function(data){
  keys=Object.keys(data)
  value=0
  str=''
  keys.forEach(key => {

    str+=` <div class="progress_div">
             <h4 class="small font-weight-bold text-grey mt-2">${key} <span
            class="float-right text-grey">${data[key]}%</span></h4>
    <div class="progress mb-4" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${key}: ${data[key]}%">
        <div class="progress-bar " role="progressbar" style="width: ${data[key]+30}%; background-color:#008080;"
            aria-valuenow="${data[key]}" aria-valuemin="0" aria-valuemax="100"  ></div>
    </div>
    </div>`
  value+=1});

  ctx.innerHTML=str
  setTimeout(() => {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}, 500);// Delay ensures elements are fully loaded before initialization

})
//!chatbot part
//!Comment out if required 
//!app will run without this part
let tables=-1
$("#queary").keydown(function (e) { 
  if (e.key==='Enter'|| e.keyCode===13) {
    
    $("#btnsubmit").trigger('click')

  }
  else if(e.key === "Escape" || e.keyCode === 27){
    $(this).trigger('blur')
  }
});
$("#btnsubmit").click(function (e) { 

  e.preventDefault();
  
  let query = $("#queary").val();
  userbubble=`<div class="bubble right mb-2 mt-2">${query}</div>`
  $("#output").append(userbubble)
  $("#queary").val('');
  $("#output").animate({
    scrollTop: $(
    '#output').get(0).scrollHeight
    }, 1000);
    
    

  let query_encoded = encodeURIComponent(query);
  //console.log(query);
  let url = `http://127.0.0.1:8000/get_sp_recomendation/${query_encoded}`;

  $.get(url, function (data, textStatus, jqXHR) {
      if (!data['sp_name'] || data['confidence']<=0.40) {
        $("#output").append(`<div class="bubble left mb-2 mt-2">Sorry I couldn't understand what you are trying to say😅</div>`);

          return;
      }

      let sp_name = data['sp_name'];
      let params = data["params"] || {}; // Ensure params exist
      let paramKeys = Object.keys(params);
      let paramStr = paramKeys.map(key => `${key}=${encodeURIComponent(params[key])}`).join(';'); // Use '&' separator
      if (paramStr==='')
          paramStr="' '"
      let url1 = `${base_url}/execproc?spName=${sp_name}&parameters=${encodeURI(paramStr)}`;

      $.get(url1, function (data, textStatus, jqXHR) {
        if (!data || (Array.isArray(data) && data.length === 0)) {
            alert("No data returned!");
            return;
        }
        tables+=1
        let outputStr = `<div class="bubble left mb-2 mt-2">`;
    
        // Ensure data is always an array
        if (!Array.isArray(data)) {
            data = [data]; // Wrap single object in an array
        }
    
        outputStr += `<table  class="display output__" id="${tables}">`;
    
        // Generate Table Header (Only Once)
        outputStr += '<thead><tr>';
        Object.keys(data[0]).forEach(element => {
            outputStr += `<th>${element}</th>`;
        });
        outputStr += '</tr></thead><tbody>';
    
        // Generate Table Rows
        data.forEach(row => {
            outputStr += '<tr>';
            Object.values(row).forEach(value => {
            
                outputStr += `<td>${value}</td>`; // Use <td> for data
            });
            outputStr += '</tr>';
        });
    
        outputStr += '</tbody></table>';
        outputStr+=`  <a href="#" class="exportCopy"><i class="bi bi-clipboard"></i></a> |
  <a href="#" class="exportCsv"><i class="bi bi-filetype-csv"></i></a> |
  <a href="#" class="exportExcel"><i class="bi bi-file-earmark-excel"></i></a> |
  <a href="#" class="exportPdf"><i class="bi bi-filetype-pdf"></i></a> |
  <a href="#" class="exportPrint"><i class="bi bi-printer"></i></a>`
        outputStr+=`</div>`
        
    
        // Replace previous content instead of appending
        $("#output").append(outputStr);


    
        // Initialize DataTable (after table is inserted)
        table=$(`#${tables}`).DataTable({
          destroy: true,
          dom: 'lfrtip',
         
         buttons: [
          { extend: 'copy' },
          { extend: 'csv' },
          { extend: 'excel' },
          { extend: 'pdf' },
          { extend: 'print' }
        ]
        });
// Attach click events to the hyperlinks to trigger the corresponding export actions
$(".exportCopy").on("click", function(e) {
  
  e.preventDefault();
  table_id=this.parentElement.children[0].children[2].id
  
  table=$(`#${table_id}`).DataTable()
  table.button(0).trigger();
});

$(".exportCsv").on("click", function(e) {
  e.preventDefault();
  table_id=this.parentElement.children[0].children[2].id
  
  table=$(`#${table_id}`).DataTable()
  table.button(1).trigger();
});

$(".exportExcel").on("click", function(e) {
  e.preventDefault();
  table_id=this.parentElement.children[0].children[2].id
  
  table=$(`#${table_id}`).DataTable()
  table.button(2).trigger();
});

$(".exportPdf").on("click", function(e) {
  e.preventDefault();
  table_id=this.parentElement.children[0].children[2].id
  
  table=$(`#${table_id}`).DataTable()
  table.button(3).trigger();
});

$(".exportPrint").on("click", function(e) {
  e.preventDefault();
  table_id=this.parentElement.children[0].children[2].id
  
  table=$(`#${table_id}`).DataTable()
  table.button(4).trigger();
});
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error("API Error:", errorThrown);
        $("#output").html("<p>Sorry, an error occurred while fetching data.</p>");
    });
    

  }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error("SP Recommendation API Error:", errorThrown);
      $("#output").append(`<div class="bubble left mb-2 mt-2">Sorry that is beyond  my current scope <div class="small">For more detailes check Console</div></div>`);
  });
});
getData();
user=1


  // *Remove elements for non-admin users and show cards
  $.get(`${base_url}/getuserpermission?user=${user}`, function (response, status) {
    if (Object.keys(response).length === 0) {
      $("#sales_forcasting").remove()
$(".Card1").remove()
hiddenPreloader();
displaymsg("danger","You are Not Authorized To view This Page")
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
    hiddenPreloader();
  }
    
  });

});
