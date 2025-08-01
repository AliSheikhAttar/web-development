# To_DoApiCli.Api.ToDoApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|--------|--------------|-------------|
| [**ToDoGet**](ToDoApi.md#todoget) | **GET** /To_Do_ |  |
| [**ToDoIdDelete**](ToDoApi.md#todoiddelete) | **DELETE** /To_Do_/{id} |  |
| [**ToDoIdGet**](ToDoApi.md#todoidget) | **GET** /To_Do_/{id} |  |
| [**ToDoPost**](ToDoApi.md#todopost) | **POST** /To_Do_ |  |

<a name="todoget"></a>
# **ToDoGet**
> List&lt;ToDo&gt; ToDoGet ()



### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using To_DoApiCli.Api;
using To_DoApiCli.Client;
using To_DoApiCli.Model;

namespace Example
{
    public class ToDoGetExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost";
            var apiInstance = new ToDoApi(config);

            try
            {
                List<ToDo> result = apiInstance.ToDoGet();
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ToDoApi.ToDoGet: " + e.Message);
                Debug.Print("Status Code: " + e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

#### Using the ToDoGetWithHttpInfo variant
This returns an ApiResponse object which contains the response data, status code and headers.

```csharp
try
{
    ApiResponse<List<ToDo>> response = apiInstance.ToDoGetWithHttpInfo();
    Debug.Write("Status Code: " + response.StatusCode);
    Debug.Write("Response Headers: " + response.Headers);
    Debug.Write("Response Body: " + response.Data);
}
catch (ApiException e)
{
    Debug.Print("Exception when calling ToDoApi.ToDoGetWithHttpInfo: " + e.Message);
    Debug.Print("Status Code: " + e.ErrorCode);
    Debug.Print(e.StackTrace);
}
```

### Parameters
This endpoint does not need any parameter.
### Return type

[**List&lt;ToDo&gt;**](ToDo.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="todoiddelete"></a>
# **ToDoIdDelete**
> void ToDoIdDelete (string id)



### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using To_DoApiCli.Api;
using To_DoApiCli.Client;
using To_DoApiCli.Model;

namespace Example
{
    public class ToDoIdDeleteExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost";
            var apiInstance = new ToDoApi(config);
            var id = "id_example";  // string | 

            try
            {
                apiInstance.ToDoIdDelete(id);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ToDoApi.ToDoIdDelete: " + e.Message);
                Debug.Print("Status Code: " + e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

#### Using the ToDoIdDeleteWithHttpInfo variant
This returns an ApiResponse object which contains the response data, status code and headers.

```csharp
try
{
    apiInstance.ToDoIdDeleteWithHttpInfo(id);
}
catch (ApiException e)
{
    Debug.Print("Exception when calling ToDoApi.ToDoIdDeleteWithHttpInfo: " + e.Message);
    Debug.Print("Status Code: " + e.ErrorCode);
    Debug.Print(e.StackTrace);
}
```

### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** |  |  |

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="todoidget"></a>
# **ToDoIdGet**
> ToDo ToDoIdGet (string id)



### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using To_DoApiCli.Api;
using To_DoApiCli.Client;
using To_DoApiCli.Model;

namespace Example
{
    public class ToDoIdGetExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost";
            var apiInstance = new ToDoApi(config);
            var id = "id_example";  // string | 

            try
            {
                ToDo result = apiInstance.ToDoIdGet(id);
                Debug.WriteLine(result);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ToDoApi.ToDoIdGet: " + e.Message);
                Debug.Print("Status Code: " + e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

#### Using the ToDoIdGetWithHttpInfo variant
This returns an ApiResponse object which contains the response data, status code and headers.

```csharp
try
{
    ApiResponse<ToDo> response = apiInstance.ToDoIdGetWithHttpInfo(id);
    Debug.Write("Status Code: " + response.StatusCode);
    Debug.Write("Response Headers: " + response.Headers);
    Debug.Write("Response Body: " + response.Data);
}
catch (ApiException e)
{
    Debug.Print("Exception when calling ToDoApi.ToDoIdGetWithHttpInfo: " + e.Message);
    Debug.Print("Status Code: " + e.ErrorCode);
    Debug.Print(e.StackTrace);
}
```

### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **id** | **string** |  |  |

### Return type

[**ToDo**](ToDo.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

<a name="todopost"></a>
# **ToDoPost**
> void ToDoPost (ToDo toDo = null)



### Example
```csharp
using System.Collections.Generic;
using System.Diagnostics;
using To_DoApiCli.Api;
using To_DoApiCli.Client;
using To_DoApiCli.Model;

namespace Example
{
    public class ToDoPostExample
    {
        public static void Main()
        {
            Configuration config = new Configuration();
            config.BasePath = "http://localhost";
            var apiInstance = new ToDoApi(config);
            var toDo = new ToDo(); // ToDo |  (optional) 

            try
            {
                apiInstance.ToDoPost(toDo);
            }
            catch (ApiException  e)
            {
                Debug.Print("Exception when calling ToDoApi.ToDoPost: " + e.Message);
                Debug.Print("Status Code: " + e.ErrorCode);
                Debug.Print(e.StackTrace);
            }
        }
    }
}
```

#### Using the ToDoPostWithHttpInfo variant
This returns an ApiResponse object which contains the response data, status code and headers.

```csharp
try
{
    apiInstance.ToDoPostWithHttpInfo(toDo);
}
catch (ApiException e)
{
    Debug.Print("Exception when calling ToDoApi.ToDoPostWithHttpInfo: " + e.Message);
    Debug.Print("Status Code: " + e.ErrorCode);
    Debug.Print(e.StackTrace);
}
```

### Parameters

| Name | Type | Description | Notes |
|------|------|-------------|-------|
| **toDo** | [**ToDo**](ToDo.md) |  | [optional]  |

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Success |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

