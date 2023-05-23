using System.Collections.Generic;
using Project_AP;
namespace Project_web_asp.Models.ViewModels
{
    public class TodoViewModel
    {
        public List<To_DoApiCli.Model.ToDo> TodoList { get; set; }
        public To_Do Todo { get; set; }
    }
}