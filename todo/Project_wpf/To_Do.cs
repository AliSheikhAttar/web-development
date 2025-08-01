using System;
using System.ComponentModel.DataAnnotations;
namespace Project_AP;
public class To_Do
{
    public To_Do()
    {
        
    }
    public To_Do(string subjectId, DateTime date, string message )
    {
        Date = date;
        Message = message;
        SubjectId = subjectId;
    }


    public DateTime Date{get; set;}
    public string Message {get; set;}
    [Key]
    public string SubjectId {get; set;}


}
