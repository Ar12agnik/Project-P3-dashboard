using dashboard.Models;
using Microsoft.AspNetCore.Mvc;

namespace dashboard.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class apiController : Controller
    {
        [HttpGet("SP")]
        public JsonResult getall(int formonth,int foryear)
        {
            dashboard.DAL.dashboardDAL dd = new dashboard.DAL.dashboardDAL();
            return Json(dd.getSalesProjection(formonth,foryear));
        }
        [HttpGet("POS")]
        public JsonResult POS(string Startdate,string enddate)
        {
            dashboard.DAL.dashboardDAL dd = new dashboard.DAL.dashboardDAL();
            return Json(dd.getProductOrderSummary(Startdate, enddate));
        }
        [HttpGet("SPNP")]
        public JsonResult getall()
        {
            dashboard.DAL.dashboardDAL dd = new dashboard.DAL.dashboardDAL();
            return Json(dd.getSalesProjection());
        }
        [HttpGet("POSNP")]
        public JsonResult POS()
        {
            dashboard.DAL.dashboardDAL dd = new dashboard.DAL.dashboardDAL();
            return Json(dd.getProductOrderSummary());
        }
        [HttpGet("SP_table")]
        public JsonResult get_SP_table(int formonth,int foryear)
        {
            dashboard.DAL.dashboardDAL dd = new dashboard.DAL.dashboardDAL();
            return (Json(dd.getSalesProjection_tbl(formonth, foryear)));
        }
        [HttpGet("POS_table")]
        public JsonResult POS_table(string Startdate, string enddate)
        {
            dashboard.DAL.dashboardDAL dd = new dashboard.DAL.dashboardDAL();
            return (Json(dd.getProductOrderSummary_tbl(Startdate, enddate)));
        }
        [HttpGet("getuserpermission")]
        public JsonResult getuserpermission(int user)
        {
            dashboard.DAL.dashboardDAL dd = new dashboard.DAL.dashboardDAL();
            return Json(dd.getuserpermissions(user));
        }
        [HttpGet("locations")]
        public JsonResult getlocations()
        {
            dashboard.DAL.dashboardDAL dd = new dashboard.DAL.dashboardDAL();
            return Json(dd.getalllocations());
        }
        [HttpPost("stock")]
        public JsonResult get_stock_detail(StockDetailRequest request)
        {
            dashboard.DAL.dashboardDAL dd = new dashboard.DAL.dashboardDAL();
            return Json(dd.get_stock_acc_to_location(request.lids));
        }
    }
}
