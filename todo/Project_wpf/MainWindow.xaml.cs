using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using To_DoApiCli.Api;
using To_DoApiCli.Client;
using To_DoApiCli.Model;
using To_DoApiCli.Test;
using Project_AP;
namespace Project_wpf
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        public string Topic{get;set;}
        public string Context{get;set;}
        public DateTime DeadDate{get;set;}
        public ObservableCollection<To_Do> Tasks{get;set;}
        FindWindow findingwindow;
        DeleteWindow deletingwindow;
        public MainWindow()
        {
            InitializeComponent();
            this.DataContext = this;
            Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
            ToDoApi apiInstance = new ToDoApi(config);
            Tasks  = new ObservableCollection<To_Do>();
            var result = apiInstance.ToDoGet();
            foreach(var t in result)
            {
                Tasks.Add(new To_Do(t.SubjectId,t.Date,t.Message));
            }
        }

        public void Add(object? sender, RoutedEventArgs args)
        {
            Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
            ToDoApi apiInstance = new ToDoApi(config);
            
            
            if(string.IsNullOrEmpty(this.Topic))
                MessageBox.Show("Please Enter the Topic!");
            else if(string.IsNullOrEmpty(this.Context))
                MessageBox.Show("Please type some context for your task!");
            else if(string.IsNullOrEmpty(tbDeadDate.Text))
                MessageBox.Show("Please arrange a deadline for your task!");
            else
            {
                DateTime dt = tbDeadDate.SelectedDate.Value;
                Tasks.Add(new To_Do(this.Topic,dt,this.Context));
                To_DoApiCli.Model.ToDo td = new To_DoApiCli.Model.ToDo(dt, this.Context, this.Topic);
                apiInstance.ToDoPost(td);
                MessageBox.Show("Task Added to ToDoList");
                Clear(sender, args);
                Reset(sender, args);
                Get_Tasks(sender, args);
            }
        }
        public void Delete(object? sender, RoutedEventArgs args)
        {
            Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
            ToDoApi apiInstance = new ToDoApi(config);

            var state = false;
            if(string.IsNullOrEmpty(this.Topic))
                MessageBox.Show("Please enter the topic of the task you want to delete!");
            else
            {
                foreach(var t in Tasks)
                {
                    if(t.SubjectId == Topic)
                    {
                        apiInstance.ToDoIdDelete(this.Topic);
                        Tasks.Remove(t);
                        MessageBox.Show("Task removed from ToDoList");
                        Clear(sender, args);
                        state = true;
                        break;
                    }
                }
                if(!state)
                    MessageBox.Show("No task found with the given subject!");
                Clear(sender, args);
                Reset(sender, args);
                Get_Tasks(sender, args);
            }
        }
        public void Clear_List(object? sender, RoutedEventArgs args)
        {
            deletingwindow = new DeleteWindow();
            deletingwindow.Show();
            deletingwindow.Closed+=DeleteProcess;
            Reset(sender, args);
        }
        public void DeleteProcess(object? sender, EventArgs arg)
        {
            if(deletingwindow.state)
            {
                Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
                ToDoApi apiInstance = new ToDoApi(config);
                var res = apiInstance.ToDoGet();
                // for(int i =0;i<Tasks.Count;i++)
                // {
                //     Tasks.RemoveAt(0);
                // }
                foreach(var x in res)
                {
                    apiInstance.ToDoIdDelete(x.SubjectId);
                }


                MessageBox.Show("ToDoList Cleared!");

                return;
            }
            else
            {
                return;
            }
        }
        public void Find_Task(object? sender, RoutedEventArgs args)
        {
            findingwindow = new FindWindow();
            findingwindow.Owner = this;
            findingwindow.Show();
            

            Reset(sender, args);
            findingwindow.Closed+=Findprocess;
            
            
        }
        public void Findprocess(object? sender, EventArgs args)
        {
            Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
            ToDoApi apiInstance = new ToDoApi(config);
            bool state = true;
            try
            {
                apiInstance.ToDoIdGet(findingwindow.Topic2Find);
            }
            catch (System.Exception)
            {  
                Book.Text += $"\n\n\n           Not Found";
                state = false;
            }
            if(!state)
                return;
            var found = apiInstance.ToDoIdGet(findingwindow.Topic2Find);
            Book.Text += $"Result : \n\n\n {found.SubjectId}            {found.Message}          {found.Date}";
            return;
        }
        public void Get_Tasks(object? sender, RoutedEventArgs args)
        {
            Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
            ToDoApi apiInstance = new ToDoApi(config);
            var res = apiInstance.ToDoGet();
            Reset(sender, args);
            if(this.Tasks.Count==0)
                MessageBox.Show("No task to show");
            else
            {
                Book.Text += "Topic                 ToDo                 DeadLine\n\n";
                foreach(var x in res)
                {
                    string re = "";
                    re+=x.SubjectId + "       ";
                    re+=x.Date.ToString()+ "       ";
                    re+=x.Message+ "\n";
                    Book.Text+=re;
                    
                }
            }

        }
        public void Clear(object sender,RoutedEventArgs args)
        {
            tbTopic.Text = string.Empty;
            tbContext.Text = string.Empty;

        }

        public void Reset(object sender,RoutedEventArgs args)
        {
            Book.Text = string.Empty;
        }

    }
}
