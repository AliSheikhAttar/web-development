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
    /// Interaction logic for FindWindow.xaml
    /// </summary>
    public partial class FindWindow : Window
    {
        public FindWindow()
        {
            this.DataContext = this;
            InitializeComponent();
            // Configuration config = new Configuration() {BasePath = "http://localhost:5004"};
            // ToDoApi apiInstance = new ToDoApi(config);
        }
        public string Topic2Find{get;set;}
        public void Close(object? sender, RoutedEventArgs args)
        {

            if(string.IsNullOrEmpty(this.Topic2Find))
            {
                MessageBox.Show("Please enter the topic you want to find");
            }
            else
                this.Close();

        }
   }
}
