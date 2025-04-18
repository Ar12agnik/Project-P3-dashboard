namespace dashboard.Models
{
    public class stocksummary_tbl
    {
        public string Product { get; set; }
        public string Category { get; set; }
        public string Batch { get; set; }
        public string StockLocation { get; set; }
        public int total_stock { get; set; }
        public decimal cost { get; set; }


    }
}
