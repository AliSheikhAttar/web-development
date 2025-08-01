using System;
namespace Project_AP;

using System.Text;
using To_DoApiCli.Api;
using To_DoApiCli.Client;
using To_DoApiCli.Model;

public class To_Do_Program
{
    public static void Main()
    {
        Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
        ToDoApi apiInstance = new ToDoApi(config);
        var state = true;
        while (state)
        {
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine("Please enter the command: \nenter Guide for help");
            string str = Console.ReadLine().ToLower() ;
            while(true)
            {
                if ( str == "add" )
                {
                    AddTo_Do_in_Program();
                    break;
                }
                else if (str == "show")
                {
                    GetTo_Do_in_Program();
                    break;
                }
                else if (str == "delete")
                {
                    DeleteTo_Do_in_Program();
                    break;
                }
                else if (str == "find")
                {
                    FindTo_Do_in_Program();
                    break;
                }
                else if (str == "exit")
                {
                    state = false;
                    break;
                }
                else if (str == "guide")
                {
                    Console.WriteLine("");
                    Console.ForegroundColor = ConsoleColor.Green;
                    Console.Write("Add => ");
                    Console.ForegroundColor = ConsoleColor.White;
                    Console.WriteLine("Add task to ToDo list.");
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.Write("Show => ");
                    Console.ForegroundColor = ConsoleColor.White;
                    Console.WriteLine("Show All tasks from ToDo list.");
                    Console.ForegroundColor = ConsoleColor.DarkYellow;
                    Console.Write("Find => ");
                    Console.ForegroundColor = ConsoleColor.White;
                    Console.WriteLine("Find the specific task.");
                    Console.ForegroundColor = ConsoleColor.Magenta;
                    Console.Write("Delete => ");
                    Console.ForegroundColor = ConsoleColor.White;
                    Console.WriteLine("Delete the selected task by its' subject.");
                    Console.ForegroundColor = ConsoleColor.Cyan;
                    Console.Write("Exit => ");
                    Console.ForegroundColor = ConsoleColor.White;
                    Console.WriteLine("Exit the program.");
                    Console.Write("\n");

                    break;
                }
                else
                {
                    Console.WriteLine("Not valid command");
                    break;
                }
            }
        }
    }

        private static void FindTo_Do_in_Program()
        {
            Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
            ToDoApi apiInstance = new ToDoApi(config);
            while(true)
            {
                Console.Write("Please enter the subject of the task: (enter exit() for Exit) \n");
                var id2find = Console.ReadLine();
                if(id2find == "exit()")
                    break;
                while(true)
                {
                    try
                    {
                        apiInstance.ToDoIdGet(id2find);
                    }
                    catch (System.Exception)
                    {  
                        Console.WriteLine("                       Not Found !\n");
                        break;
                    }
                    var found = apiInstance.ToDoIdGet(id2find);
                    Console.ForegroundColor = ConsoleColor.Cyan;
                    Console.WriteLine($"                                                           --- {found.SubjectId} ---");
                    Console.WriteLine("");
                    Console.ForegroundColor = ConsoleColor.DarkYellow;
                    Console.WriteLine($"                                                                 {found.Message}");
                    Console.WriteLine("");
                    Console.ForegroundColor = ConsoleColor.DarkGreen;
                    Console.WriteLine($"                                                   Due to : {found.Date.ToString()}");
                    break;
                }
            }
        }
    public static void AddTo_Do_in_Program()
    {
        Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
        ToDoApi apiInstance = new ToDoApi(config);
        Console.WriteLine("Please write your Sub: ");
        string subid = Console.ReadLine();

        Console.WriteLine("Please write your Msg: ");
        string msg = Console.ReadLine();
        DateTime dt = new DateTime();
        while(true)
        {
            bool state = true;
            double days = 0;
            Console.WriteLine("Please write the number of days it takes: ");
            if(!double.TryParse(Console.ReadLine(), out days))
            {
                state = false;
                Console.ForegroundColor = ConsoleColor.DarkRed;
                Console.WriteLine("\ninvalid number!\n");
                Console.ForegroundColor = ConsoleColor.White;
            }
            if(state)
            {
                DateTime today = DateTime.Now;
                dt = today.AddDays(days);
                break;
            }
        }

        To_DoApiCli.Model.ToDo td = new To_DoApiCli.Model.ToDo(dt, msg, subid);
        apiInstance.ToDoPost(td);
        Console.ForegroundColor = ConsoleColor.Blue;
        Console.WriteLine("Task Added!");

    } 
    public static void GetTo_Do_in_Program()
    {
        Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
        ToDoApi apiInstance = new ToDoApi(config);
        var res = apiInstance.ToDoGet();
        for(int i = 0;i<res.Count;i++)
        {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine($"                                                           --- {res[i].SubjectId} ---");
            Console.WriteLine("");
            Console.ForegroundColor = ConsoleColor.DarkYellow;
            Console.WriteLine($"                                                             {res[i].Message}");
            Console.WriteLine("");
            Console.ForegroundColor = ConsoleColor.DarkGreen;
            Console.WriteLine($"                                                   Due to : {res[i].Date.ToString()}");
            if(i!=res.Count-1)
            {
                Console.WriteLine("");
                Console.WriteLine("                                                                 *");
                Console.WriteLine("                                                                 *");
                Console.WriteLine("                                                                 *");
                Console.WriteLine("");
            }
        }
    }
    public static void DeleteTo_Do_in_Program()
    {
        Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
        ToDoApi apiInstance = new ToDoApi(config);
        Console.WriteLine("Please enter the subject you wish to delete: ");
        var s2d = Console.ReadLine();
        apiInstance.ToDoIdDelete(s2d);
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine("Task Deleted!");
    }


}