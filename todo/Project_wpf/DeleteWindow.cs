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
    public partial class DeleteWindow : Window
    {
        public bool state{get;set;}
        public DeleteWindow()
        {
            InitializeComponent();
        }
        public void Yes(object? sender, RoutedEventArgs args)
        {
            this.state = true;
            this.Close();

        }
        public void No(object? sender, RoutedEventArgs args)
        {
            this.state = false;
            this.Close();
        }
   }
}
