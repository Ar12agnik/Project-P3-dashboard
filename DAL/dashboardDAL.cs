using System.Numerics;
using System.Text.Json.Nodes;
using dashboard.Models;
using Microsoft.Data.SqlClient;
namespace dashboard.DAL

{
    public class dashboardDAL
    {
        string constring = "Data Source=192.168.10.113,1433;Initial Catalog=P3;Persist Security Info=True;User ID=agnik;Password=Abcd@12345;Trust Server Certificate=True";
        public JsonArray getSalesProjection(int formonth, int foryear)
        {
            JsonArray arr = new JsonArray();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_sales_forcasting", con);
                cmd.Parameters.AddWithValue("@ForecastingForMonth", formonth);
                cmd.Parameters.AddWithValue("@ForcastingForYear", foryear);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();

                while (rdr.Read())
                {
                    sales_projection_model spm = new sales_projection_model();
                    if (rdr["total"] == DBNull.Value)
                    {
                        spm.SP_total = 0;
                    }
                    else
                    {
                        spm.SP_total = Convert.ToDecimal(rdr["total"]);

                    }
                    arr.Add(spm);
                }
                rdr.Close();
            }
            return arr;

        }
        public JsonArray getProductOrderSummary(string startdate, string enddate)
        {
            JsonArray arr = new JsonArray();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_Get_Product_order_summary", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@StartDate", startdate);
                cmd.Parameters.AddWithValue("@EndDate", enddate);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    POS p = new POS();
                    if (rdr["amt"] == DBNull.Value)
                    {
                        p.total = 0;
                    }
                    else
                    {
                        p.total = Convert.ToInt32(rdr["amt"]);
                    }
                    arr.Add(p);

                }
                

            }
            return arr;
        }
        public JsonArray getSalesProjection()
        {
            JsonArray arr = new JsonArray();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_sales_forcasting", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();

                while (rdr.Read())
                {
                    sales_projection_model spm = new sales_projection_model();
                    if (rdr["total"] == DBNull.Value)
                    {
                        spm.SP_total = 0;
                    }
                    else
                    {
                        spm.SP_total = Convert.ToDecimal(rdr["total"]);

                    }
                    arr.Add(spm);
                }
                rdr.Close();
            }
            return arr;

        }
        public JsonArray getProductOrderSummary()
        {
            JsonArray arr = new JsonArray();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_Get_Product_order_summary", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                //cmd.Parameters.AddWithValue("@StartDate", startdate);
                //cmd.Parameters.AddWithValue("@EndDate", enddate);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    POS p = new POS();
                    if (rdr["amt"] == DBNull.Value)
                    {
                        p.total = 0;
                    }
                    else
                    {
                        p.total = Convert.ToInt32(rdr["amt"]);
                    }
                    arr.Add(p);

                }
                

            }
            return arr;
        }
        public JsonArray getSalesProjection_tbl(int formonth,int foryear)
        {
            JsonArray arr = new JsonArray();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_sales_forcasting_tbl", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ForecastingForMonth", formonth);
                cmd.Parameters.AddWithValue("@ForcastingForYear", foryear);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    sales_projection_tbl sp = new sales_projection_tbl();
                    
                        sp.ForecastingForMonth = Convert.ToInt32(rdr["ForecastingForMonth"]);
                        sp.ForecastingForYear = Convert.ToInt32(rdr["ForecastingForYear"]);
                        sp.DivisionName = Convert.ToString(rdr["DivisionName"]);
                 
                        sp.DepotName = Convert.ToString(rdr["DepotName"]);
                        sp.ProductCode = Convert.ToString(rdr["ProductCode"]);
                        sp.ProductName = Convert.ToString(rdr["ProductName"]);
                        sp.PackUnit = Convert.ToString(rdr["PackUnit"]);
                        sp.NextMonth_FinialForecastingQTY = Convert.ToString(rdr["NextMonth_FinialForecastingQTY"]);

                        sp.ProjectionValue = Convert.ToInt32(rdr["ProjectionValue"]);
                    
                    arr.Add(sp);
                }
                return arr;
            }


         }
        public JsonArray getProductOrderSummary_tbl(string startdate, string enddate)
        {
            JsonArray arr = new JsonArray();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_product_order_table", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                DateTime startDateTime;
                DateTime endDateTime;
                if (DateTime.TryParse(startdate, out startDateTime))
                {
                    cmd.Parameters.AddWithValue("@StartDate", startDateTime);
                }

                if (DateTime.TryParse(enddate, out endDateTime))
                {
                    cmd.Parameters.AddWithValue("@EndDate", endDateTime);
                }
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    POS_tbl p = new POS_tbl();
                    p.PKID = Convert.ToInt32(rdr["PKID"]);
                    p.EntryDate = Convert.ToString(rdr["EntryDate"]);
                    p.Series = Convert.ToString(rdr["Series"]);
                    p.EntryNo = Convert.ToInt32(rdr["EntryNo"]);
                    p.Vendor = Convert.ToString(rdr["Vendor"]);
                    p.GrossAmt = Convert.ToInt32(rdr["GrossAmt"]);
                    p.DeliveryDate = Convert.ToString(rdr["DeliveryDate"]);
                    p.EntryTime = Convert.ToString(rdr["EntryTime"]);

                    arr.Add(p);
                }
            }
            return arr;
        }
        public Dictionary<string, int> getuserpermissions(int user)
        {
            Dictionary<string, int> dashboardPermissions = new Dictionary<string, int>();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_get_user_permission", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@userid", user);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                
                while (rdr.Read())
                {
                    string dashboardName = Convert.ToString(rdr["Dashboard"]).Replace(" ","");
                    int value = Convert.ToInt32(rdr["value"]);
                    dashboardPermissions[dashboardName] = value;

                    
                }
                return dashboardPermissions;

            }
        }
        public Dictionary<int,string> getalllocations()
        {
            Dictionary<int, string> locations = new Dictionary<int, string>();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_GetAllLocations",con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    string location = Convert.ToString(rdr["StockLocation"]);
                    int Id = Convert.ToInt32(rdr["PKLocationId"]);
                    locations[Id] = location;
                }
                rdr.Close();
            }
            return locations;
        }
        public Dictionary<string,int> get_stock_acc_to_location(string lids)
        {
            Dictionary< string,int> locations = new Dictionary<string, int>();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_getStockSummary", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Lid", lids);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    int stock = Convert.ToInt32(rdr["stk"]);
                    locations["total"] = stock;
                }
                rdr.Close();
            }
            return locations;
        }
        public JsonArray get_stock_table(string lids)
        {
            JsonArray json = new JsonArray();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_getStockSummary_tbl", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Lid", lids);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    stocksummary_tbl sst = new stocksummary_tbl();
                    sst.Product = Convert.ToString(rdr["Product"]);
                    sst.Category = Convert.ToString(rdr["Category"]);
                    sst.Batch = Convert.ToString(rdr["Batch"]);
                    sst.StockLocation = Convert.ToString(rdr["StockLocation"]);
                    sst.total_stock = Convert.ToInt32(rdr["totalStock"]);
                    sst.cost = Convert.ToDecimal(rdr["cost"]);
                    json.Add(sst);
                }
                rdr.Close();
            }
            return json;
        } 
        public JsonArray get_stock_table()
        {
            JsonArray json = new JsonArray();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_getStockSummary_tbl", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                //cmd.Parameters.AddWithValue("@Lid", lids);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    stocksummary_tbl sst = new stocksummary_tbl();
                    sst.Product = Convert.ToString(rdr["Product"]);
                    sst.Category = Convert.ToString(rdr["Category"]);
                    sst.Batch = Convert.ToString(rdr["Batch"]);
                    sst.StockLocation = Convert.ToString(rdr["StockLocation"]);
                    sst.total_stock = Convert.ToInt32(rdr["totalStock"]);
                    sst.cost = Convert.ToDecimal(rdr["cost"]);
                    json.Add(sst);
                }
                rdr.Close();
            }
            return json;
        }
        public Dictionary<string, int> getallstocks()
        {
            Dictionary<string, int> locations = new Dictionary<string, int>();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_getStockSummary", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                //cmd.Parameters.AddWithValue("@Lid", lids);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    int stock = Convert.ToInt32(rdr["stk"]);
                    locations["total"] = stock;
                }
                rdr.Close();
            }
            return locations;
        }
        public Dictionary<string, int> gettop10acctostk()
        {
            Dictionary<string, int> locations = new Dictionary<string, int>();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_getTop10ProdsAccToStock", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                //cmd.Parameters.AddWithValue("@Lid", lids);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    string Product = Convert.ToString(rdr["Product"]);
                    int stock = Convert.ToInt32(rdr["totalStock"]);
                    locations[Product] = stock;
                }
                rdr.Close();
            }
            return locations;
        }
        public JsonArray gettop10acctoexp()
        {
            JsonArray json = new JsonArray();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_getTop10ProdsAccexpiry", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Top10exp stk = new Top10exp();
                    stk.Expiry = Convert.ToInt32(rdr["expiry"]);
                    stk.Product = Convert.ToString(rdr["Product"]);
                    stk.totalStock = Convert.ToDecimal(rdr["totalStock"]);
                    
                    stk.StockLocation = Convert.ToString(rdr["StockLocation"]);
                    
                    stk.Category = Convert.ToString(rdr["Category"]);
                    json.Add(stk);

                }
                con.Close();
                return json;
            }
        }
        public JsonArray getlowqty_prods()
        {
            JsonArray json = new JsonArray();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_low_quantity_stock", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    low_qty_stk stk = new low_qty_stk();
                    stk.prod_id = Convert.ToInt32(rdr["FKProdID"]);
                    stk.prod_name = Convert.ToString(rdr["Product"]);
                    stk.total_stk = Convert.ToInt32(rdr["total_stock"]);
                    stk.reorder_lvl = Convert.ToInt32(rdr["Reorder_level"]);
                    stk.diff = Convert.ToInt32(rdr["Diff"]);
                    stk.percentage = Convert.ToDecimal(rdr["perce"]);
                    json.Add(stk);
                }
                con.Close();
                return json;
            }
        }
        public Dictionary<string, int> get_vendor_district()
        {
            Dictionary<string, int> locations = new Dictionary<string, int>();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_get_top10_vendoe_district", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                int gt = 0;
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    
                    int count = Convert.ToInt32(rdr["Percentage"]);
                    gt += count;
                    locations[Convert.ToString( rdr["District"])] = count;
                }
                rdr.Close();
                locations["others"] = 100 - gt;
            }
            return locations;
        }public Dictionary<string, int> get_vendor_district(int id)
        {
            Dictionary<string, int> locations = new Dictionary<string, int>();
            using (SqlConnection con = new SqlConnection(constring))
            {
                SqlCommand cmd = new SqlCommand("PRC_P3Dash_get_top10_vendoe_district", con);
                cmd.CommandType = System.Data.CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@catgid", id);
                int gt = 0;
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    
                    int count = Convert.ToInt32(rdr["Percentage"]);
                    gt += count;
                    locations[Convert.ToString( rdr["District"])] = count;
                }
                rdr.Close();
                locations["others"] = 100 - gt;
            }
            return locations;
        }


    }
}
