using System;
using System.Collections.Generic;
using System.Text;

namespace Tbh.Online.Test.Model.App
{
    public class CrudResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public int Id { get; set; }
        public object Entity { get; set; }
        public CrudResult()
        {

        }
        public CrudResult(bool success, string message)
        {
            Success = success;
            Message = message;
        }
        public CrudResult(bool success, string message, int id)
        {
            Success = success;
            Message = message;
            Id = id;
        }
    }
}
