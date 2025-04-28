<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AmadeusService
{
    protected $apiUrl;
    protected $accessToken;

    public function __construct()
    {
        $this->apiUrl = env('AMADEUS_API_URL');
        $this->accessToken = $this->getAccessToken();
    }

    private function getAccessToken()
    {
        $response = Http::asForm()->post("$this->apiUrl/v1/security/oauth2/token", [
            'grant_type' => 'client_credentials',
            'client_id' => env('AMADEUS_API_KEY'),
            'client_secret' => env('AMADEUS_API_SECRET'),
        ]);

        return $response->json()['access_token'] ?? null;
    }

    public function searchFlights($origin, $destination, $departureDate)
{
    try {
        $response = Http::withToken($this->accessToken)->get("$this->apiUrl/v2/shopping/flight-offers", [
            'originLocationCode' => $origin,
            'destinationLocationCode' => $destination,
            'departureDate' => $departureDate,
            'adults' => 1
        ]);

        $apiData = $response->json();

        if (!isset($apiData['data']) || empty($apiData['data'])) {
            return ['error' => 'Không có chuyến bay nào được tìm thấy.'];
        }
        return $apiData['data'];
    } catch (\Exception $e) {
        return ['error' => 'Không thể lấy dữ liệu chuyến bay: ' . $e->getMessage()];
    }
}


}
