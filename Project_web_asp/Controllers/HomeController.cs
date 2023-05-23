using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Project_web_asp.Models;
using Project_AP;
using To_DoApiCli.Client;
using To_DoApiCli.Api;
using Project_web_asp.Models.ViewModels;

namespace Project_web_asp.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        var todoListViewModel = GetAllTodos();
        return View(todoListViewModel);
    }


    public IActionResult Searching(To_Do todo)
    {
        Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
        ToDoApi apiInstance = new ToDoApi(config);
        var found = apiInstance.ToDoIdGet(todo.SubjectId);
        return View(found);
    }
    internal TodoViewModel GetAllTodos()
    {
        List<To_DoApiCli.Model.ToDo> todoList = new List<To_DoApiCli.Model.ToDo>();
        Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
        ToDoApi apiInstance = new ToDoApi(config);
        var res = apiInstance.ToDoGet().ToList();
        return new TodoViewModel
        {
            TodoList = res
        };

        }



        internal To_DoApiCli.Model.ToDo GetById(string id)
        {
            Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
            ToDoApi apiInstance = new ToDoApi(config);
            var todo = apiInstance.ToDoIdGet(id);
            return todo;
        }


    public RedirectResult Deleting(To_Do todo)
    {
        Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
        ToDoApi apiInstance = new ToDoApi(config);
        apiInstance.ToDoIdDelete(todo.SubjectId);
        return Redirect("http://localhost:5212/");
    }
    public RedirectResult Adding(To_Do todo)
    {
        Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
        ToDoApi apiInstance = new ToDoApi(config);
        var x = new To_DoApiCli.Model.ToDo(todo.Date,todo.Message,todo.SubjectId);
        apiInstance.ToDoPost(x);
        return Redirect("http://localhost:5212/");
    }
}
