<?php

namespace App\Http\Controllers\API\v1;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
   public function index()
{
    $logs = ActivityLog::with('user')->latest()->get();

    $totalActivities = ActivityLog::count();

    $totalLogins = ActivityLog::where('activity', 'Logged in')->count();

    $failedLogins = ActivityLog::where('activity', 'LIKE', 'Failed login%')->count();

    $totalManagedUsers = ActivityLog::where(function ($query) {
        $query->where('activity', 'LIKE', 'Created user%')
              ->orWhere('activity', 'LIKE', 'Updated user%')
              ->orWhere('activity', 'LIKE', 'Deleted user%')
              ->orWhere('activity', 'LIKE', 'Restored user%');
    })->count();

    return response()->json([
        'status' => 'Success',

        'summary' => [
            'total_activities' => $totalActivities,
            'total_logins' => $totalLogins,
            'failed_logins' => $failedLogins,
            'managed_users' => $totalManagedUsers,
        ],

        'data' => $logs
    ]);
}

}