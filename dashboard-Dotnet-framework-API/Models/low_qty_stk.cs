namespace dashboard.Models
{
    public class low_qty_stk
    {
        public int prod_id { get; set; }
        public string prod_name { get; set; }
        public int total_stk { get; set; }
        public int reorder_lvl { get; set; }
         public int diff { get; set; }
       public decimal percentage { get; set; }
    }
}
