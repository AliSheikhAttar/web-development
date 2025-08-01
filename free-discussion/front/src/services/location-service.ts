import apiClient from "./api-client";

interface Locationprops
{
    neighborhoods:string
}

class LocationService
{
    Getneighborhoods()
    {
        return apiClient.get<Locationprops[]>('/scheduling/neighborhoods/')
    }
}

export default new LocationService;