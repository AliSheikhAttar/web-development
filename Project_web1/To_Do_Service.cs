using Microsoft.EntityFrameworkCore;
using Project_AP;
public class To_Do_Service
{
    private readonly To_Do_Context _context;
    public To_Do_Service(To_Do_Context context)
    {
        _context = context;
    }

    public IEnumerable<To_Do> GetAll() => _context.To_Do_List.AsNoTracking().ToList();

    public To_Do GetTo_DoById(string id) => _context.To_Do_List.Find(id);

    public To_Do Create(To_Do newTo_Do)
    {
        _context.To_Do_List.Add(newTo_Do);
        _context.SaveChanges();
        return newTo_Do;
    }


    public void DeleteTo_DoById(string id)
    {
        var To_Do__2delete = GetTo_DoById(id);
        if (To_Do__2delete is not null)
        {
            _context.To_Do_List.Remove(To_Do__2delete);
            _context.SaveChanges();
        }
    }
}