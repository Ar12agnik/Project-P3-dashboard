namespace dashboard.Models
{
    public class sales_projection_tbl
    {
        public int ForecastingForMonth { get; set; }
       public int ForecastingForYear { get; set; }
        public string DivisionName { get; set; }
        public string DepotName { get; set; }
	    public string ProductCode { get; set; }
	    public string ProductName { get; set; }
	    public string PackUnit {  get; set; }
	    public string NextMonth_FinialForecastingQTY { get; set; }
        public int ProjectionValue { get; set; }
    }
}
