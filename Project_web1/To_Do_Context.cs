using Microsoft.EntityFrameworkCore;


using Project_AP;
public class To_Do_Context : DbContext
{
    public To_Do_Context()
    {
    }

    public To_Do_Context(DbContextOptions<To_Do_Context> options) : base(options)
    {
    }

    public DbSet<To_Do> To_Do_List { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    { 
        optionsBuilder.UseSqlite(@"Data Source=To_DoList.db");
    }
}