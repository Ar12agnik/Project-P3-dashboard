$.ajax({
    url: `${base_url}/stock_tblNP/`,
    type: "GET",
    data: JSON.stringify(params),
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
