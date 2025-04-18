using System.Numerics;

namespace dashboard.Models
{
    public class POS_tbl
    {
        public int PKID { get; set; }
        public string EntryDate {get; set;}
        public string Series {get; set;}
        public int EntryNo {get; set;}
        public string Vendor {get; set;}
        public int GrossAmt {get; set;}
        public string DeliveryDate {get; set;}
        public string EntryTime {get; set;}

    }
}
