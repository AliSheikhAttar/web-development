using Microsoft.AspNetCore.Mvc;
using Project_AP;

[ApiController]
[Route("[controller]")]
public class To_Do_Controller : ControllerBase
{
    To_Do_Service _service;
    
    public To_Do_Controller(To_Do_Service service)
    {
        _service = service;
    }

    [HttpGet]
    public IEnumerable<To_Do> GetAll()
    {
        return _service.GetAll();
    }

    [HttpGet("{id}")]
    public ActionResult<To_Do> GetById(string id)
    {
        var To_Do = _service.GetTo_DoById(id);

        if(To_Do is not null)
        {
            return To_Do;
        }
        else
        {
            return NotFound();
        }
    }


    [HttpPost]
    public IActionResult Create(To_Do newTo_Do)
    {
        var To_Do = _service.Create(newTo_Do);
        return CreatedAtAction(nameof(GetById), new { id = To_Do!.SubjectId }, To_Do);
    }


    [HttpDelete("{id}")]
    public IActionResult Delete(string id)
    {
        var To_Do = _service.GetTo_DoById(id);

        if(To_Do is not null)
        {
            _service.DeleteTo_DoById(id);
            return Ok();
        }
        else
        {
            return NotFound();
        }
    }
}