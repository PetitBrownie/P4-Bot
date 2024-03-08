

interface WeatherData {
    date: string;
    value: number;
}

interface Coordinates {
    lat: number;
    lon: number;
    dates: WeatherData[];
}

interface WeatherParameter {
    parameter: string;
    coordinates: Coordinates[];
}

interface ApiResponse {
    version: string;
    user: string;
    dateGenerated: string;
    status: string;
    data: WeatherParameter[];
}

export { ApiResponse, WeatherParameter, Coordinates, WeatherData };